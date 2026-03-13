import React from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Salut, Alexandru!</h2>
        <p className="text-gray-500">Iata ce se intampla astazi in BizHub ERP.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Venit Total", value: "0 RON", change: "0%", color: "text-green-600" },
          { label: "Produse in Catalog", value: "12", change: "+2 azi", color: "text-blue-600" },
          { label: "Unitati Active", value: "4", change: "Stabil", color: "text-indigo-600" },
          { label: "Alerte Stoc", value: "0", change: "Excelent", color: "text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-xs font-semibold ${stat.color}`}>{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Sections (Placeholder) */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                📊
            </div>
            <h3 className="font-semibold text-gray-900">Grafic Vanzari</h3>
            <p className="text-sm text-gray-500 mt-2">Datele vor aparea dupa inregistrarea primelor facturi.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 h-64 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                🚚
            </div>
            <h3 className="font-semibold text-gray-900">Ultimele Miscari Stoc</h3>
            <p className="text-sm text-gray-500 mt-2">Nicio miscare recenta de stoc inregistrata.</p>
        </div>
      </div>
    </div>
  );
}
