'use client';

import { useActionState, useState } from 'react';
import { updateCompanyAction } from '@/app/actions/company';
import { Save, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { companii } from '@/db/schema';

type Company = typeof companii.$inferSelect;

interface SettingsFormProps {
  company: Company | null;
}

export default function SettingsForm({ company }: SettingsFormProps) {
  const [state, action, isPending] = useActionState(updateCompanyAction, null);
  const [logoPreview, setLogoPreview] = useState(company?.logo_url || '');

  return (
    <form action={action} className="p-6 md:p-8 space-y-8">
      {/* Mesaje de stare */}
      {state?.error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{state.error}</p>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{state.success}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sectiunea 1: Identitate Fiscala */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Identitate Fiscală</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nume Firmă *</label>
            <input
              name="nume"
              type="text"
              defaultValue={company?.nume || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="ex: SC BUSINESS HUB SRL"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">CUI</label>
              <input
                name="cui"
                type="text"
                defaultValue={company?.cui || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="RO12345678"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nr. Reg. Com.</label>
              <input
                name="reg_com"
                type="text"
                defaultValue={company?.reg_com || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="J40/123/2026"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Adresă Sediu</label>
            <textarea
              name="adresa"
              rows={3}
              defaultValue={company?.adresa || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Str. Exemplului, Nr. 1, Bucuresti"
            />
          </div>
        </div>

        {/* Sectiunea 2: Date Bancare si Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Bancă & Contact</h3>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">IBAN</label>
            <input
              name="iban"
              type="text"
              defaultValue={company?.iban || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
              placeholder="RO00 BANC 0000..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bancă</label>
            <input
              name="banca"
              type="text"
              defaultValue={company?.banca || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Numele Băncii"
            />
          </div>

          {/* Logo URL Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL Logo (PNG/JPG)</label>
            <div className="flex gap-3 items-start">
               <div className="flex-1">
                  <input
                    name="logo_url"
                    type="url"
                    value={logoPreview}
                    onChange={(e) => setLogoPreview(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="https://example.com/logo.png"
                  />
               </div>
               <div className="w-12 h-12 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" onError={() => setLogoPreview('')} />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Telefon</label>
              <input
                name="telefon"
                type="tel"
                defaultValue={company?.telefon || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="07xx xxx xxx"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={company?.email || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="contact@firma.ro"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Se salvează...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvează Setările
            </>
          )}
        </button>
      </div>
    </form>
  );
}
