'use server';

import { db } from '@/db/index';
import { produse, categorii, unitati, auditLogs } from '@/db/schema';
import { eq, inArray, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auditLog, canUserEditProduct } from '@/lib/audit';
import { getSession } from '@/lib/auth';

export async function getProducts() {
  const session = await getSession();
  const products = await db.query.produse.findMany({
    with: {
      categorie: true,
      unitate: true,
    },
  });

  if (!session) {
    return products.map(p => ({ ...p, isEditable: false }));
  }

  const userRole = session.user.rol;
  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    return products.map(p => ({ ...p, isEditable: true }));
  }

  const allCreateLogs = await db.query.auditLogs.findMany({
    where: and(
      eq(auditLogs.actiune, 'CREATE'),
      eq(auditLogs.tabel, 'produse')
    )
  });

  const sapteZileInMs = 7 * 24 * 60 * 60 * 1000;
  const acum = Date.now();

  const creationDatesMap = new Map<number, number>();
  allCreateLogs.forEach(log => {
    try {
      const data = JSON.parse(log.date_noi || '{}');
      if (data.id) creationDatesMap.set(data.id, new Date(log.timestamp).getTime());
    } catch (e) {}
  });

  return products.map(p => {
    const dataCreare = creationDatesMap.get(p.id);
    const isWithinWindow = dataCreare ? (acum - dataCreare) < sapteZileInMs : false;
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
      return { success: false, error: 'Fereastra de editare stoc a expirat.' };
    }

    const product = await db.query.produse.findFirst({ 
      where: eq(produse.id, id),
      with: { unitate: true }
    });
    if (!product) throw new Error('Produsul nu a fost gasit');

    const newStock = product.stoc + quantityChange;
    if (newStock < 0) throw new Error('Stoc insuficient');

    const [updatedProduct] = await db.update(produse).set({ stoc: newStock }).where(eq(produse.id, id)).returning();

    await auditLog(db, {
      user_id: session.user.id,
      actiune: 'UPDATE',
      tabel: 'stoc',
      date_vechi: { 
        id: product.id, 
        nume: product.nume, 
        stoc: product.stoc, 
        unitate: product.unitate?.simbol || 'Buc',
        pret: product.pret 
      },
      date_noi: { 
        id: updatedProduct.id, 
        nume: product.nume, 
        stoc: updatedProduct.stoc, 
        unitate: product.unitate?.simbol || 'Buc',
        pret: product.pret 
      },
    });

    revalidatePath('/catalog');
    return { success: true };
  } catch (error: any) {
    console.error('Error recording stock movement:', error);
    return { success: false, error: error.message || 'Eroare la actualizarea stocului' };
  }
}
