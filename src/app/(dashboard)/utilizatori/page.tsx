import React, { Suspense } from "react";
import { getUsers, getCompanies } from "@/app/actions/users";
import { getSession } from "@/lib/auth";
import UsersClient from "@/components/settings/UsersClient";

export default async function UsersPage() {
  const session = await getSession();
  const users = await getUsers();
  
  let companies: any[] = [];
  if (session?.user?.rol === 'ADMIN') {
      companies = await getCompanies();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Utilizatori și Echipă
        </h2>
        <p className="text-gray-500 mt-1">
          {session?.user?.rol === 'ADMIN' 
            ? "Gestionează toate firmele și utilizatorii platformei BizHub." 
            : "Gestionează echipa și permisiunile în cadrul firmei tale."}
        </p>
      </div>

      <UsersClient 
        initialUsers={users} 
        initialCompanies={companies} 
        userRole={session?.user?.rol} 
      />
    </div>
  );
}
