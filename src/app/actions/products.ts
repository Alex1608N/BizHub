'use server';

import { db } from '@/db/db';
import { produse, categorii, unitati } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auditLog } from '@/lib/audit';
import { getSession } from '@/lib/auth';

export async function getProducts() {
  return await db.query.produse.findMany({
    with: {
      categorie: true,
      unitate: true,
    },
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
    const result = await db.transaction(async (tx) => {
      const [newCategory] = await tx.insert(categorii).values(data).returning();
      
      await auditLog(tx, {
        user_id: session?.user?.id || null,
        actiune: 'CREATE',
        tabel: 'categorii',
        date_noi: newCategory,
      });

      return newCategory;
    });

    revalidatePath('/catalog');
    return { success: true, category: result };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Categoria există deja sau a apărut o eroare' };
  }
}

export async function importProducts(data: any[]) {
  const session = await getSession();
  try {
    let importedCount = 0;
    
    await db.transaction(async (tx) => {
      for (const item of data) {
        if (!item.nume) continue;

        // 1. Gestionare categorie (Caută sau Creează)
        let catId: number | undefined;
        if (item.categorie) {
          const existingCat = await tx.query.categorii.findFirst({
            where: eq(categorii.nume, item.categorie),
          });
          if (existingCat) {
            catId = existingCat.id;
          } else {
            const [newCat] = await tx.insert(categorii).values({ nume: item.categorie }).returning();
            catId = newCat.id;
          }
        }

        // 2. Gestionare unitate (Caută)
        let unitId: number | undefined;
        if (item.unitate) {
          const existingUnit = await tx.query.unitati.findFirst({
            where: eq(unitati.simbol, item.unitate),
          });
          if (existingUnit) unitId = existingUnit.id;
        }

        // 3. Inserare produs
        const [newProduct] = await tx.insert(produse).values({
          nume: item.nume,
          descriere: item.descriere || '',
          pret: Math.round(parseFloat(item.pret.toString().replace(',', '.')) * 100) || 0,
          stoc: parseInt(item.stoc?.toString()) || 0,
          categorie_id: catId,
          unitate_id: unitId,
        }).returning();

        if (newProduct) {
          await auditLog(tx, {
            user_id: session?.user?.id || null,
            actiune: 'IMPORT',
            tabel: 'produse',
            date_noi: newProduct,
          });
          importedCount++;
        }
      }
    });

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
    await db.transaction(async (tx) => {
      const [newProduct] = await tx.insert(produse).values(data).returning();
      
      await auditLog(tx, {
        user_id: session?.user?.id || null,
        actiune: 'CREATE',
        tabel: 'produse',
        date_noi: newProduct,
      });
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
  try {
    await db.transaction(async (tx) => {
      const oldProduct = await tx.query.produse.findFirst({
        where: eq(produse.id, id),
      });

      const [updatedProduct] = await tx.update(produse).set(data).where(eq(produse.id, id)).returning();

      await auditLog(tx, {
        user_id: session?.user?.id || null,
        actiune: 'UPDATE',
        tabel: 'produse',
        date_vechi: oldProduct,
        date_noi: updatedProduct,
      });
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
  try {
    await db.transaction(async (tx) => {
      const oldProduct = await tx.query.produse.findFirst({
        where: eq(produse.id, id),
      });

      await tx.delete(produse).where(eq(produse.id, id));

      await auditLog(tx, {
        user_id: session?.user?.id || null,
        actiune: 'DELETE',
        tabel: 'produse',
        date_vechi: oldProduct,
      });
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
  try {
    await db.transaction(async (tx) => {
      // 1. Preluăm produsul curent pentru a verifica stocul
      const product = await tx.query.produse.findFirst({
        where: eq(produse.id, id),
      });

      if (!product) {
        throw new Error('Produsul nu a fost găsit');
      }

      const newStock = product.stoc + quantityChange;

      // 2. Validare: stocul nu poate fi negativ
      if (newStock < 0) {
        throw new Error('Stoc insuficient');
      }

      // 3. Actualizare stoc
      const [updatedProduct] = await tx.update(produse)
        .set({ stoc: newStock })
        .where(eq(produse.id, id))
        .returning();

      await auditLog(tx, {
        user_id: session?.user?.id || null,
        actiune: 'UPDATE',
        tabel: 'stoc',
        date_vechi: { id: product.id, stoc: product.stoc },
        date_noi: { id: updatedProduct.id, stoc: updatedProduct.stoc },
      });
    });

    revalidatePath('/catalog');
    return { success: true };
  } catch (error: any) {
    console.error('Error recording stock movement:', error);
    return { success: false, error: error.message || 'Eroare la actualizarea stocului' };
  }
}
