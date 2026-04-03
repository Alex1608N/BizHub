import { getProducts, getCategories } from '@/app/actions/products';
import { getUnits } from '@/app/actions/units';
import CatalogClient from '@/components/catalog/CatalogClient';

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const params = await searchParams;
  const companyId = params.companyId ? parseInt(params.companyId) : undefined;

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
