'use client';

import { useState } from 'react';
import ProductForm from './ProductForm';
import { deleteProduct } from '@/app/actions/products';

interface CatalogClientProps {
  initialProducts: any[];
  categories: any[];
  units: any[];
}

export default function CatalogClient({ initialProducts, categories, units }: CatalogClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleDelete = async (id: number) => {
    if (confirm('Ești sigur că vrei să ștergi acest produs?')) {
      const result = await deleteProduct(id);
      if (!result.success) alert(result.error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Catalog Produse</h1>
        {!isFormOpen && (
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            + Adaugă Produs
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? `Editează: ${editingProduct.nume}` : 'Adaugă Produs Nou'}
          </h2>
          <ProductForm
            initialData={editingProduct}
            categories={categories}
            units={units}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nume</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stoc</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preț</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unitate</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  Nu există produse în catalog.
                </td>
              </tr>
            ) : (
              initialProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{product.nume}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.categorie?.nume || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{product.stoc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {(product.pret / 100).toFixed(2)} RON
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.unitate?.simbol || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Șterge
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
