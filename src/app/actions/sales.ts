'use server';

import { db } from '@/db/index';
import { vanzari, vanzariDetalii, produse } from '@/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { auditLog } from '@/lib/audit';

import { cookies } from 'next/headers';
import { COMPANY_COOKIE_NAME } from '@/lib/company';

export async function recordSale(items: { productId: number; quantity: number }[], overrideCompanyId?: number) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Neautorizat sau sesiune expirată.' };
  }

  // LOGICA CONTEXT FIRMA:
  // 1. Daca avem un ID trimis explicit din UI (overrideCompanyId).
  // 2. Daca suntem Admin, cautam in Cookie-ul de firma activa.
  // 3. Fallback la firma din profilul userului (pt non-admin sau daca cookie lipseste).
  
  let targetCompanyId: number | undefined = overrideCompanyId;

  if (!targetCompanyId && session.user.rol === 'ADMIN') {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get(COMPANY_COOKIE_NAME)?.value;
    if (cookieVal) targetCompanyId = parseInt(cookieVal, 10);
  }

  if (!targetCompanyId) {
    targetCompanyId = session.user.companie_id as number;
  }

  if (!targetCompanyId) {
    return { success: false, error: 'Compania nu a fost identificată. Te rugăm să selectezi o firmă.' };
  }

  try {
    const result = await db.transaction(async (tx: any) => {
      let totalSale = 0;
      const saleItems = [];

      for (const item of items) {
        // VALIDARE STRICTA: Produsul trebuie sa fie in baza de date SI sa apartina firmei targetCompanyId
        const [product] = await tx
          .select()
          .from(produse)
          .where(and(eq(produse.id, item.productId), eq(produse.companie_id, targetCompanyId as number)));

        if (!product) {
          throw new Error(`Produsul cu ID-ul ${item.productId} nu a fost găsit în catalogul firmei selectate (Firma ID: ${targetCompanyId}).`);
        }

        if (product.stoc < item.quantity) {
          throw new Error(`Stoc insuficient pentru produsul: ${product.nume} (Disponibil: ${product.stoc}, Cerut: ${item.quantity})`);
        }

        const lineTotal = product.pret * item.quantity;
        totalSale += lineTotal;
        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: product.pret,
        });

        await tx
          .update(produse)
          .set({ stoc: sql`${produse.stoc} - ${item.quantity}` })
          .where(eq(produse.id, item.productId));
      }

      const [newSale] = await tx
        .insert(vanzari)
        .values({
          user_id: session.user.id,
          companie_id: targetCompanyId,
          total: totalSale,
        })
        .returning();

      for (const saleItem of saleItems) {
        await tx.insert(vanzariDetalii).values({
          vanzare_id: newSale.id,
          produs_id: saleItem.productId,
          cantitate: saleItem.quantity,
          pret_unitar: saleItem.priceAtSale,
        });
      }

      await auditLog(tx, {
        user_id: session.user.id,
        companie_id: targetCompanyId as number,
        actiune: 'CREATE',
        tabel: 'vanzari',
        date_noi: { sale: newSale, items: saleItems },
      });

      return { success: true, saleId: newSale.id };
    });

    revalidatePath('/catalog');
    revalidatePath('/dashboard');
    return result;
  } catch (error: any) {
    console.error('Sale error:', error);
    return { success: false, error: error.message || 'Eroare la înregistrarea vânzării.' };
  }
}

export async function getSalesStatsToday(companyId?: number) {
  const session = await getSession();
  if (!session) return { totalSales: 0, count: 0 };

  const targetId = (session.user.rol === 'ADMIN' && companyId) ? companyId : session.user.companie_id;
  if (!targetId) return { totalSales: 0, count: 0 };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [stats] = await db
      .select({
        totalSales: sql<number>`SUM(${vanzari.total}) / 100`,
        count: sql<number>`COUNT(${vanzari.id})`,
      })
      .from(vanzari)
      .where(and(
        eq(vanzari.companie_id, targetId),
        gte(vanzari.created_at, today)
      ));

    return {
      totalSales: Number(stats?.totalSales || 0),
      count: Number(stats?.count || 0),
    };
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    return { totalSales: 0, count: 0 };
  }
}
