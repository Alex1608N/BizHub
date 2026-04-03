'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, X, MailOpen } from 'lucide-react';
import { getMyInvitations, acceptInvitation } from '@/app/actions/invitations';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const data = await getMyInvitations();
        setInvitations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvites();
  }, []);

  const handleAccept = async (id: number) => {
    const res = await acceptInvitation(id);
    if (res.success) {
      setInvitations(invitations.filter(i => i.id !== id));
      window.location.reload(); // Reîncărcăm pentru a activa noul rol/companie
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 outline-none"
      >
        {invitations.length > 0 && (
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
        )}
        <Bell size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Notificări</h3>
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{invitations.length}</span>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {invitations.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                  <MailOpen size={24} />
                </div>
                <p className="text-gray-400 text-xs font-medium italic">Nicio invitație nouă.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {invitations.map((inv) => (
                  <div key={inv.id} className="p-4 hover:bg-indigo-50/30 transition-colors space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                        {inv.companie.nume.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Invitație {inv.companie.nume}</p>
                        <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">
                          {inv.inviter.nume} te-a invitat să te alături echipei lor ca și <span className="text-indigo-600 font-bold">{inv.rol}</span>.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAccept(inv.id)}
                        className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Check size={12} /> Acceptă
                      </button>
                      <button className="px-3 bg-gray-100 text-gray-500 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-gray-200 transition-all">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
