import { auditLogs } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '@/db/index';

interface AuditData {
  user_id: string | null;
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

  // Căutăm log-ul de tip CREATE pentru acest produs
  // NOTĂ: Deoarece ID-ul este în JSON-ul stocat în date_noi, 
  // căutăm log-ul care conține ID-ul produsului în formatul corect.
  const createLog = await db.query.auditLogs.findFirst({
    where: (logs: any, { and, eq }: any) => and(
      eq(logs.actiune, 'CREATE'),
      eq(logs.tabel, 'produse'),
      sql`${logs.date_noi} LIKE ${'%\"id\":' + productId + ',%'}`
    ),
    orderBy: (logs: any, { asc }: any) => [asc(logs.id)], // Primul log de creare
  });

  if (!createLog) {
    // Dacă nu găsim log-ul de creare (produse vechi sau importate fără audit), 
    // permitem editarea pentru a nu bloca activitatea pe produsele existente.
    return true;
  }

  const sapteZileInMs = 7 * 24 * 60 * 60 * 1000;
  const dataCreare = new Date(createLog.timestamp).getTime();
  const acum = Date.now();

  return (acum - dataCreare) < sapteZileInMs;
}
