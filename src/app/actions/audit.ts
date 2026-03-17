'use server';

import { db } from '@/db/db';
import { auditLogs } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

/**
 * Preluăm toate logurile de audit, ordonate cronologic (cele mai noi primele).
 * Doar utilizatorii logați pot vedea auditul. 
 * (În mod normal, doar Admin/Manager, dar vom lăsa filtrarea în pagină/layout).
 */
export async function getAuditLogs() {
  const session = await getSession();
  if (!session) {
    throw new Error('Neautorizat');
  }

  const logs = await db.query.auditLogs.findMany({
    orderBy: [desc(auditLogs.id)],
    with: {
      user: true,
    },
    limit: 100, // Limităm la ultimele 100 de acțiuni pentru performanță MVP
  });

  return logs;
}
