import { db } from './db';
import { audit_logs } from './schema';
import { desc } from 'drizzle-orm';

async function main() {
  console.log('--- ULTIMELE 10 LOG-URI DE AUDIT ---');
  const logs = await db.query.audit_logs.findMany({
    limit: 10,
    orderBy: [desc(audit_logs.data_creare)],
  });

  if (logs.length === 0) {
    console.log('Niciun log găsit. Încearcă să modifici un produs în browser!');
    return;
  }

  logs.forEach(log => {
    console.log(`[${log.data_creare.toISOString()}] Tabel: ${log.tabel_afectat} | Coloană: ${log.coloana || 'N/A'}`);
    console.log(`   Vechie: ${log.valoare_veche} | Nouă: ${log.valoare_noua}`);
    console.log(`   Motiv: ${log.motiv}`);
    console.log('------------------------------------');
  });
}

main();
