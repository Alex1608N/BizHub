'use server';

import { db } from '@/db/index';
import { auditLogs, pontaj, utilizatori } from '@/db/schema';
import { desc, and, gte, lte, count, sql, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

/**
 * Preluam activitatea completa a unui utilizator (audit + pontaj) si statistici.
 */
export async function getUserFullActivity(userId: string) {
  const session = await getSession();
  if (!session || (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER')) {
    throw new Error('Neautorizat');
  }

  const logs = await db.query.auditLogs.findMany({
    where: eq(auditLogs.user_id, userId),
    orderBy: [desc(auditLogs.timestamp)],
    limit: 30,
  });

  const attendance = await db.query.pontaj.findMany({
    where: eq(pontaj.user_id, userId),
    orderBy: [desc(pontaj.timestamp)],
    limit: 30,
  });

  // Statistici Audit
  const auditStats = await db
    .select({
      total: count(),
      creates: count(sql`CASE WHEN ${auditLogs.actiune} = 'CREATE' THEN 1 END`),
      updates: count(sql`CASE WHEN ${auditLogs.actiune} = 'UPDATE' THEN 1 END`),
      deletes: count(sql`CASE WHEN ${auditLogs.actiune} = 'DELETE' THEN 1 END`),
    })
    .from(auditLogs)
    .where(eq(auditLogs.user_id, userId));

  // Statistici Pontaj (zile lucrate)
  const attendanceStats = await db
    .select({
      totalDays: count(sql`DISTINCT DATE(${pontaj.timestamp})`),
    })
    .from(pontaj)
    .where(and(eq(pontaj.user_id, userId), eq(pontaj.tip, 'START')));

  return { 
    logs, 
    attendance, 
    stats: {
      audit: auditStats[0] || { total: 0, creates: 0, updates: 0, deletes: 0 },
      daysWorked: attendanceStats[0]?.totalDays || 0
    }
  };
}

/**
 * Rezumatul activității din ziua precedentă (v1.0.1 - Redeploy).
 */
export async function getDailyAuditDigest(companyId?: number) {
  const session = await getSession();
  if (!session) return { total: 0, updates: 0, creates: 0, deletes: 0 };

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;

  try {
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const filters = [
        gte(auditLogs.timestamp, yesterdayStart),
        lte(auditLogs.timestamp, yesterdayEnd)
    ];

    if (targetId) {
        filters.push(eq(auditLogs.companie_id, targetId));
    }

    const [stats] = await db
      .select({
        total: count(),
        updates: count(sql`CASE WHEN ${auditLogs.actiune} = 'UPDATE' THEN 1 END`),
        creates: count(sql`CASE WHEN ${auditLogs.actiune} = 'CREATE' THEN 1 END`),
        deletes: count(sql`CASE WHEN ${auditLogs.actiune} = 'DELETE' THEN 1 END`),
      })
      .from(auditLogs)
      .where(and(...filters));

    return {
      total: stats.total || 0,
      updates: stats.updates || 0,
      creates: stats.creates || 0,
      deletes: stats.deletes || 0,
    };
  } catch (error) {
    console.error('Error fetching daily digest:', error);
    return { total: 0, updates: 0, creates: 0, deletes: 0 };
  }
}

/**
 * Preluăm toate logurile de audit, ordonate cronologic (cele mai noi primele).
 * Doar utilizatorii logați pot vedea auditul. 
 * (În mod normal, doar Admin/Manager, dar vom lăsa filtrarea în pagină/layout).
 */
export async function getAuditLogs(companyId?: number) {
  const session = await getSession();
  if (!session) {
    throw new Error('Neautorizat');
  }

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;

  const logs = await db.query.auditLogs.findMany({
    where: targetId ? eq(auditLogs.companie_id, targetId) : undefined,
    orderBy: [desc(auditLogs.id)],
    with: {
      user: true,
    },
    limit: 100, // Limităm la ultimele 100 de acțiuni pentru performanță MVP
  });

  return logs;
}

/**
 * Preluăm activitatea săptămânală a unui utilizator pentru graficul de Dashboard/Profile.
 * Dacă nu se specifică userId, se preia activitatea utilizatorului logat.
 */
export async function getUserWeeklyActivity(targetUserId?: string) {
  const session = await getSession();
  if (!session) throw new Error('Neautorizat');

  const userId = targetUserId || session.user.id;

  // Securitate: Dacă cerem datele altcuiva, verificăm permisiunile
  if (targetUserId && targetUserId !== session.user.id) {
    if (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER') {
      throw new Error('Nu aveți permisiunea de a vedea activitatea altor utilizatori.');
    }

    if (session.user.rol === 'MANAGER') {
      const [targetUser] = await db.query.utilizatori.findMany({
        where: eq(utilizatori.id, targetUserId)
      });
      if (targetUser?.companie_id !== session.user.companie_id) {
        throw new Error('Puteți vedea doar activitatea angajaților din firma dumneavoastră.');
      }
    }
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  try {
    const weeklyLogs = await db
      .select({
        day: sql`DATE(${auditLogs.timestamp})`,
        count: count(),
      })
      .from(auditLogs)
      .where(and(eq(auditLogs.user_id, userId), gte(auditLogs.timestamp, sevenDaysAgo)))
      .groupBy(sql`DATE(${auditLogs.timestamp})`)
      .orderBy(sql`DATE(${auditLogs.timestamp})`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [todayCount] = await db
      .select({ count: count() })
      .from(auditLogs)
      .where(and(eq(auditLogs.user_id, userId), gte(auditLogs.timestamp, today)));

    return {
      weekly: weeklyLogs.map((l: { day: unknown; count: number }) => ({ day: l.day as string, count: l.count })),
      today: todayCount?.count || 0,
    };
  } catch (error) {
    console.error('Error fetching weekly activity:', error);
    return { weekly: [], today: 0 };
  }
}

