'use client';

import { useState, useRef } from 'react';
import ProductForm from './ProductForm';
import { deleteProduct, recordStockMovement, importProducts } from '@/app/actions/products';
import Papa from 'papaparse';
import { Lock } from 'lucide-react';

interface CatalogClientProps {
  initialProducts: any[];
  categories: any[];
  units: any[];
}

export default function CatalogClient({ initialProducts, categories, units }: CatalogClientProps) {
  // ... restul codului rămâne neschimbat până la return ...
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const result = await importProducts(results.data);
        if (result.success) {
          alert(`Import reușit: ${result.count} produse adăugate.`);
        } else {
          alert(result.error);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const handleStockChange = async (id: number, change: number) => {
    const result = await recordStockMovement(id, change);
    if (!result.success) {
      alert(result.error);
    }
  };

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
        <div className="flex space-x-3">
          {!isFormOpen && (
            <>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleImportCSV}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors border"
              >
                Import CSV
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                + Adaugă Produs
              </button>
            </>
          )}
        </div>
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
                <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${!product.isEditable ? 'bg-gray-50/30' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium flex items-center">
                    {product.nume}
                    {!product.isEditable && (
                      <Lock size={14} className="ml-2 text-gray-400" title="Editare restricționată (7+ zile)" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.categorie?.nume || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleStockChange(product.id, -1)}
                        disabled={!product.isEditable}
                        className={`w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 transition-colors ${
                          !product.isEditable ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'
                        }`}
                        title={!product.isEditable ? "Fereastra de editare a expirat" : "Scade stoc"}
                      >
                        -
                      </button>
                      <span className={`font-medium min-w-[20px] text-center ${!product.isEditable ? 'text-gray-400' : 'text-gray-900'}`}>
                        {product.stoc}
                      </span>
                      <button
                        onClick={() => handleStockChange(product.id, 1)}
                        disabled={!product.isEditable}
                        className={`w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 transition-colors ${
                          !product.isEditable ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200'
                        }`}
                        title={!product.isEditable ? "Fereastra de editare a expirat" : "Adaugă stoc"}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {(product.pret / 100).toFixed(2)} RON
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.unitate?.simbol || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      disabled={!product.isEditable}
                      className={`${
                        !product.isEditable ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-900'
                      } mr-4`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={!product.isEditable}
                      className={`${
                        !product.isEditable ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-900'
                      }`}
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
