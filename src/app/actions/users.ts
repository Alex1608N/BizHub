'use server';

import { db } from '@/db/index';
import { companii, utilizatori, auditLogs, produse, categorii, unitati, invitatii, vanzari, vanzariDetalii, pontaj } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const session = await getSession();
  if (!session) throw new Error('Neautorizat');

  if (session.user.rol === 'ADMIN' && !session.user.companie_id) {
    return await db.query.utilizatori.findMany({
      with: { companie: true },
      orderBy: [desc(utilizatori.id)]
    });
  }

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
        const oldUser = await db.query.utilizatori.findFirst({
            where: eq(utilizatori.id, userId)
        });

        if (!oldUser) throw new Error('Utilizatorul nu există.');

        await db.update(utilizatori)
            .set({
                rol: data.rol !== undefined ? data.rol : oldUser.rol,
                companie_id: data.companie_id === undefined ? oldUser.companie_id : data.companie_id
            })
            .where(eq(utilizatori.id, userId));

        await db.insert(auditLogs).values({
            user_id: session.user.id,
            companie_id: data.companie_id || oldUser.companie_id,
            actiune: 'ACTUALIZARE_PROFIL',
            tabel: 'utilizatori',
            date_vechi: { rol: oldUser.rol, companie_id: oldUser.companie_id },
            date_noi: { rol: data.rol, companie_id: data.companie_id },
        });

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
        const [company] = await db.select().from(companii).where(eq(companii.id, companyId)).limit(1);

        if (!company) {
            return { success: false, error: 'Firma nu există.' };
        }

        // Executăm totul într-o singură tranzacție pentru a asigura integritatea datelor
        await db.transaction(async (tx) => {
            // Ștergem în ordinea corectă pentru a respecta constrângerile de Foreign Key
            
            // 1. Detalii vânzări (depind de vânzări și produse)
            const sales = await tx.select({ id: vanzari.id }).from(vanzari).where(eq(vanzari.companie_id, companyId));
            const saleIds = sales.map(s => s.id);
            if (saleIds.length > 0) {
                await tx.delete(vanzariDetalii).where(inArray(vanzariDetalii.vanzare_id, saleIds));
            }

            // 2. Vânzări
            await tx.delete(vanzari).where(eq(vanzari.companie_id, companyId));

            // 3. Pontaj
            await tx.delete(pontaj).where(eq(pontaj.companie_id, companyId));

            // 4. Produse
            await tx.delete(produse).where(eq(produse.companie_id, companyId));

            // 5. Categorii și Unități
            await tx.delete(categorii).where(eq(categorii.companie_id, companyId));
            await tx.delete(unitati).where(eq(unitati.companie_id, companyId));

            // 6. Invitatii
            await tx.delete(invitatii).where(eq(invitatii.companie_id, companyId));

            // 7. Audit Logs (pentru a putea șterge utilizatorii, trebuie curățat și auditul)
            await tx.delete(auditLogs).where(eq(auditLogs.companie_id, companyId));

            // 8. Utilizatori
            await tx.delete(utilizatori).where(eq(utilizatori.companie_id, companyId));

            // 9. În final, firma
            await tx.delete(companii).where(eq(companii.id, companyId));
        });

        revalidatePath('/firme');
        revalidatePath('/utilizatori');
        revalidatePath('/catalog');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting company:', error);
        return { success: false, error: 'Nu s-a putut șterge firma. Eroare de sistem.' };
    }
}

export async function deleteUser(userId: string) {
    const session = await getSession();
    if (!session) return { success: false, error: 'Neautorizat.' };

    if (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER') {
        return { success: false, error: 'Doar Admin sau Manager poate șterge utilizatori.' };
    }

    try {
        const [user] = await db.select().from(utilizatori).where(eq(utilizatori.id, userId)).limit(1);

        if (!user) return { success: false, error: 'Utilizatorul nu există.' };

        if (session.user.rol === 'MANAGER' && user.companie_id !== session.user.companie_id) {
            return { success: false, error: 'Nu poți șterge utilizatori din alte firme.' };
        }

        await db.delete(utilizatori).where(eq(utilizatori.id, userId));

        await db.insert(auditLogs).values({
            user_id: session.user.id,
            companie_id: user.companie_id || null,
            actiune: 'STERGERE_ANGAJAT',
            tabel: 'utilizatori',
            date_vechi: { nume: user.nume, email: user.email, rol: user.rol },
            date_noi: null,
        });

        revalidatePath('/utilizatori');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
