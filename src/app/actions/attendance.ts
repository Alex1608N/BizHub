'use server';

import { db } from '@/db/index';
import { pontaj } from '@/db/schema';
import { eq, and, desc, gte } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type AttendanceType = 'START' | 'END' | 'PAUZA_START' | 'PAUZA_STOP';

export async function getTodayStatus() {
  const session = await getSession();
  if (!session || !session.user.id || !session.user.companie_id) return null;

  // Incepem de la miezul noptii zilei curente
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastStatus = await db.query.pontaj.findFirst({
    where: and(
      eq(pontaj.user_id, session.user.id),
      eq(pontaj.companie_id, session.user.companie_id),
      gte(pontaj.timestamp, today)
    ),
    orderBy: [desc(pontaj.timestamp)],
  });

  return lastStatus;
}

export async function recordAttendance(tip: AttendanceType) {
  const session = await getSession();
  if (!session || !session.user.id || !session.user.companie_id) {
    throw new Error('Neautorizat');
  }

  try {
    await db.insert(pontaj).values({
      user_id: session.user.id,
      companie_id: session.user.companie_id,
      tip: tip,
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Eroare pontaj:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserAttendance(userId: string) {
    const session = await getSession();
    if (!session || (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER')) {
        throw new Error('Neautorizat');
    }

    return await db.query.pontaj.findMany({
        where: eq(pontaj.user_id, userId),
        orderBy: [desc(pontaj.timestamp)],
        limit: 50
    });
}
