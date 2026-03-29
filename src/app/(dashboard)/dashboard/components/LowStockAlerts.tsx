import React from "react";
import { getLowStockProducts } from "@/app/actions/products";
import { AlertTriangle, Package } from "lucide-react";

export async function LowStockAlerts() {
  const lowStockProducts = await getLowStockProducts();

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 min-h-[320px] shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Alerte Stoc Critic</h3>
        </div>
        <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Sub 5 unitati
        </span>
      </div>

      {lowStockProducts.length > 0 ? (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th className="pb-3">Produs</th>
                <th className="pb-3 text-right">Stoc Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {lowStockProducts.map((p: any) => (
                <tr key={p.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-semibold text-gray-700">{p.nume}</td>
                  <td className="py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      {p.stoc} {p.unitate?.simbol || "Buc"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <Package size={32} />
          </div>
          <p className="font-bold text-gray-900 text-lg">Toate stocurile sunt optime</p>
          <p className="text-gray-500 text-sm mt-1 max-w-xs">Nu exista produse care sa necesite reaprovizionare imediata.</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-50">
         <p className="text-xs text-gray-400">Pragul de alerta este setat automat la 5 unitati.</p>
      </div>
    </div>
  );
}

export function LowStockSkeleton() {
  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 h-[320px] animate-pulse">
      <div className="h-6 w-48 bg-gray-100 rounded mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-xl"></div>)}
      </div>
    </div>
  );
}
