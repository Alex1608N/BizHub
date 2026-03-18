import React from "react";
import { getStockValue, getProducts } from "@/app/actions/products";
import { getSession } from "@/lib/auth";
import { TrendingUp, Package, Store, AlertTriangle, Wallet } from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  const stockValue = await getStockValue();
  const products = await getProducts();
  
  const lowStockCount = products.filter(p => p.stoc < 5).length;

  const stats = [
    { 
      label: "Valoare Stoc", 
      value: `${stockValue.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} RON`, 
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Produse in Catalog", 
      value: products.length.toString(), 
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      label: "Alerte Stoc", 
      value: lowStockCount.toString(), 
      icon: AlertTriangle,
      color: lowStockCount > 0 ? "text-red-600" : "text-emerald-600",
      bg: lowStockCount > 0 ? "bg-red-50" : "bg-emerald-50"
    },
    { 
      label: "Unitati Active", 
      value: "1", 
      icon: Store,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Salut, {session?.user?.nume || "Utilizator"}!
          </h2>
          <p className="text-gray-500 mt-1">Iata sumarul operatiunilor tale in BizHub ERP.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Data Curenta</p>
          <p className="font-bold text-gray-700">{new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
               <span className="text-emerald-500 font-bold flex items-center mr-1">
                 <TrendingUp size={12} className="mr-0.5" /> 100%
               </span>
               <span className="text-gray-400 font-medium tracking-tight">sincronizat local</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 min-h-[320px] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3">
                <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Grafic Evolutie Valoare Stoc</h3>
            <p className="text-gray-500 mt-3 max-w-sm">Aceasta functionalitate va fi disponibila in Epic 5 pentru a vizualiza capitalul blocat in timp.</p>
            <button className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
              Vezi detalii (Coming Soon)
            </button>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Daily Digest</h3>
              <p className="text-indigo-100 text-sm leading-relaxed">Managerul poate vedea aici sumarul modificarilor de ieri dintr-o singura privire.</p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-indigo-100">Integritate Audit</span>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Verificat</span>
              </div>
              <p className="text-xs text-indigo-200">Toate tranzactiile de astazi au fost logate securizat in SQLite local.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
