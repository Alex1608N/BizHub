import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userName = session.user?.nume || "Utilizator";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar - Fixat pe desktop, Drawer pe mobil */}
      <Sidebar userName={userName} />
      
      {/* Zona de conținut principal */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Padding-ul de sus pentru mobil (unde avem header-ul cu hamburger) */}
        <div className="lg:hidden h-16" />
        
        {/* Padding-ul lateral pe desktop (Sidebar-ul e fixed) */}
        <main className="flex-1 lg:ml-64 transition-all duration-300">
           {/* Adăugăm un Header de Desktop subtil */}
           <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                 <span className="text-sm font-medium text-gray-400">Pagina</span>
                 <span className="text-sm font-semibold text-gray-700">Dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right mr-2">
                    <p className="text-sm font-bold text-gray-900">{userName}</p>
                    <p className="text-xs text-indigo-600 font-medium tracking-tight">Status: Online</p>
                 </div>
              </div>
           </header>

           {/* Conținutul paginii propriu-zise */}
           <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
              {children}
           </div>
        </main>
      </div>

      {/* Stil pentru a ajusta margin-ul cand sidebar-ul e collapsed (folosim o clasa custom) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          aside.lg\\:w-20 + div main {
            margin-left: 5rem;
          }
        }
      `}} />
    </div>
  );
}
