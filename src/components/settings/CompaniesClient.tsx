'use client';

import { useState } from 'react';
import { addCompany, deleteCompany } from '@/app/actions/users';
import { Building2, Plus, ArrowRight, Briefcase, Trash2 } from 'lucide-react';
import { useCompany } from '@/components/providers/CompanyProvider';

export default function CompaniesClient({ initialCompanies, userRole }: { initialCompanies: any[], userRole?: string }) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [companyData, setCompanyData] = useState({ nume: '', cui: '' });
  const { setSelectedCompanyId } = useCompany();

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addCompany(companyData);
    if (result.success) {
      setCompanies([...companies, result.company]);
      setIsAddingCompany(false);
      setCompanyData({ nume: '', cui: '' });
    } else {
      alert(result.error);
    }
  };

  const handleSelectCompany = (companyId: number) => {
    setSelectedCompanyId(companyId);
  };

  const handleDeleteCompany = async (companyId: number, companyName: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi firma "${companyName}"? Această acțiune nu poate fi anulată.`)) {
      return;
    }
    const result = await deleteCompany(companyId);
    if (result.success) {
      setCompanies(companies.filter(c => c.id !== companyId));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
      {isAddingCompany ? (
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
            <Building2 size={32} />
          </div>
          <div className="w-full space-y-3">
            <input 
              type="text" 
              placeholder="Nume Firmă" 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-medium"
              value={companyData.nume}
              onChange={(e) => setCompanyData({...companyData, nume: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="CUI (Cod Unic)" 
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-medium"
              value={companyData.cui}
              onChange={(e) => setCompanyData({...companyData, cui: e.target.value})}
            />
          </div>
          <div className="flex gap-2 w-full pt-2">
            <button onClick={handleAddCompany} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all">Crează Firmă</button>
            <button onClick={() => setIsAddingCompany(false)} className="px-4 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all">Anulează</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsAddingCompany(true)}
          className="bg-indigo-50/30 border-2 border-dashed border-indigo-200 rounded-3xl p-8 flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all group min-h-[220px]"
        >
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus size={28} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest">Adaugă Firmă Nouă</span>
          <p className="text-[10px] text-indigo-400 mt-2 font-medium">Înregistrează un nou client în platformă</p>
        </button>
      )}

      {companies.map((company) => (
        <div key={company.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 opacity-50 group-hover:bg-indigo-600 transition-colors duration-500" />
          
          <div className="flex items-center justify-between mb-6 relative">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <Building2 size={26} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Status Firmă</p>
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">Activă</span>
            </div>
          </div>

          <h4 className="font-black text-xl text-gray-900 mb-1 leading-tight">{company.nume}</h4>
          <div className="flex items-center gap-1.5 mb-6 text-gray-400">
            <Briefcase size={12} />
            <span className="text-[10px] font-bold uppercase tracking-tight">CUI: {company.cui || 'Nespecificat'}</span>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-gray-50 relative">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">A</div>
              <div className="w-8 h-8 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">M</div>
              <div className="w-8 h-8 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">+</div>
            </div>
            <div className="flex items-center gap-2">
              {userRole === 'ADMIN' && (
                <button 
                  onClick={(e) => { e.preventDefault(); handleDeleteCompany(company.id, company.nume); }}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Șterge firmă"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button 
                onClick={() => handleSelectCompany(company.id)}
                className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer"
              >
                Acces Panou <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
