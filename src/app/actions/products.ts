'use server';

import { db } from '@/db/index';
import { produse, categorii, unitati } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auditLog } from '@/lib/audit';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

// Schema de validare pentru produse
const productSchema = z.object({
  nume: z.string().min(3, "Numele trebuie să aibă minim 3 caractere"),
  descriere: z.string().optional(),
  pret: z.number().int().nonnegative(),
  stoc: z.number().int().default(0),
  categorie_id: z.number().int().optional(),
  unitate_id: z.number().int().optional(),
  companie_id: z.number().int().optional(), // Permitem trimiterea ID-ului de la client pentru Admin
});

export async function getDashboardStats(companyId?: number) {
  const session = await getSession();
  if (!session) return { totalValue: 0, totalProducts: 0, lowStockCount: 0 };

  // Admin poate vedea stats pt o firma specifica sau global (daca nu trimite ID)
  const targetId = companyId || session.user.companie_id;

  try {
    const query = db.select({
      totalValue: sql<number>`SUM(${produse.stoc} * ${produse.pret}) / 100`,
      totalProducts: sql<number>`COUNT(${produse.id})`,
      lowStockCount: sql<number>`COUNT(CASE WHEN ${produse.stoc} < 5 THEN 1 END)`
    }).from(produse);

    const [stats] = await (targetId ? query.where(eq(produse.companie_id, targetId)) : query);

    return {
      totalValue: Number(stats?.totalValue || 0),
      totalProducts: Number(stats?.totalProducts || 0),
      lowStockCount: Number(stats?.lowStockCount || 0)
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalValue: 0, totalProducts: 0, lowStockCount: 0 };
  }
}

export async function getProducts(companyId?: number) {
  const session = await getSession();
  if (!session) return [];

  const baseQuery = db.select({
    id: produse.id,
    nume: produse.nume,
    descriere: produse.descriere,
    pret: produse.pret,
    stoc: produse.stoc,
    categorie_id: produse.categorie_id,
    unitate_id: produse.unitate_id,
    companie_id: produse.companie_id,
    created_at: produse.created_at,
    categorie: { id: categorii.id, nume: categorii.nume },
    unitate: { id: unitati.id, simbol: unitati.simbol }
  })
  .from(produse)
  .leftJoin(categorii, eq(produse.categorie_id, categorii.id))
  .leftJoin(unitati, eq(produse.unitate_id, unitati.id));

  // Daca e Admin si avem companyId in URL, filtram dupa el.
  // Daca e Admin si NU avem companyId, vede TOATE produsele.
  // Daca e User normal, vede DOAR produsele firmei lui.
  const targetId = companyId || session.user.companie_id;
  
  const results = await (targetId ? baseQuery.where(eq(produse.companie_id, targetId)) : baseQuery);
  const canEdit = session.user.rol === 'ADMIN' || session.user.rol === 'MANAGER';

  return results.map(p => ({ ...p, isEditable: canEdit }));
}

export async function getCategories(companyId?: number) {
  const session = await getSession();
  if (!session) return [];
  
  const targetId = companyId || session.user.companie_id;

  if (!targetId) {
      return await db.select().from(categorii);
  }
  
  return await db.select().from(categorii).where(eq(categorii.companie_id, targetId as number));
}

export async function addProduct(rawDate: any) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Neautorizat' };

  // Securitate: Daca NU e Admin, ii fortam companie_id-ul din sesiune.
  // Daca E Admin, il lasam sa foloseasca companie_id-ul trimis din UI (cel al firmei pe care o gestioneaza acum).
  let finalCompanyId = session.user.rol === 'ADMIN' ? rawDate.companie_id : session.user.companie_id;

  if (!finalCompanyId) {
      return { success: false, error: 'Lipsă ID Companie. Te rugăm să selectezi o firmă.' };
  }

  try {
    const validatedData = productSchema.parse(rawDate);
    
    const [newProduct] = await db.insert(produse).values({
      nume: validatedData.nume,
      descriere: validatedData.descriere,
      pret: validatedData.pret,
      stoc: validatedData.stoc,
      categorie_id: validatedData.categorie_id,
      unitate_id: validatedData.unitate_id,
      companie_id: finalCompanyId
    }).returning();

    await auditLog(db, {
      user_id: session.user.id,
      companie_id: finalCompanyId,
      actiune: 'CREATE',
      tabel: 'produse',
      date_noi: newProduct,
    });

    revalidatePath('/catalog');
    return { success: true };
  } catch (error: any) {
    console.error('Add product error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: 'A apărut o eroare la crearea produsului.' };
  }
}

export async function createCategory(data: { nume: string, companie_id?: number }) {
    const session = await getSession();
    if (!session) return { success: false, error: 'Neautorizat' };

    let finalCompanyId = session.user.rol === 'ADMIN' ? data.companie_id : session.user.companie_id;

    if (!finalCompanyId) return { success: false, error: 'Lipsă ID Companie.' };

    try {
        const [newCat] = await db.insert(categorii).values({
            nume: data.nume,
            companie_id: finalCompanyId
        }).returning();
        revalidatePath('/catalog');
        return { success: true, category: newCat };
    } catch (error: any) {
        console.error('Create category error:', error);
        return { success: false, error: 'A apărut o eroare la crearea categoriei.' };
    }
}

export async function updateProduct(id: number, rawData: any) {
    const session = await getSession();
    if (!session) return { success: false, error: 'Neautorizat' };

    try {
        const validatedData = productSchema.partial().parse(rawData);

        // Fortam filtrarea pe companie pt useri normali
        const whereClause = session.user.rol === 'ADMIN' 
            ? eq(produse.id, id) 
            : and(eq(produse.id, id), eq(produse.companie_id, session.user.companie_id as number));

        const [updated] = await db.update(produse)
            .set({
                nume: validatedData.nume,
                descriere: validatedData.descriere,
                pret: validatedData.pret,
                stoc: validatedData.stoc,
                categorie_id: validatedData.categorie_id,
                unitate_id: validatedData.unitate_id
            })
            .where(whereClause)
            .returning();
            
        if (!updated) return { success: false, error: 'Produsul nu a fost găsit sau nu ai permisiuni.' };

        revalidatePath('/catalog');
        return { success: true };
    } catch (error: any) {
        console.error('Update product error:', error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: 'A apărut o eroare la actualizare.' };
    }
}

export async function recordStockMovement(id: number, quantityChange: number) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Neautorizat' };

  try {
    const whereClause = session.user.rol === 'ADMIN'
        ? and(eq(produse.id, id), sql`${produse.stoc} + ${quantityChange} >= 0`)
        : and(
            eq(produse.id, id),
            eq(produse.companie_id, session.user.companie_id as number),
            sql`${produse.stoc} + ${quantityChange} >= 0`
          );

    const [updatedProduct] = await db.update(produse)
      .set({ stoc: sql`${produse.stoc} + ${quantityChange}` })
      .where(whereClause)
      .returning();

    if (!updatedProduct) return { success: false, error: 'Stoc insuficient sau produs inexistent.' };

    await auditLog(db, {
      user_id: session.user.id,
      companie_id: updatedProduct.companie_id,
      actiune: 'UPDATE',
      tabel: 'produse',
      date_noi: updatedProduct,
    });

    revalidatePath('/catalog');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Stock movement error:', error);
    return { success: false, error: 'A apărut o eroare la modificarea stocului.' };
  }
}

export async function deleteProduct(id: number) {
    const session = await getSession();
    if (!session) return { success: false, error: 'Neautorizat' };

    try {
        const whereClause = session.user.rol === 'ADMIN'
            ? eq(produse.id, id)
            : and(eq(produse.id, id), eq(produse.companie_id, session.user.companie_id as number));

        await db.delete(produse).where(whereClause);
        revalidatePath('/catalog');
        return { success: true };
    } catch (error: any) {
        console.error('Delete product error:', error);
        return { success: false, error: 'A apărut o eroare la ștergere.' };
    }
}

export async function importProducts(data: any[]) {
    const session = await getSession();
    if (!session) return { success: false, error: 'Neautorizat', count: 0 };

    // Pentru import, Admin-ul trebuie sa fi selectat o firma in UI care sa trimita ID-ul
    // Deocamdata folosim companie_id din sesiune pt siguranta, sau primul item daca e Admin (simplificat)
    let targetCompanyId = session.user.companie_id;
    
    // TODO: Suport Admin import in firma terta
    if (!targetCompanyId) return { success: false, error: 'Selectează o firmă înainte de import.', count: 0 };

    try {
        const validatedItems = data.map(item => {
            const result = productSchema.safeParse({
                nume: item.nume,
                descriere: item.descriere,
                pret: Number(item.pret) || 0,
                stoc: Number(item.stoc) || 0,
                categorie_id: item.categorie_id ? Number(item.categorie_id) : undefined,
                unitate_id: item.unitate_id ? Number(item.unitate_id) : undefined,
            });
            if (!result.success) return null;
            return {
                ...result.data,
                companie_id: targetCompanyId as number
            };
        }).filter(Boolean) as any[];

        if (validatedItems.length === 0) return { success: false, error: 'Nu am găsit date valide pentru import.', count: 0 };

        await db.transaction(async (tx) => {
            await tx.insert(produse).values(validatedItems);
            
            await auditLog(tx, {
                user_id: session.user.id,
                companie_id: targetCompanyId as number,
                actiune: 'IMPORT',
                tabel: 'produse',
                date_noi: { count: validatedItems.length },
            });
        });

        revalidatePath('/catalog');
        return { success: true, count: validatedItems.length };
    } catch (error: any) {
        console.error('Import error:', error);
        return { success: false, error: 'A apărut o eroare la importul datelor.', count: 0 };
    }
}

export async function getLowStockProducts(limit = 10, companyId?: number) {
  const session = await getSession();
  if (!session) return [];

  const targetId = companyId || session.user.companie_id;

  try {
    const query = db.select({
      id: produse.id,
      nume: produse.nume,
      stoc: produse.stoc,
      unitate: { simbol: unitati.simbol }
    })
    .from(produse)
    .leftJoin(unitati, eq(produse.unitate_id, unitati.id));

    const finalQuery = targetId 
        ? query.where(and(sql`${produse.stoc} < 5`, eq(produse.companie_id, targetId)))
        : query.where(sql`${produse.stoc} < 5`);

    return await finalQuery.limit(limit);
  } catch (error) {
    console.error('Get low stock products error:', error);
    return [];
  }
}
