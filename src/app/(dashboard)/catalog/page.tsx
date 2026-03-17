import { getProducts, getCategories, getUnits } from '@/app/actions/products';
import CatalogClient from '@/components/catalog/CatalogClient';

export default async function CatalogPage() {
  const products = await getProducts();
  const categories = await getCategories();
  const units = await getUnits();

  return (
    <CatalogClient 
      initialProducts={products} 
      categories={categories} 
      units={units} 
    />
  );
}
