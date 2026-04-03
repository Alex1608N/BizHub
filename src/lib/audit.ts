import { auditLogs, produse } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '@/db/index';

interface AuditData {
  user_id: string | null;
  companie_id: number | null;
  actiune: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'IMPORT';
  tabel: string;
  date_vechi?: any;
  date_noi?: any;
}

/**
 * Loghează o acțiune în tabelul de audit.
 */
export async function auditLog(
  tx: any,
  data: AuditData
) {
  try {
    await tx.insert(auditLogs).values({
      user_id: data.user_id,
      companie_id: data.companie_id,
      actiune: data.actiune,
      tabel: data.tabel,
      date_vechi: data.date_vechi ? JSON.stringify(data.date_vechi) : null,
      date_noi: data.date_noi ? JSON.stringify(data.date_noi) : null,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Eroare la salvarea log-ului de audit:', error);
  }
}

/**
 * Verifică dacă un utilizator are dreptul să editeze un produs.
 * - ADMIN/MANAGER: Mereu TRUE.
 * - ANGAJAT: Doar în primele 7 zile de la crearea produsului.
 */
export async function canUserEditProduct(productId: number, userRole: string) {
  if (userRole === 'ADMIN' || userRole === 'MANAGER') {
    return true;
  }

  // Citim data creării direct din tabelul de produse (foarte rapid)
  const product = await db.query.produse.findFirst({
    where: eq(produse.id, productId),
    columns: { created_at: true }
  });

  if (!product) return false;

  const sapteZileInMs = 7 * 24 * 60 * 60 * 1000;
  const dataCreare = new Date(product.created_at).getTime();
  const acum = Date.now();

  return (acum - dataCreare) < sapteZileInMs;
}
