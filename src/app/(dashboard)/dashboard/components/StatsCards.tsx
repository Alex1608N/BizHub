import React from "react";
import { getDashboardStats } from "@/app/actions/products";
import { getUnits } from "@/app/actions/units";
import { getSalesStatsToday } from "@/app/actions/sales";
import { TrendingUp, Package, AlertTriangle, Wallet, Store, Receipt } from "lucide-react";

export async function StatsCards({ companyId }: { companyId?: number }) {
  const statsData = await getDashboardStats(companyId);
  const units = await getUnits(companyId);
  const salesToday = await getSalesStatsToday(companyId);
  
  const stats = [
    { 
      label: "Vanzari Azi", 
      value: `${salesToday.totalSales.toLocaleString('ro-RO', { minimumFractionDigits: 2 })} RON`, 
      icon: Receipt,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      subtitle: `${salesToday.count} tranzactii azi`
    },
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
      label: "Unitati Masura", 
      value: units.length.toString(), 
      icon: Store,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat: any, i) => (
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
                <TrendingUp size={12} className="mr-0.5" /> 
              </span>
              <span className="text-gray-400 font-medium tracking-tight">
                {stat.subtitle || "Status: Date actualizate"}
              </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 h-32 shadow-sm"></div>
      ))}
    </div>
  );
}
