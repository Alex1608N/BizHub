import React, { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { StatsCards, StatsCardsSkeleton } from "./components/StatsCards";
import { LowStockAlerts, LowStockSkeleton } from "./components/LowStockAlerts";
import { DailyDigest, AuditHistory, AuditSkeleton } from "./components/AuditHistory";
import AIInsights, { AIInsightsSkeleton } from "@/components/dashboard/AIInsights";

export default async function DashboardPage() {
  const session = await getSession();
  
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

      {/* Stats Grid - Streamed */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* AI Insights Section */}
      <Suspense fallback={<AIInsightsSkeleton />}>
        <AIInsights />
      </Suspense>

      {/* Main Sections - Streamed separately */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<LowStockSkeleton />}>
          <LowStockAlerts />
        </Suspense>
        
        <Suspense fallback={<div className="bg-gray-200 rounded-2xl h-full animate-pulse"></div>}>
          <DailyDigest />
        </Suspense>
      </div>

      {/* Activity Feed - Streamed */}
      <Suspense fallback={<AuditSkeleton />}>
        <AuditHistory />
      </Suspense>
    </div>
  );
}
