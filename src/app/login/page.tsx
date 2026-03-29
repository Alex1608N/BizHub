'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#fdfdff]">
      {/* Element de decor fundal - Gradient 1 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px] pointer-events-none" />
      {/* Element de decor fundal - Gradient 2 */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px] pointer-events-none" />
      
      {/* Grid decorativ subtil */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-200 mb-4 transform hover:rotate-3 transition-transform duration-300">
            <span className="text-3xl font-black text-white italic">B</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">BizHub ERP</h1>
          <p className="text-gray-500 mt-2 font-medium">Sistemul tau de management inteligent</p>
        </div>

        {/* Card Login */}
        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white/50 ring-1 ring-gray-200/50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <LogIn className="w-6 h-6 text-indigo-600" /> Bine ai revenit!
            </h2>
            <p className="text-sm text-gray-500 mt-1">Introdu datele pentru a incepe sesiunea de lucru.</p>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-shake">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white sm:text-sm transition-all font-medium"
                    placeholder="ex: admin@bizhub.ro"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Parola</label>
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Ai uitat parola?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white sm:text-sm transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input type="checkbox" className="w-4 h-4 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-gray-500 font-medium">Tine-ma minte 30 de zile</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative flex w-full justify-center items-center gap-2 overflow-hidden rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-black text-white hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Se proceseaza...</span>
                </div>
              ) : (
                <>
                  <span>Autentificare</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-center text-sm text-gray-600 font-medium">
              Nu ai un cont activ?{' '}
              <Link href="/register" className="font-bold text-indigo-600 hover:underline decoration-2 underline-offset-4 decoration-indigo-200 transition-all">
                Creeaza un cont gratuit
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-10 flex items-center justify-center gap-2 text-gray-400 font-medium text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Sistem securizat de Echipa Alpha</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
