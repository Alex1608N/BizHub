'use server';

import { db } from '@/db/index';
import { companii, utilizatori } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const session = await getSession();
  if (!session) throw new Error('Neautorizat');

  // Super-Adminul vede toți utilizatorii din toate firmele
  if (session.user.rol === 'ADMIN' && !session.user.companie_id) {
    return await db.query.utilizatori.findMany({
      with: { companie: true },
      orderBy: [desc(utilizatori.id)]
    });
  }

  // Managerul vede doar utilizatorii din firma lui
  return await db.query.utilizatori.findMany({
    where: eq(utilizatori.companie_id, session.user.companie_id as number),
    with: { companie: true },
    orderBy: [desc(utilizatori.id)]
  });
}

export async function getCompanies() {
    const session = await getSession();
    if (!session || session.user.rol !== 'ADMIN') throw new Error('Doar un Admin poate vedea firmele.');

    return await db.query.companii.findMany();
}

export async function addCompany(data: { nume: string, cui?: string }) {
    const session = await getSession();
    if (!session || session.user.rol !== 'ADMIN') throw new Error('Doar un Admin poate adăuga firme.');

    try {
        const [newCompany] = await db.insert(companii).values(data).returning();
        revalidatePath('/utilizatori');
        return { success: true, company: newCompany };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateUserDetails(userId: string, data: { rol: any, companie_id?: number }) {
    const session = await getSession();
    if (!session || session.user.rol !== 'ADMIN') throw new Error('Doar un Admin poate muta utilizatorii între firme.');

    try {
        await db.update(utilizatori)
            .set(data)
            .where(eq(utilizatori.id, userId));
        revalidatePath('/utilizatori');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
