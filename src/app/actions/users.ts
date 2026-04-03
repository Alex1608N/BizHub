'use server';

import { db } from '@/db/index';
import { companii, utilizatori, auditLogs, produse, categorii, unitati, invitatii } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
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

export async function updateUserDetails(userId: string, data: { rol: any, companie_id?: number | null }) {
    const session = await getSession();
    if (!session || session.user.rol !== 'ADMIN') throw new Error('Doar un Admin poate muta utilizatorii între firme.');

    try {
        await db.update(utilizatori)
            .set({
                rol: data.rol,
                companie_id: data.companie_id === undefined ? undefined : data.companie_id
            })
            .where(eq(utilizatori.id, userId));
        revalidatePath('/utilizatori');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteCompany(companyId: number) {
    const session = await getSession();
    if (!session || session.user.rol !== 'ADMIN') {
        return { success: false, error: 'Doar Admin poate șterge firme.' };
    }

    try {
        const [company] = await db.query.companii.findMany({
            where: eq(companii.id, companyId)
        });

        if (!company) {
            return { success: false, error: 'Firma nu există.' };
        }

        // Stergem toate datele asociate firmei (in ordine pentru a evita constraint violations)
        
        // 1. Stergem utilizatorii firmei
        await db.delete(utilizatori).where(eq(utilizatori.companie_id, companyId));
        
        // 2. Stergem produsele firmei
        await db.delete(produse).where(eq(produse.companie_id, companyId));
        
        // 3. Stergem categoriile firmei
        await db.delete(categorii).where(eq(categorii.companie_id, companyId));
        
        // 4. Stergem unitatile firmei
        await db.delete(unitati).where(eq(unitati.companie_id, companyId));
        
        // 5. Stergem invitatiile firmei
        await db.delete(invitatii).where(eq(invitatii.companie_id, companyId));
        
        // 6. Stergem firma
        await db.delete(companii).where(eq(companii.id, companyId));

        await db.insert(auditLogs).values({
            user_id: session.user.id,
            companie_id: companyId,
            actiune: 'STERGERE_FIRMA',
            tabel: 'companii',
            date_vechi: JSON.stringify({ nume: company.nume, cui: company.cui }),
            date_noi: null,
        });

        revalidatePath('/firme');
        revalidatePath('/utilizatori');
        revalidatePath('/catalog');
        revalidatePath('/unitati');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting company:', error);
        return { success: false, error: 'Nu s-a putut șterge firma. Verificați dacă există date asociate.' };
    }
}

export async function deleteUser(userId: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Neautorizat.' };
    }

    if (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER') {
        return { success: false, error: 'Doar Admin sau Manager poate șterge utilizatori.' };
    }

    try {
        const [user] = await db.query.utilizatori.findMany({
            where: eq(utilizatori.id, userId)
        });

        if (!user) {
            return { success: false, error: 'Utilizatorul nu există.' };
        }

        if (session.user.rol === 'MANAGER') {
            if (user.companie_id !== session.user.companie_id) {
                return { success: false, error: 'Nu poți șterge utilizatori din alte firme.' };
            }
        }

        await db.delete(utilizatori).where(eq(utilizatori.id, userId));

        await db.insert(auditLogs).values({
            user_id: session.user.id,
            companie_id: user.companie_id || null,
            actiune: 'STERGERE_ANGAJAT',
            tabel: 'utilizatori',
            date_vechi: JSON.stringify({ nume: user.nume, email: user.email, rol: user.rol }),
            date_noi: null,
        });

        revalidatePath('/utilizatori');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
