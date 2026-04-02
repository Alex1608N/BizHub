import React from "react";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { getLowStockProducts, getProducts } from "@/app/actions/products";
import { getAuditLogs } from "@/app/actions/audit";
import { getInventoryInsights } from "@/app/actions/ai";

type LowStockProduct = {
  id: number;
  nume: string;
  stoc: number;
  unitate?: { simbol: string } | null;
};

export default async function AIInsights({ companyId }: { companyId?: number }) {
  const lowStockProducts: LowStockProduct[] = await getLowStockProducts(5, companyId);
  const allProducts = await getProducts(companyId);
  const auditLogs = await getAuditLogs(companyId);

  // Trimitem datele către AI pentru analiză
  const insights = await getInventoryInsights(allProducts, auditLogs);

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            <Sparkles size={20} className="text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Inventory Insights</h3>
            <p className="text-xs text-indigo-600 font-medium uppercase tracking-widest">Analiză inteligentă stoc</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 bg-white/50 px-3 py-1.5 rounded-full border border-white">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold text-gray-500 uppercase">Live Analysis</span>
        </div>
      </div>

      <div className="p-6">
        {lowStockProducts.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
              <div className="mt-1">
                <AlertCircle size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-2">Sugestii de la Gemini:</p>
                <div className="text-sm text-gray-600 leading-relaxed space-y-2 whitespace-pre-line">
                  {insights}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group/item hover:border-indigo-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 group-hover/item:text-indigo-600 transition-colors">
                      {p.nume.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{p.nume}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                      {p.stoc} {p.unitate?.simbol}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} />
            </div>
            <p className="font-bold text-gray-900">Totul arată perfect!</p>
            <p className="text-sm text-gray-500 mt-1">{insights}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50/50 p-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 font-medium italic">Bazat pe istoricul ultimelor 100 de tranzacții</span>
        <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
          Detalii Raport <ArrowRight size={12} className="ml-1" />
        </button>
      </div>
    </div>
  );
}

export function AIInsightsSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-[80px] bg-gray-50 border-b border-gray-100" />
      <div className="p-6 space-y-4">
        <div className="h-20 bg-gray-50 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-gray-50 rounded-xl" />
          <div className="h-12 bg-gray-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
