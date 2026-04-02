'use client';

import { useState } from 'react';
import { addCompany, updateUserDetails } from '@/app/actions/users';
import { Users, Building2, Shield, Mail, Plus, Check, X, ArrowRight, UserPlus, Briefcase } from 'lucide-react';

export default function UsersClient({ initialUsers, initialCompanies, userRole }: { initialUsers: any[], initialCompanies: any[], userRole?: string }) {
  const [activeTab, setActiveTab] = useState<'users' | 'companies'>('users');
  const [users, setUsers] = useState(initialUsers);
  const [companies, setCompanies] = useState(initialCompanies);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [companyData, setCompanyData] = useState({ nume: '', cui: '' });

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

  const handleUpdateUser = async (userId: string, rol: string, companie_id?: number) => {
    const result = await updateUserDetails(userId, { rol, companie_id });
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, rol, companie_id } : u));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      {userRole === 'ADMIN' && (
        <div className="flex p-1 bg-gray-100 rounded-2xl w-fit border border-gray-200 shadow-inner">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users size={18} />
            Utilizatori
          </button>
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'companies' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Building2 size={18} />
            Firme
          </button>
        </div>
      )}

      {activeTab === 'users' ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Shield size={20} className="text-indigo-600" />
              Managementul Drepturilor de Acces
            </h3>
            {userRole === 'MANAGER' && (
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100">
                <UserPlus size={16} /> Invită Angajat
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-5">Utilizator</th>
                  <th className="px-6 py-5">Email</th>
                  <th className="px-6 py-5">Rol / Grad</th>
                  <th className="px-6 py-5">Firmă Asociată</th>
                  {userRole === 'ADMIN' && <th className="px-6 py-5 text-right">Acțiuni Admin</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
                          {user.nume.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{user.nume}</p>
                          <p className="text-[10px] text-gray-400 font-medium">ID: {user.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <Mail size={14} className="opacity-40" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {userRole === 'ADMIN' ? (
                        <select 
                          className="text-xs font-bold border border-gray-200 bg-white rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none cursor-pointer text-indigo-700"
                          value={user.rol}
                          onChange={(e) => handleUpdateUser(user.id, e.target.value, user.companie_id)}
                        >
                          <option value="ANGAJAT">ANGAJAT</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="CONTABIL">CONTABIL</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          user.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                          user.rol === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 
                          user.rol === 'CONTABIL' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.rol}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {userRole === 'ADMIN' ? (
                        <select 
                          className="text-xs font-medium border border-gray-200 bg-white rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer max-w-[150px]"
                          value={user.companie_id || ''}
                          onChange={(e) => handleUpdateUser(user.id, user.rol, e.target.value ? parseInt(e.target.value) : undefined)}
                        >
                          <option value="">Fără firmă (Global)</option>
                          {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.nume}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                          <Building2 size={14} className="text-gray-400" />
                          {user.companie?.nume || <span className="text-gray-300 italic">Nicio firmă</span>}
                        </div>
                      )}
                    </td>
                    {userRole === 'ADMIN' && (
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
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
                <div className="text-right">
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
                   {/* Avatar placeholders for users in this company */}
                  <div className="w-8 h-8 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">A</div>
                  <div className="w-8 h-8 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">M</div>
                  <div className="w-8 h-8 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">+</div>
                </div>
                <a 
                  href={`/dashboard?companyId=${company.id}`}
                  className="text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all cursor-pointer"
                >
                  Acces Panou <ArrowRight size={14} />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
