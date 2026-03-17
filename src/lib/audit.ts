import { db } from '@/db/db';
import { audit_logs } from '@/db/schema';

interface AuditLogEntry {
  tabel_afectat: string;
  coloana?: string;
  valoare_veche?: string;
  valoare_noua?: string;
  utilizator_id?: number;
  motiv?: string;
}

/**
 * Loghează o acțiune în tabelul de audit.
 */
export async function logAudit(entry: AuditLogEntry) {
  try {
    await db.insert(audit_logs).values({
      tabel_afectat: entry.tabel_afectat,
      coloana: entry.coloana,
      valoare_veche: entry.valoare_veche,
      valoare_noua: entry.valoare_noua,
      utilizator_id: entry.utilizator_id,
      data_creare: new Date(),
      motiv: entry.motiv,
    });
    console.log(`[Audit] Log salvat pentru tabelul ${entry.tabel_afectat}`);
  } catch (error) {
    console.error('[Audit Error] Nu s-a putut salva log-ul de audit:', error);
  }
}
