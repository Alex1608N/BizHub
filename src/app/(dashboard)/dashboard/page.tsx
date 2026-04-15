import React, { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { StatsCards, StatsCardsSkeleton } from "./components/StatsCards";
import { LowStockAlerts, LowStockSkeleton } from "./components/LowStockAlerts";
import { DailyDigest, AuditHistory, AuditSkeleton } from "./components/AuditHistory";
import AIInsights, { AIInsightsSkeleton } from "@/components/dashboard/AIInsights";
import { cookies } from "next/headers";
import { COMPANY_COOKIE_NAME } from "@/lib/company";
import Link from "next/link";
import { Building2 } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const params = await searchParams;
  const companyId = params.companyId ? parseInt(params.companyId, 10) : undefined;
  
  if (params.companyId && (isNaN(companyId!) || companyId! <= 0)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600 font-bold">ID firma invalid.</p>
      </div>
    );
  }
  
  const session = await getSession();
  
  const cookieStore = await cookies();
  const selectedCompanyCookie = cookieStore.get(COMPANY_COOKIE_NAME);
  const selectedCompanyId = selectedCompanyCookie ? parseInt(selectedCompanyCookie.value) : undefined;

  const isAdminWithoutCompany = session?.user?.rol === 'ADMIN' && !companyId && !selectedCompanyId;
  
  if (isAdminWithoutCompany) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
          <Building2 size={40} className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Selectează o Firmă</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Ca administrator, trebuie să selectezi o firmă pentru a vedea datele. 
          Dashboard-ul nu are relevanță fără o firmă selectată.
        </p>
        <Link 
          href="/firme" 
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Building2 size={20} />
          Accesează Gestionare Firme
        </Link>
      </div>
    );
  }

  const effectiveCompanyId = companyId || selectedCompanyId;
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Salut, {session?.user?.nume || "Utilizator"}!
          </h2>
          <p className="text-gray-500 mt-1">
            {effectiveCompanyId ? `Vizualizezi datele firmei ID #${effectiveCompanyId}` : "Iata sumarul operatiunilor tale in BizHub ERP (Deployed)."}
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Data Curenta</p>
          <p className="font-bold text-gray-700">{new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid - Streamed */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards companyId={effectiveCompanyId} />
      </Suspense>

      {/* AI Insights Section */}
      <Suspense fallback={<AIInsightsSkeleton />}>
        <AIInsights companyId={effectiveCompanyId} />
      </Suspense>

      {/* Main Sections - Streamed separately */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LowStockSkeleton />}>
          <LowStockAlerts companyId={effectiveCompanyId} />
        </Suspense>
        
        <Suspense fallback={<div className="bg-gray-200 rounded-2xl h-full animate-pulse"></div>}>
          <DailyDigest companyId={effectiveCompanyId} />
        </Suspense>
      </div>

      {/* Activity Feed - Streamed */}
      <Suspense fallback={<AuditSkeleton />}>
        <AuditHistory companyId={effectiveCompanyId} />
      </Suspense>
    </div>
  );
}

