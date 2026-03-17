import { auditLogs } from '@/db/schema';
import { type SQLiteTransaction } from 'drizzle-orm/sqlite-core';

interface AuditData {
  user_id: number | null;
  actiune: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'IMPORT';
  tabel: string;
  date_vechi?: any;
  date_noi?: any;
}

/**
 * Loghează o acțiune în tabelul de audit.
 * Trebuie apelat în interiorul unei tranzacții Drizzle pentru a asigura atomicitatea.
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
    });
  } catch (error) {
    console.error('Eroare la salvarea log-ului de audit:', error);
  }
}
