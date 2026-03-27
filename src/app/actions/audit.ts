'use server';

import { db } from '@/db/index';
import { auditLogs } from '@/db/schema';
import { desc, and, gte, lte, count, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

/**
 * Calculeaza rezumatul activitatii din ziua precedenta folosind agregari SQL.
 */
export async function getDailyAuditDigest() {
  const session = await getSession();
  if (!session) return { total: 0, updates: 0, creates: 0, deletes: 0 };

  try {
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const [stats] = await db
      .select({
        total: count(),
        updates: count(sql`CASE WHEN ${auditLogs.actiune} = 'UPDATE' THEN 1 END`),
        creates: count(sql`CASE WHEN ${auditLogs.actiune} = 'CREATE' THEN 1 END`),
        deletes: count(sql`CASE WHEN ${auditLogs.actiune} = 'DELETE' THEN 1 END`),
      })
      .from(auditLogs)
      .where(
        and(
          gte(auditLogs.timestamp, yesterdayStart),
          lte(auditLogs.timestamp, yesterdayEnd)
        )
      );

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
export async function getAuditLogs() {
  const session = await getSession();
  if (!session) {
    throw new Error('Neautorizat');
  }

  const logs = await db.query.auditLogs.findMany({
    orderBy: [desc(auditLogs.id)],
    with: {
      user: true,
    },
    limit: 100, // Limităm la ultimele 100 de acțiuni pentru performanță MVP
  });

  return logs;
}
