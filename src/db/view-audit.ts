import { db } from './index';
import { auditLogs } from './schema';
import { desc } from 'drizzle-orm';

async function main() {
  console.log('--- ULTIMELE 10 LOG-URI DE AUDIT ---');
  try {
    const logs = await db.query.auditLogs.findMany({
      limit: 10,
      orderBy: [desc(auditLogs.id)],
      with: {
        user: true
      }
    });

    if (logs.length === 0) {
      console.log('Niciun log găsit. Încearcă să modifici un produs în browser!');
      return;
    }

    logs.forEach(log => {
      console.log(`[${log.timestamp?.toISOString() || 'N/A'}] Actiune: ${log.actiune} | Tabel: ${log.tabel}`);
      console.log(`   User: ${log.user?.nume || 'Sistem/Anonim'}`);
      console.log(`   Vechi: ${log.date_vechi || 'N/A'}`);
      console.log(`   Noi: ${log.date_noi || 'N/A'}`);
      console.log('------------------------------------');
    });
  } catch (error) {
    console.error('Eroare la citirea log-urilor:', error);
  }
}

main();
