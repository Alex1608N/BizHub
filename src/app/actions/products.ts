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
