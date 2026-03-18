import { getCompany } from '@/app/actions/company';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsForm from '@/components/settings/SettingsForm';
import { Building2 } from 'lucide-react';

export default async function SettingsPage() {
  const session = await getSession();
  
  if (!session || !['ADMIN', 'MANAGER'].includes(session.user.rol)) {
    redirect('/dashboard');
  }

  const company = await getCompany();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Setări Firmă</h1>
          <p className="text-sm text-gray-500">Gestionează datele de identificare fiscală și contact pentru documente.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <SettingsForm company={company} />
      </div>
    </div>
  );
}
