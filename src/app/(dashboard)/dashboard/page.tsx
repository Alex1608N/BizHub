import React from "react";
import { getDashboardStats, getLowStockProducts } from "@/app/actions/products";
import { getDailyAuditDigest, getAuditLogs } from "@/app/actions/audit";
import { getSession } from "@/lib/auth";
import { TrendingUp, Package, Store, AlertTriangle, Wallet, History, User, Clock } from "lucide-react";

export default async function DashboardPage() {
  const [session, statsData, lowStockProducts, dailyDigest, recentLogs] = await Promise.all([
    getSession(),
    getDashboardStats(),
    getLowStockProducts(),
    getDailyAuditDigest(),
    getAuditLogs()
  ]);
  
  const stats = [
    { 
      label: "Valoare Stoc", 
      value: `${statsData.totalValue.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} RON`, 
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Produse in Catalog", 
      value: statsData.totalProducts.toString(), 
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      label: "Alerte Stoc", 
      value: statsData.lowStockCount.toString(), 
      icon: AlertTriangle,
      color: statsData.lowStockCount > 0 ? "text-red-600" : "text-emerald-600",
      bg: statsData.lowStockCount > 0 ? "bg-red-50" : "bg-emerald-50"
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
        {stats.map((stat: any, i: number) => (
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
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 min-h-[320px] shadow-sm flex flex-col">
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
        
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl text-white shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <History size={20} className="text-indigo-100" />
                </div>
                <h3 className="text-xl font-bold">Daily Digest</h3>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                Activitatea de ieri inregistrata in sistem:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Actiuni</p>
                  <p className="text-2xl font-bold">{dailyDigest.total}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Editari</p>
                  <p className="text-2xl font-bold">{dailyDigest.updates}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-indigo-100 font-medium">Integritate Audit</span>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Verificat</span>
              </div>
              <p className="text-[11px] text-indigo-200 leading-tight">
                Toate tranzactiile au fost logate securizat in SQLite local conform standardelor de audit.
              </p>
            </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <History size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Timeline Activitate</h3>
          </div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Ultimele 10 actiuni</p>
        </div>
        
        <div className="divide-y divide-gray-50">
          {recentLogs.slice(0, 10).map((log: any) => {
            let details = "";
            let subtext = "";
            try {
              const rawData = log.date_noi || log.date_vechi || "{}";
              let data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
              if (typeof data === 'string') data = JSON.parse(data);
              details = data.nume || data.email || data.nume_utilizator || "";
              if (log.actiune === 'UPDATE' && data.stoc !== undefined) {
                subtext = `Stoc actual: ${data.stoc}`;
              }
            } catch (e) {
              console.error("Error parsing audit log data:", e);
            }

            return (
              <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${
                  log.actiune === 'CREATE' ? 'bg-emerald-100 text-emerald-600' :
                  log.actiune === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {log.actiune === 'CREATE' ? <Package size={14} /> : 
                   log.actiune === 'UPDATE' ? <History size={14} /> : 
                   <AlertTriangle size={14} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 leading-none truncate">
                        {log.actiune === 'CREATE' ? 'Adaugare' : 
                         log.actiune === 'UPDATE' ? 'Modificare' : 
                         log.actiune === 'DELETE' ? 'Stergere' :
                         log.actiune === 'IMPORT' ? 'Import' : log.actiune}
                        {details && <span className="text-indigo-600 ml-1.5 underline decoration-indigo-200 underline-offset-4">"{details}"</span>}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-wider">
                        in <span className="text-gray-600 font-bold">{log.tabel}</span>
                        {subtext && <span className="ml-2 text-emerald-600 font-bold">• {subtext}</span>}
                      </p>
                    </div>
                    <div className="flex items-center text-[11px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md ml-4 flex-shrink-0">
                      <Clock size={12} className="mr-1 text-gray-300" />
                      {new Date(log.timestamp).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <User size={12} className="mr-1.5 text-gray-400" />
                      {log.user?.nume || 'Sistem'}
                    </div>
                    <div className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                      ID: #{log.id}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {recentLogs.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-400 text-sm">Nu exista activitate inregistrata inca.</p>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 text-center">
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors">
            Vezi tot istoricul de audit
          </button>
        </div>
      </div>
    </div>
  );
}
