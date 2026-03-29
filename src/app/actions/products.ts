'use server';

import { db } from '@/db/index';
import { produse, categorii, unitati, auditLogs } from '@/db/schema';
import { eq, inArray, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auditLog, canUserEditProduct } from '@/lib/audit';
import { getSession } from '@/lib/auth';

export async function getDashboardStats() {
  try {
    const [stats] = await db.select({
      totalValue: sql<number>`SUM(${produse.stoc} * ${produse.pret}) / 100`,
      totalProducts: sql<number>`COUNT(${produse.id})`,
      lowStockCount: sql<number>`COUNT(CASE WHEN ${produse.stoc} < 5 THEN 1 END)`
    }).from(produse);

    return {
      totalValue: Number(stats.totalValue || 0),
      totalProducts: Number(stats.totalProducts || 0),
      lowStockCount: Number(stats.lowStockCount || 0)
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalValue: 0, totalProducts: 0, lowStockCount: 0 };
  }
}

export async function getProducts() {
  const session = await getSession();
  const results = await db.select({
    id: produse.id,
    nume: produse.nume,
    descriere: produse.descriere,
    pret: produse.pret,
    stoc: produse.stoc,
    categorie_id: produse.categorie_id,
    unitate_id: produse.unitate_id,
    created_at: produse.created_at,
    categorie: {
      id: categorii.id,
      nume: categorii.nume,
    },
    unitate: {
      id: unitati.id,
      simbol: unitati.simbol,
    }
  })
  .from(produse)
  .leftJoin(categorii, eq(produse.categorie_id, categorii.id))
  .leftJoin(unitati, eq(produse.unitate_id, unitati.id));

  if (!session) {
    return results.map((p: any) => ({ ...p, isEditable: false }));
  }

  const userRole = session.user.rol;
  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    return results.map((p: any) => ({ ...p, isEditable: true }));
  }

  const sapteZileInMs = 7 * 24 * 60 * 60 * 1000;
  const acum = Date.now();

  return results.map((p: any) => {
    const dataCreare = p.created_at ? new Date(p.created_at).getTime() : acum;
    const isWithinWindow = (acum - dataCreare) < sapteZileInMs;
    return { ...p, isEditable: isWithinWindow };
  });
}

export async function getCategories() {
  return await db.select().from(categorii);
}

export async function getUnits() {
  return await db.select().from(unitati);
}

export async function createCategory(data: { nume: string; descriere?: string }) {
  const session = await getSession();
  try {
    const [newCategory] = await db.insert(categorii).values(data).returning();
    await auditLog(db, {
      user_id: session?.user?.id || null,
      actiune: 'CREATE',
      tabel: 'categorii',
      date_noi: newCategory,
    });
    revalidatePath('/catalog');
    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Categoria exista deja sau a aparut o eroare' };
  }
}

export async function importProducts(data: any[]) {
  const session = await getSession();
  try {
    let importedCount = 0;
    for (const item of data) {
      if (!item.nume) continue;

      let catId: number | undefined;
      if (item.categorie) {
        const existingCat = await db.query.categorii.findFirst({
          where: eq(categorii.nume, item.categorie),
        });
        if (existingCat) {
          catId = existingCat.id;
        } else {
          const [newCat] = await db.insert(categorii).values({ nume: item.categorie }).returning();
          catId = newCat.id;
        }
      }

      let unitId: number | undefined;
      if (item.unitate) {
        const existingUnit = await db.query.unitati.findFirst({
          where: eq(unitati.simbol, item.unitate),
        });
        if (existingUnit) unitId = existingUnit.id;
      }

      const [newProduct] = await db.insert(produse).values({
        nume: item.nume,
        descriere: item.descriere || '',
        pret: Math.round(parseFloat(item.pret.toString().replace(',', '.')) * 100) || 0,
        stoc: parseInt(item.stoc?.toString()) || 0,
        categorie_id: catId,
        unitate_id: unitId,
      }).returning();

      if (newProduct) {
        await auditLog(db, {
          user_id: session?.user?.id || null,
          actiune: 'IMPORT',
          tabel: 'produse',
          date_noi: newProduct,
        });
        importedCount++;
      }
    }
    revalidatePath('/catalog');
    return { success: true, count: importedCount };
  } catch (error) {
    console.error('Error importing products:', error);
    return { success: false, error: 'Eroare la importul masiv' };
  }
}

export async function addProduct(data: {
  nume: string;
  descriere?: string;
  pret: number;
  stoc: number;
  categorie_id?: number;
  unitate_id?: number;
}) {
  const session = await getSession();
  try {
    const [newProduct] = await db.insert(produse).values(data).returning();
    await auditLog(db, {
      user_id: session?.user?.id || null,
      actiune: 'CREATE',
      tabel: 'produse',
      date_noi: newProduct,
    });
    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: 'Failed to add product' };
  }
}

export async function updateProduct(id: number, data: Partial<{
  nume: string;
  descriere?: string;
  pret: number;
  stoc: number;
  categorie_id?: number;
  unitate_id?: number;
}>) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Neautorizat' };

  try {
    const canEdit = await canUserEditProduct(id, session.user.rol);
    if (!canEdit) {
      return { success: false, error: 'Fereastra de editare de 7 zile a expirat.' };
    }

    const oldProduct = await db.query.produse.findFirst({ where: eq(produse.id, id) });
    const [updatedProduct] = await db.update(produse).set(data).where(eq(produse.id, id)).returning();

    await auditLog(db, {
      user_id: session.user.id,
      actiune: 'UPDATE',
      tabel: 'produse',
      date_vechi: oldProduct,
      date_noi: updatedProduct,
    });

    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: number) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Neautorizat' };

  try {
    const canEdit = await canUserEditProduct(id, session.user.rol);
    if (!canEdit) {
      return { success: false, error: 'Fereastra de editare a expirat.' };
    }

    const oldProduct = await db.query.produse.findFirst({ where: eq(produse.id, id) });
    await db.delete(produse).where(eq(produse.id, id));

    await auditLog(db, {
      user_id: session.user.id,
      actiune: 'DELETE',
      tabel: 'produse',
      date_vechi: oldProduct,
    });

    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function recordStockMovement(id: number, quantityChange: number) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Neautorizat' };

  try {
    const canEdit = await canUserEditProduct(id, session.user.rol);
    if (!canEdit) {
      return { success: false, error: 'Fereastra de editare a expirat.' };
    }

    // Facem update direct cu verificare de stoc negativ într-o singură interogare (atomic)
    const [updatedProduct] = await db.update(produse)
      .set({ 
        stoc: sql`${produse.stoc} + ${quantityChange}` 
      })
      .where(and(
        eq(produse.id, id),
        sql`${produse.stoc} + ${quantityChange} >= 0` // Prevenim stoc negativ la nivel de SQL
      ))
      .returning();

    if (!updatedProduct) {
      return { success: false, error: 'Stocul nu poate fi negativ sau produsul nu exista.' };
    }

    await auditLog(db, {
      user_id: session.user.id,
      actiune: 'UPDATE',
      tabel: 'produse',
      date_noi: updatedProduct,
    });

    revalidatePath('/catalog');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error recording stock movement:', error);
    return { success: false, error: 'Eroare la actualizarea stocului.' };
  }
}

export async function getLowStockProducts(limit = 10) {
  try {
    return await db.select({
      id: produse.id,
      nume: produse.nume,
      stoc: produse.stoc,
      unitate: {
        simbol: unitati.simbol
      }
    })
    .from(produse)
    .leftJoin(unitati, eq(produse.unitate_id, unitati.id))
    .where(sql`${produse.stoc} < 5`)
    .limit(limit);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
}

export async function getStockValue() {
  const stats = await getDashboardStats();
  return stats.totalValue;
}
