'use server';

import { db } from '@/db/index';
import { produse, categorii, unitati, auditLogs } from '@/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auditLog, canUserEditProduct } from '@/lib/audit';
import { getSession } from '@/lib/auth';

/**
 * Helper pentru a obține compania activă.
 * Dacă ești ADMIN și ai companyId în sesiune/context (viitor) sau ești MANAGER la firma ta.
 */
async function getActiveCompanyId(overrideId?: number) {
  const session = await getSession();
  if (!session) return null;

  // Dacă Adminul a "intrat" într-o firmă (pe viitor putem salva asta în sesiune, 
  // momentan filtrăm în dashboard prin query params, dar acțiunile de scriere 
  // trebuie să știe unde scriu).
  if (overrideId && session.user.rol === 'ADMIN') return overrideId;
  
  return session.user.companie_id;
}

export async function getDashboardStats(companyId?: number) {
  const session = await getSession();
  if (!session) return { totalValue: 0, totalProducts: 0, lowStockCount: 0 };

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;

  try {
    const filters = targetId ? eq(produse.companie_id, targetId) : undefined;

    const [stats] = await db.select({
      totalValue: sql<number>`SUM(${produse.stoc} * ${produse.pret}) / 100`,
      totalProducts: sql<number>`COUNT(${produse.id})`,
      lowStockCount: sql<number>`COUNT(CASE WHEN ${produse.stoc} < 5 THEN 1 END)`
    }).from(produse)
      .where(filters);

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

  // Filtrare inteligentă: 
  // 1. Dacă ești Admin și ai companyId -> vezi acea firmă
  // 2. Dacă ești Admin și NU ai companyId -> vezi tot (global)
  // 3. Dacă ești alt rol -> vezi doar firma ta
  let query = db.select({
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

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;
  
  if (targetId) {
    // @ts-ignore
    query = query.where(eq(produse.companie_id, targetId));
  }

  const results = await query;

  const userRole = session.user.rol;
  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    return results.map((p: any) => ({ ...p, isEditable: true }));
  }

  return results.map((p: any) => ({ ...p, isEditable: false }));
}

export async function getCategories() {
  const session = await getSession();
  if (!session) return [];
  
  if (session.user.rol === 'ADMIN' && !session.user.companie_id) {
      return await db.select().from(categorii);
  }
  
  return await db.select().from(categorii).where(eq(categorii.companie_id, session.user.companie_id as number));
}

export async function getUnits() {
  const session = await getSession();
  if (!session) return [];

  if (session.user.rol === 'ADMIN' && !session.user.companie_id) {
    return await db.select().from(unitati);
  }

  return await db.select().from(unitati).where(eq(unitati.companie_id, session.user.companie_id as number));
}

export async function addProduct(data: any) {
  const session = await getSession();
  if (!session || !session.user.companie_id) return { success: false, error: 'Trebuie să fii asociat unei firme.' };

  try {
    const [newProduct] = await db.insert(produse).values({
      ...data,
      companie_id: session.user.companie_id
    }).returning();

    await auditLog(db, {
      user_id: session.user.id,
      companie_id: session.user.companie_id,
      actiune: 'CREATE',
      tabel: 'produse',
      date_noi: newProduct,
    });

    revalidatePath('/catalog');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategory(data: { nume: string }) {
    const session = await getSession();
    if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat' };

    try {
        const [newCat] = await db.insert(categorii).values({
            ...data,
            companie_id: session.user.companie_id
        }).returning();
        revalidatePath('/catalog');
        return { success: true, category: newCat };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function recordStockMovement(id: number, quantityChange: number) {
  const session = await getSession();
  if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat' };

  try {
    const [updatedProduct] = await db.update(produse)
      .set({ stoc: sql`${produse.stoc} + ${quantityChange}` })
      .where(and(
        eq(produse.id, id),
        eq(produse.companie_id, session.user.companie_id),
        sql`${produse.stoc} + ${quantityChange} >= 0`
      ))
      .returning();

    if (!updatedProduct) return { success: false, error: 'Stoc insuficient sau produs inexistent.' };

    await auditLog(db, {
      user_id: session.user.id,
      companie_id: session.user.companie_id,
      actiune: 'UPDATE',
      tabel: 'produse',
      date_noi: updatedProduct,
    });

    revalidatePath('/catalog');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLowStockProducts(limit = 10, companyId?: number) {
  const session = await getSession();
  if (!session) return [];

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;

  try {
    let query = db.select({
      id: produse.id,
      nume: produse.nume,
      stoc: produse.stoc,
      unitate: { simbol: unitati.simbol }
    })
    .from(produse)
    .leftJoin(unitati, eq(produse.unitate_id, unitati.id))
    .where(sql`${produse.stoc} < 5`);

    if (targetId) {
        // @ts-ignore
        query = query.where(and(sql`${produse.stoc} < 5`, eq(produse.companie_id, targetId)));
    }

    return await query.limit(limit);
  } catch (error) {
    return [];
  }
}

export async function deleteProduct(id: number) {
    const session = await getSession();
    if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat' };

    try {
        await db.delete(produse).where(and(
            eq(produse.id, id),
            eq(produse.companie_id, session.user.companie_id)
        ));
        revalidatePath('/catalog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateProduct(id: number, data: any) {
    const session = await getSession();
    if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat' };

    try {
        const [updated] = await db.update(produse)
            .set(data)
            .where(and(eq(produse.id, id), eq(produse.companie_id, session.user.companie_id)))
            .returning();
        revalidatePath('/catalog');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function importProducts(data: any[]) {
    const session = await getSession();
    if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat' };
    // Logica de import va trebui adaptată similar cu addProduct (companie_id)
    // Pentru simplitate acum, returnăm succes fals dacă nu e implementat complet tenant-aware
    return { success: false, error: 'Importul trebuie actualizat pentru Multi-tenant.' };
}
