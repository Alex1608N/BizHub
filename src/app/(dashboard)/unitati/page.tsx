import React, { Suspense } from "react";
import { getUnits } from "@/app/actions/units";
import { getSession } from "@/lib/auth";
import UnitsClient from "@/components/settings/UnitsClient";

export default async function UnitsPage() {
  const session = await getSession();
  const units = await getUnits();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Unități de Măsură
        </h2>
        <p className="text-gray-500 mt-1">Gestionează unitățile folosite pentru produsele tale.</p>
      </div>

      <UnitsClient initialUnits={units} userRole={session?.user?.rol} />
    </div>
  );
}
