'use client';

import { useState, useRef, useEffect } from 'react';
import ProductForm from './ProductForm';
import { deleteProduct, recordStockMovement, importProducts } from '@/app/actions/products';
import { recordSale } from '@/app/actions/sales';
import Papa from 'papaparse';
import { Lock, Package, ShoppingCart } from 'lucide-react';

interface CatalogClientProps {
  initialProducts: any[];
  categories: any[];
  units: any[];
  companyId?: number;
}

export default function CatalogClient({ initialProducts, categories, units, companyId }: CatalogClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincronizăm produsele dacă vin date noi de la server (ex: după un revalidatePath)
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const handleSale = async (product: any) => {
    const qtyStr = prompt(`Cantitate de vândut pentru ${product.nume}:`, "1");
    if (qtyStr === null) return;
    
    const qty = parseInt(qtyStr, 10);
    if (isNaN(qty) || qty <= 0) {
      alert("Cantitate invalidă!");
      return;
    }

    if (qty > product.stoc) {
      alert("Stoc insuficient!");
      return;
    }

    const currentStoc = product.stoc;
    const newStoc = currentStoc - qty;

    // Optimistic Update
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, stoc: newStoc } : p
    ));

    const result = await recordSale([{ productId: product.id, quantity: qty }], companyId);
    
    if (!result.success) {
      // Rollback
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, stoc: currentStoc } : p
      ));
      alert((result as any).error);
    } else {
      alert("Vânzare înregistrată cu succes!");
    }
  };

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
          alert((result as any).error);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const handleStockChange = async (product: any, change: number) => {
    const currentStoc = product.stoc;
    const newStoc = currentStoc + change;

    if (newStoc < 0) {
      alert("Stocul nu poate deveni negativ!");
      return;
    }

    // --- OPTIMISTIC UPDATE ---
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, stoc: newStoc } : p
    ));

    const result = await recordStockMovement(product.id, change);
    
    if (!result.success) {
      // --- ROLLBACK ---
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, stoc: currentStoc } : p
      ));
      alert((result as any).error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ești sigur că vrei să ștergi acest produs?')) {
      const originalProducts = [...products];
      // Optimistic delete
      setProducts(prev => prev.filter(p => p.id !== id));
      
      const result = await deleteProduct(id);
      if (!result.success) {
        setProducts(originalProducts);
        alert((result as any).error);
      }
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
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Catalog Produse</h1>
          <p className="text-sm text-gray-500 mt-1">Gestionează inventarul și prețurile produselor.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
                className="flex-1 sm:flex-none inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl transition-all border border-gray-200 shadow-sm font-medium text-sm"
              >
                Import CSV
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 sm:flex-none inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 font-medium text-sm"
              >
                + Adaugă Produs
              </button>
            </>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-8 p-4 md:p-6 bg-white rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-50/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
          <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
              <Package size={18} className="text-indigo-600" />
            </div>
            {editingProduct ? `Editează: ${editingProduct.nume}` : 'Adaugă Produs Nou'}
          </h2>
          <ProductForm
            initialData={editingProduct}
            categories={categories}
            units={units}
            companyId={companyId}
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

      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Produs</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Categorie</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Stoc</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Preț</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Unitate</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-400 italic">
                    Nu există produse în catalog.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className={`hover:bg-indigo-50/30 transition-colors group ${!product.isEditable ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 mr-3 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          <Package size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{product.nume}</span>
                        {!product.isEditable && (
                          <span title="Editare restricționată (7+ zile)" className="ml-2 inline-flex items-center p-1 bg-amber-50 text-amber-600 rounded">
                            <Lock size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-tight">
                        {product.categorie?.nume || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStockChange(product, -1)}
                          disabled={!product.isEditable}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all border ${
                            !product.isEditable 
                              ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm active:scale-95'
                          }`}
                        >
                          -
                        </button>
                        <span className={`font-black text-center text-lg min-w-[2.5rem] ${product.stoc < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stoc}
                        </span>
                        <button
                          onClick={() => handleStockChange(product, 1)}
                          disabled={!product.isEditable}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all border ${
                            !product.isEditable 
                              ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' 
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-sm active:scale-95'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      {(product.pret / 100).toLocaleString('ro-RO', { minimumFractionDigits: 2 })} <span className="text-[10px] text-gray-400 font-medium">RON</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium italic">
                      {product.unitate?.simbol || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSale(product)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all active:scale-95"
                        >
                          <ShoppingCart size={14} />
                          Vinde
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          disabled={!product.isEditable}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            !product.isEditable 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-indigo-600 hover:bg-indigo-50 active:scale-95'
                          }`}
                        >
                          Editează
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={!product.isEditable}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                            !product.isEditable 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-red-600 hover:bg-red-50 active:scale-95'
                          }`}
                        >
                          Șterge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
