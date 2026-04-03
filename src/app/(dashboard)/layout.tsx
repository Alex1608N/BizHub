import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

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
  const userRole = session.user?.rol || "ANGAJAT";
  const hasCompany = !!session.user.companie_id;

  // Redirecționare către Welcome dacă nu are firmă și nu e Admin
  if (userRole !== 'ADMIN' && !hasCompany) {
    redirect("/welcome");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar - Fixat pe desktop, Drawer pe mobil */}
      <Sidebar userName={userName} userRole={userRole} />
      
      {/* Zona de conținut principal */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Padding-ul de sus pentru mobil (unde avem header-ul cu hamburger) */}
        <div className="lg:hidden h-16" />
        
        {/* Padding-ul lateral pe desktop (Sidebar-ul e fixed) */}
        <main className="flex-1 lg:ml-64 transition-all duration-300">
           {/* Header de Desktop subtil */}
           <Header userName={userName} userRole={userRole} hasCompany={hasCompany} />

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
