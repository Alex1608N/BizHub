'use server';

import { db } from '@/db/index';
import { unitati } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUnits() {
  const session = await getSession();
  if (!session) throw new Error('Neautorizat');

  // Super-Adminul vede tot, restul văd doar unitățile firmei lor
  if (session.user.rol === 'ADMIN' && !session.user.companie_id) {
    return await db.query.unitati.findMany({
        with: { companie: true }
    });
  }

  return await db.query.unitati.findMany({
    where: eq(unitati.companie_id, session.user.companie_id as number),
  });
}

export async function addUnit(data: { nume: string, simbol: string }) {
  const session = await getSession();
  if (!session || !session.user.companie_id) throw new Error('Neautorizat');

  try {
    const [newUnit] = await db.insert(unitati).values({
      ...data,
      companie_id: session.user.companie_id,
    }).returning();
    
    revalidatePath('/unitati');
    return { success: true, unit: newUnit };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUnit(id: number) {
    const session = await getSession();
    if (!session || !session.user.companie_id) throw new Error('Neautorizat');

    try {
        await db.delete(unitati).where(
            and(
                eq(unitati.id, id),
                eq(unitati.companie_id, session.user.companie_id)
            )
        );
        revalidatePath('/unitati');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
