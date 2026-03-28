import { getProducts, getCategories, getUnits } from '@/app/actions/products';
import CatalogClient from '@/components/catalog/CatalogClient';

export default async function CatalogPage() {
  const [products, categories, units] = await Promise.all([
    getProducts(),
    getCategories(),
    getUnits()
  ]);

  return (
    <CatalogClient 
      initialProducts={products} 
      categories={categories} 
      units={units} 
    />
  );
}
