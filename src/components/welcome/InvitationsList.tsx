'use client';

import React, { useState } from 'react';
import { Check, Building2, User } from 'lucide-react';
import { acceptInvitation } from '@/app/actions/invitations';
import { useRouter } from 'next/navigation';

interface Invitation {
  id: number;
  rol: string;
  companie: {
    nume: string;
  };
  inviter: {
    nume: string;
  };
}

export default function InvitationsList({ initialInvitations }: { initialInvitations: any[] }) {
  const [invitations] = useState<Invitation[]>(initialInvitations);
  const [loading, setLoading] = useState<number | null>(null);
  const router = useRouter();

  const handleAccept = async (id: number) => {
    setLoading(id);
    try {
      const res = await acceptInvitation(id);
      if (res.success) {
        // Redirecționăm către dashboard după ce a acceptat
        router.push('/dashboard');
        router.refresh();
      } else {
        alert('Eroare la acceptarea invitației: ' + res.error);
      }
    } catch (error) {
      alert('Eroare neașteptată.');
    } finally {
      setLoading(null);
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 space-y-4">
        <p className="text-gray-700 font-medium">
          Momentan nu ai nicio invitație activă pe acest email. 
          Asigură-te că managerul a trimis invitația către email-ul tău corect.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <h2 className="text-lg font-bold text-gray-900 px-2">Invitații primite ({invitations.length})</h2>
      {invitations.map((inv) => (
        <div key={inv.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{inv.companie.nume}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <User size={14} /> invitat de {inv.inviter.nume} • Rol: <span className="font-bold text-indigo-600">{inv.rol}</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => handleAccept(inv.id)}
              disabled={loading !== null}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading === inv.id ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={18} /> Acceptă
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
