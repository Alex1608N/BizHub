import { getAuditLogs } from '@/app/actions/audit';
import { getCompany } from '@/app/actions/company';
import { getSession } from '@/lib/auth';
import AuditTimeline from '@/components/audit/AuditTimeline';
import { redirect } from 'next/navigation';
import { History } from 'lucide-react';
import { cookies } from 'next/headers';
import { COMPANY_COOKIE_NAME } from '@/lib/company';

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const params = await searchParams;
  const urlCompanyId = params.companyId ? parseInt(params.companyId, 10) : undefined;
  
  if (params.companyId && (isNaN(urlCompanyId!) || urlCompanyId! <= 0)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600 font-bold">ID firma invalid.</p>
      </div>
    );
  }
  
  const session = await getSession();

  if (!session || (session.user.rol !== 'ADMIN' && session.user.rol !== 'MANAGER')) {
    redirect('/dashboard');
  }

  const cookieStore = await cookies();
  const selectedCompanyCookie = cookieStore.get(COMPANY_COOKIE_NAME);
  const selectedCompanyId = selectedCompanyCookie ? parseInt(selectedCompanyCookie.value) : undefined;

  const effectiveCompanyId = urlCompanyId || selectedCompanyId;

  const logs = await getAuditLogs(effectiveCompanyId);
  const company = effectiveCompanyId ? await getCompany(effectiveCompanyId) : await getCompany();

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

      <AuditTimeline logs={logs} company={company} />
    </div>
  );
}
