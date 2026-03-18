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
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar userName={userName} />
      
      {/* 
        Pentru a păstra structura de layout flexibilă, 
        Sidebar-ul randează doar structura, iar noi injectăm copiii 
        folosind o abordare hibridă, dar pentru simplitate 
        vom muta logica de header înapoi în Layout dacă este nevoie, 
        sau putem randa copiii absolut peste slot. 
        O abordare mai curată în Next.js App Router:
      */}
      <div className="absolute top-16 left-0 right-0 bottom-0 overflow-auto bg-gray-50/50 p-8" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
         <style>{`
           @media (min-width: 0px) {
             :root {
               --sidebar-width: 16rem;
             }
             .w-20 + .absolute {
                --sidebar-width: 5rem;
             }
           }
         `}</style>
         {children}
      </div>
    </div>
  );
}
