'use server';

import { db } from '@/db/db';
import { produse, categorii, unitati } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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

export async function addProduct(data: {
  nume: string;
  descriere?: string;
  pret: number;
  stoc: number;
  categorie_id?: number;
  unitate_id?: number;
}) {
  try {
    await db.insert(produse).values(data);
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
  try {
    await db.update(produse).set(data).where(eq(produse.id, id));
    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: number) {
  try {
    await db.delete(produse).where(eq(produse.id, id));
    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function recordStockMovement(id: number, quantityChange: number) {
  try {
    // 1. Preluăm produsul curent pentru a verifica stocul
    const product = await db.query.produse.findFirst({
      where: eq(produse.id, id),
    });

    if (!product) {
      return { success: false, error: 'Produsul nu a fost găsit' };
    }

    const newStock = product.stoc + quantityChange;

    // 2. Validare: stocul nu poate fi negativ
    if (newStock < 0) {
      return { success: false, error: 'Stoc insuficient' };
    }

    // 3. Actualizare stoc
    await db.update(produse)
      .set({ stoc: newStock })
      .where(eq(produse.id, id));

    revalidatePath('/catalog');
    return { success: true };
  } catch (error) {
    console.error('Error recording stock movement:', error);
    return { success: false, error: 'Eroare la actualizarea stocului' };
  }
}
