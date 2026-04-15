import { getProducts, getCategories } from '@/app/actions/products';
import { getUnits } from '@/app/actions/units';
import CatalogClient from '@/components/catalog/CatalogClient';

export default async function CatalogPage({
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

  const [products, categories, units] = await Promise.all([
    getProducts(companyId),
    getCategories(companyId),
    getUnits(companyId)
  ]);

  return (
    <CatalogClient 
      initialProducts={products} 
      categories={categories} 
      units={units} 
    />
  );
}
