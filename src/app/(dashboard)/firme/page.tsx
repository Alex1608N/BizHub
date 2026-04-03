import React from "react";
import { getCompanies } from "@/app/actions/users";
import { getSession } from "@/lib/auth";
import CompaniesClient from "@/components/settings/CompaniesClient";
import { redirect } from "next/navigation";

export default async function CompaniesPage() {
  const session = await getSession();
  
  if (!session || session.user.rol !== 'ADMIN') {
      redirect("/dashboard");
  }

  const companies = await getCompanies();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Management Firme
        </h2>
        <p className="text-gray-500 mt-1">Gestionează toate firmele înregistrate pe platforma BizHub.</p>
      </div>

      <CompaniesClient initialCompanies={companies} userRole={session.user.rol} />
    </div>
  );
}
