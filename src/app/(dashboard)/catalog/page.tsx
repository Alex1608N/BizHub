import { getProducts, getCategories } from '@/app/actions/products';
import { getUnits } from '@/app/actions/units';
import CatalogClient from '@/components/catalog/CatalogClient';
import { cookies } from "next/headers";
import { COMPANY_COOKIE_NAME } from "@/lib/company";
import { getSession } from '@/lib/auth';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const params = await searchParams;
  const companyIdFromUrl = params.companyId ? parseInt(params.companyId, 10) : undefined;
  
  if (params.companyId && (isNaN(companyIdFromUrl!) || companyIdFromUrl! <= 0)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600 font-bold">ID firma invalid.</p>
      </div>
    );
  }

  const session = await getSession();
  const cookieStore = await cookies();
  const selectedCompanyCookie = cookieStore.get(COMPANY_COOKIE_NAME);
  const companyIdFromCookie = selectedCompanyCookie ? parseInt(selectedCompanyCookie.value) : undefined;

  const effectiveCompanyId = companyIdFromUrl || companyIdFromCookie;

  const [products, categories, units] = await Promise.all([
    getProducts(effectiveCompanyId),
    getCategories(effectiveCompanyId),
    getUnits(effectiveCompanyId)
  ]);

  return (
    <CatalogClient 
      initialProducts={products} 
      categories={categories} 
      units={units} 
      companyId={effectiveCompanyId}
      userRole={session?.user?.rol}
    />
  );
}
