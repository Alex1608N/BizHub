import { getAuditLogs } from '@/app/actions/audit';
import { getSession } from '@/lib/auth';
import AuditTimeline from '@/components/audit/AuditTimeline';
import { redirect } from 'next/navigation';
import { History } from 'lucide-react';

export default async function AuditPage() {
  const session = await getSession();

  // Securitate: doar ADMIN și MANAGER pot vedea auditul complet
  if (!session || (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER')) {
    redirect('/dashboard');
  }

  const logs = await getAuditLogs();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline Audit</h1>
          <p className="text-gray-500 text-sm">Monitorizarea integrității datelor și istoricul modificărilor</p>
        </div>
      </div>

      <AuditTimeline logs={logs} />
    </div>
  );
}
