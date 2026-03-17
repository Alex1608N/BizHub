'use client';

import { useState } from 'react';
import { addProduct, updateProduct, createCategory } from '@/app/actions/products';

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  units: any[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, categories, units, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    nume: initialData?.nume || '',
    descriere: initialData?.descriere || '',
    pret: initialData ? (initialData.pret / 100).toString() : '0',
    stoc: initialData?.stoc || 0,
    categorie_id: initialData?.categorie_id || '',
    unitate_id: initialData?.unitate_id || '',
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [localCategories, setLocalCategories] = useState(categories);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const result = await createCategory({ nume: newCategoryName });
    if (result.success && result.category) {
      setLocalCategories([...localCategories, result.category]);
      setFormData({ ...formData, categorie_id: result.category.id.toString() });
      setIsAddingCategory(false);
      setNewCategoryName('');
    } else {
      alert(result.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      pret: Math.round(parseFloat(formData.pret) * 100), // convertim in bani (intreg)
      categorie_id: formData.categorie_id ? parseInt(formData.categorie_id.toString()) : undefined,
      unitate_id: formData.unitate_id ? parseInt(formData.unitate_id.toString()) : undefined,
    };

    let result;
    if (initialData?.id) {
      result = await updateProduct(initialData.id, dataToSend);
    } else {
      result = await addProduct(dataToSend);
    }

    if (result.success) {
      onSuccess();
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg border">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nume Produs *</label>
        <input
          type="text"
          required
          value={formData.nume}
          onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Descriere</label>
        <textarea
          value={formData.descriere}
          onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preț (RON) *</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.pret}
            onChange={(e) => setFormData({ ...formData, pret: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Stoc Inițial</label>
          <input
            type="number"
            value={formData.stoc}
            onChange={(e) => setFormData({ ...formData, stoc: parseInt(e.target.value) || 0 })}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Categorie</label>
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              {isAddingCategory ? 'Anulează' : '+ Nouă'}
            </button>
          </div>
          
          {isAddingCategory ? (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Nume categorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 border rounded-md px-3 py-1 text-sm"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
              >
                OK
              </button>
            </div>
          ) : (
            <select
              value={formData.categorie_id}
              onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
              className="mt-1 block w-full border rounded-md px-3 py-2 bg-white"
            >
              <option value="">Alege o categorie</option>
              {localCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nume}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unitate</label>
          <select
            value={formData.unitate_id}
            onChange={(e) => setFormData({ ...formData, unitate_id: e.target.value })}
            className="mt-1 block w-full border rounded-md px-3 py-2 bg-white"
          >
            <option value="">Alege o unitate</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.simbol}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Anulează
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Salvează Produs
        </button>
      </div>
    </form>
  );
}
