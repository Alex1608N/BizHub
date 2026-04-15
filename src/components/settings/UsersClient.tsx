'use client';

import { useState } from 'react';
import { updateUserDetails, deleteUser } from '@/app/actions/users';
import { sendInvitation } from '@/app/actions/invitations';
import { Shield, Mail, UserPlus, Building2, Trash2, History } from 'lucide-react';
import UserActivityModal from './UserActivityModal';

export default function UsersClient({ initialUsers, initialCompanies, userRole }: { initialUsers: any[], initialCompanies: any[], userRole?: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ANGAJAT' | 'MANAGER' | 'CONTABIL'>('ANGAJAT');
  const [selectedUserForActivity, setSelectedUserForActivity] = useState<{id: string, nume: string} | null>(null);

  const handleUpdateUser = async (userId: string, rol: string) => {
    const result = await updateUserDetails(userId, { rol: rol as any });
    if (result.success) {
      setUsers(users.map(u => u.id === userId ? { ...u, rol } : u));
    } else {
      alert(result.error);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi utilizatorul "${userName}"? Această acțiune nu poate fi anulată.`)) {
      return;
    }
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers(users.filter(u => u.id !== userId));
    } else {
      alert(result.error);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await sendInvitation(inviteEmail, inviteRole);
    if (result.success) {
      alert('Invitație trimisă cu succes!');
      setIsInviting(false);
      setInviteEmail('');
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Shield size={20} className="text-indigo-600" />
            Managementul Echipei
          </h3>
          {(userRole === 'MANAGER' || userRole === 'ADMIN') && (
            <button 
              onClick={() => setIsInviting(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100"
            >
              <UserPlus size={16} /> Invită Angajat
            </button>
          )}
        </div>

        {isInviting && (
          <div className="p-6 bg-indigo-50/50 border-b border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSendInvite} className="flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest ml-1">Email Utilizator</label>
                <input 
                  type="email" 
                  placeholder="email@exemplu.com" 
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-100 bg-white text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 w-full md:w-48">
                <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest ml-1">Rol Atribuit</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-indigo-100 bg-white text-sm focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-indigo-700 cursor-pointer"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                >
                  <option value="ANGAJAT">ANGAJAT</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="CONTABIL">CONTABIL</option>
                </select>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button type="submit" className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all">Trimite</button>
                <button type="button" onClick={() => setIsInviting(false)} className="px-4 py-2.5 bg-white text-gray-500 rounded-xl font-bold text-sm border border-gray-200 active:scale-95 transition-all">X</button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-5">Utilizator</th>
                <th className="px-6 py-5">Email</th>
                <th className="px-6 py-5">Firmă</th>
                <th className="px-6 py-5">Rol / Grad</th>
                {(userRole === 'ADMIN' || userRole === 'MANAGER') && <th className="px-6 py-5 text-right">Acțiuni</th>}
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
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <Building2 size={14} className="text-gray-400" />
                      {user.companie?.nume || <span className="text-gray-300 italic">Nicio firmă</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {userRole === 'ADMIN' ? (
                      <select 
                        className="text-xs font-bold border border-gray-200 bg-white rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none cursor-pointer text-indigo-700"
                        value={user.rol}
                        onChange={(e) => handleUpdateUser(user.id, e.target.value)}
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
                  {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedUserForActivity({ id: user.id, nume: user.nume })}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Vezi Activitate"
                      >
                        <History size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.nume)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Șterge utilizator"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUserForActivity && (
        <UserActivityModal 
          userId={selectedUserForActivity.id} 
          userName={selectedUserForActivity.nume} 
          onClose={() => setSelectedUserForActivity(null)} 
        />
      )}
    </div>
  );
}
