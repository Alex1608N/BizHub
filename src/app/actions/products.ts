'use server';

import { db } from '@/db/index';
import { produse, categorii, unitati } from '@/db/schema';
import { eq, and, sql, inArray } from 'drizzle-orm';
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
});

export async function addProduct(rawDate: any) {
  const session = await getSession();
  if (!session || !session.user.companie_id) {
    return { success: false, error: 'Neautorizat' };
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
    console.error('Add product error:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'A apărut o eroare la crearea produsului.' };
  }
}

export async function updateProduct(id: number, rawData: any) {
    const session = await getSession();
    if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat' };

    try {
        const validatedData = productSchema.partial().parse(rawData);

        const [updated] = await db.update(produse)
            .set({
                nume: validatedData.nume,
                descriere: validatedData.descriere,
                pret: validatedData.pret,
                stoc: validatedData.stoc,
                categorie_id: validatedData.categorie_id,
                unitate_id: validatedData.unitate_id
            })
            .where(and(
                eq(produse.id, id), 
                eq(produse.companie_id, session.user.companie_id)
            ))
            .returning();
            
        if (!updated) return { success: false, error: 'Produsul nu a fost găsit.' };

        revalidatePath('/catalog');
        return { success: true };
    } catch (error: any) {
        console.error('Update product error:', error);
        return { success: false, error: 'A apărut o eroare la actualizare.' };
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
    console.error('Stock movement error:', error);
    return { success: false, error: 'A apărut o eroare la modificarea stocului.' };
  }
}

export async function getProducts(companyId?: number) {
  const session = await getSession();
  if (!session) return [];

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
  const canEdit = session.user.rol === 'ADMIN' || session.user.rol === 'MANAGER';

  return results.map(p => ({ ...p, isEditable: canEdit }));
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
        console.error('Delete product error:', error);
        return { success: false, error: 'A apărut o eroare la ștergere.' };
    }
}

export async function importProducts(data: any[]) {
    const session = await getSession();
    if (!session || !session.user.companie_id) return { success: false, error: 'Neautorizat', count: 0 };

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
                companie_id: session.user.companie_id as number
            };
        }).filter(Boolean) as any[];

        if (validatedItems.length === 0) return { success: false, error: 'Nu am găsit date valide pentru import.', count: 0 };

        await db.transaction(async (tx) => {
            await tx.insert(produse).values(validatedItems);
            
            await auditLog(tx, {
                user_id: session.user.id,
                companie_id: session.user.companie_id as number,
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

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;

  try {
    let query = db.select({
      id: produse.id,
      nume: produse.nume,
      stoc: produse.stoc,
      unitate: { simbol: unitati.simbol }
    })
    .from(produse)
    .leftJoin(unitati, eq(produse.unitate_id, unitati.id));

    if (targetId) {
        query = query.where(and(sql`${produse.stoc} < 5`, eq(produse.companie_id, targetId)));
    } else {
        query = query.where(sql`${produse.stoc} < 5`);
    }

    return await query.limit(limit);
  } catch (error) {
    console.error('Get low stock products error:', error);
    return [];
  }
}
