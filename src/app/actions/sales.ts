'use server';

import { db } from '@/db/index';
import { vanzari, vanzariDetalii, produse } from '@/db/schema';
import { eq, and, sql, gte } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { auditLog } from '@/lib/audit';

export async function recordSale(items: { productId: number; quantity: number }[]) {
  const session = await getSession();
  if (!session || !session.user.companie_id) {
    return { success: false, error: 'Neautorizat sau sesiune expirată.' };
  }

  try {
    const result = await db.transaction(async (tx) => {
      let totalSale = 0;
      const saleItems = [];

      // 1. Validam stocul si calculam totalul
      for (const item of items) {
        const [product] = await tx
          .select()
          .from(produse)
          .where(and(eq(produse.id, item.productId), eq(produse.companie_id, session.user.companie_id)));

        if (!product || product.stoc < item.quantity) {
          throw new Error(`Stoc insuficient pentru produsul: ${product?.nume || 'Necunoscut'}`);
        }

        const lineTotal = product.pret * item.quantity;
        totalSale += lineTotal;
        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: product.pret,
        });

        // 2. Scadem stocul
        await tx
          .update(produse)
          .set({ stoc: sql`${produse.stoc} - ${item.quantity}` })
          .where(eq(produse.id, item.productId));
      }

      // 3. Cream antetul vanzarii
      const [newSale] = await tx
        .insert(vanzari)
        .values({
          user_id: session.user.id,
          companie_id: session.user.companie_id,
          total: totalSale,
        })
        .returning();

      // 4. Cream detaliile vanzarii
      for (const saleItem of saleItems) {
        await tx.insert(vanzariDetalii).values({
          vanzare_id: newSale.id,
          produs_id: saleItem.productId,
          cantitate: saleItem.quantity,
          pret_unitar: saleItem.priceAtSale,
        });
      }

      // 5. Audit Log
      await auditLog(tx, {
        user_id: session.user.id,
        companie_id: session.user.companie_id,
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
    return { success: false, error: error.message };
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
