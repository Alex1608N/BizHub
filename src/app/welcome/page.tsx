import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut, Rocket, ShieldCheck, Zap, Bell } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { getMyInvitations } from "@/app/actions/invitations";
import InvitationsList from "@/components/welcome/InvitationsList";

export default async function WelcomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Dacă are deja firmă, nu are ce căuta aici
  if (session.user.companie_id || session.user.rol === 'ADMIN') {
    redirect("/dashboard");
  }

  const invitations = await getMyInvitations();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full space-y-12">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-xl shadow-indigo-100 mx-auto animate-bounce">
            B
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Bine ai venit la <span className="text-indigo-600">BizHub</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Platforma ta inteligentă pentru managementul resurselor firmei.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Securitate</h3>
            <p className="text-sm text-gray-500">Acces bazat pe roluri și audit complet al operațiunilor.</p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-gray-900">Viteză</h3>
            <p className="text-sm text-gray-500">Interfață ultra-rapidă pentru gestiunea stocurilor.</p>
          </div>
          <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <Rocket size={24} />
            </div>
            <h3 className="font-bold text-gray-900">AI Power</h3>
            <p className="text-sm text-gray-500">Sugestii inteligente pentru reaprovizionare.</p>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 space-y-6">
          <div className="flex items-center justify-center gap-3 text-indigo-600">
             <Bell className="animate-pulse" />
             <h2 className="text-xl font-bold">Ce urmează?</h2>
          </div>
          
          <InvitationsList initialInvitations={invitations} />

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-4 border-t border-indigo-100">
             <form action={async () => {
                'use server';
                await logout();
                redirect('/login');
             }}>
                <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-white text-gray-700 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm">
                   <LogOut size={18} /> Deconectare
                </button>
             </form>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
           &copy; 2026 Echipa Alpha - BizHub ERP
        </p>
      </div>
    </div>
  );
}
