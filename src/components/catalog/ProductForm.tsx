'use client';

import { useState } from 'react';
import { addProduct, updateProduct, createCategory } from '@/app/actions/products';
import { generateProductDescription } from '@/app/actions/ai';
import { 
  Package, 
  Tag, 
  Hash, 
  Coins, 
  Info, 
  Plus, 
  X, 
  Check,
  Layers,
  Box,
  Sparkles
} from 'lucide-react';

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  units: any[];
  companyId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, categories, units, companyId, onSuccess, onCancel }: ProductFormProps) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const handleGenerateDescription = async () => {
    if (!formData.nume) {
      alert("Te rugăm să introduci numele produsului mai întâi.");
      return;
    }

    setIsGeneratingDescription(true);
    try {
      const category = localCategories.find(c => c.id.toString() === formData.categorie_id.toString());
      const description = await generateProductDescription(formData.nume, category?.nume);
      setFormData(prev => ({ ...prev, descriere: description }));
    } catch (error) {
      console.error(error);
      alert("Nu am putut genera descrierea.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    const result = await createCategory({ 
        nume: newCategoryName,
        companie_id: companyId 
    });
    if (result.success && result.category) {
      setLocalCategories([...localCategories, result.category]);
      setFormData({ ...formData, categorie_id: result.category.id.toString() });
      setIsAddingCategory(false);
      setNewCategoryName('');
    } else {
      alert((result as any).error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const pretValue = parseFloat(formData.pret);
    if (isNaN(pretValue) || pretValue <= 0) {
      alert("Prețul trebuie să fie mai mare decât 0.");
      setIsSubmitting(false);
      return;
    }
    
    if (formData.stoc < 0) {
      alert("Stocul nu poate fi negativ.");
      setIsSubmitting(false);
      return;
    }
    
    const { id, ...dataToSend } = {
      ...formData,
      id: initialData?.id,
      pret: Math.round(parseFloat(formData.pret) * 100),
      categorie_id: formData.categorie_id ? parseInt(formData.categorie_id.toString()) : undefined,
      unitate_id: formData.unitate_id ? parseInt(formData.unitate_id.toString()) : undefined,
      companie_id: companyId // Includem ID-ul firmei selectate
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
      alert((result as any).error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Secțiunea: Informații Generale */}
        <div className="space-y-4 md:col-span-2">
           <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Info size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Informații Generale</h3>
           </div>
           
           <div className="group">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nume Produs *</label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                 <Package size={18} />
               </div>
               <input
                 type="text"
                 required
                 placeholder="ex: Șuruburi 10mm"
                 value={formData.nume}
                 onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
                 className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white sm:text-sm transition-all font-medium"
               />
             </div>
           </div>

           <div className="group">
             <div className="flex justify-between items-center mb-1.5 px-1">
               <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Descriere Detaliată</label>
               <button
                 type="button"
                 onClick={handleGenerateDescription}
                 disabled={isGeneratingDescription || !formData.nume}
                 className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 disabled:text-gray-300 transition-colors flex items-center gap-1.5"
               >
                 {isGeneratingDescription ? (
                   <><div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" /> Se generează...</>
                 ) : (
                   <><Sparkles size={12} className="text-indigo-500" /> Generează cu AI</>
                 )}
               </button>
             </div>
             <textarea
               rows={3}
               placeholder="Adaugă detalii despre produs..."
               value={formData.descriere}
               onChange={(e) => setFormData({ ...formData, descriere: e.target.value })}
               className="block w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white sm:text-sm transition-all font-medium"
             />
           </div>
        </div>

        {/* Secțiunea: Valori și Stoc */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2 text-emerald-600">
              <Coins size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Preț și Stoc</h3>
           </div>

           <div className="group">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Preț (RON) *</label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                 <Tag size={18} />
               </div>
               <input
                 type="number"
                 step="0.01"
                 required
                 value={formData.pret}
                 onChange={(e) => setFormData({ ...formData, pret: e.target.value })}
                 className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white sm:text-sm transition-all font-medium"
               />
             </div>
           </div>

           <div className="group">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Stoc Inițial</label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                 <Hash size={18} />
               </div>
<input
                  type="number"
                  min="0"
                  value={formData.stoc}
                  onChange={(e) => setFormData({ ...formData, stoc: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white sm:text-sm transition-all font-medium"
                />
             </div>
           </div>
        </div>

        {/* Secțiunea: Clasificare */}
        <div className="space-y-4">
           <div className="flex items-center gap-2 mb-2 text-purple-600">
              <Layers size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider">Clasificare</h3>
           </div>

           <div className="group">
             <div className="flex justify-between items-center mb-1.5 px-1">
               <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Categorie</label>
               <button
                 type="button"
                 onClick={() => setIsAddingCategory(!isAddingCategory)}
                 className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
               >
                 {isAddingCategory ? <><X size={10} /> Renunță</> : <><Plus size={10} /> Nouă</>}
               </button>
             </div>
             
             {isAddingCategory ? (
               <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                 <input
                   type="text"
                   autoFocus
                   placeholder="Nume..."
                   value={newCategoryName}
                   onChange={(e) => setNewCategoryName(e.target.value)}
                   className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-50 focus:outline-none transition-all"
                 />
                 <button
                   type="button"
                   onClick={handleCreateCategory}
                   className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                 >
                   <Check size={18} />
                 </button>
               </div>
             ) : (
               <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                   <Layers size={18} />
                 </div>
                 <select
                   value={formData.categorie_id}
                   onChange={(e) => setFormData({ ...formData, categorie_id: e.target.value })}
                   className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-500 focus:bg-white sm:text-sm transition-all font-medium cursor-pointer"
                 >
                   <option value="">Alege o categorie</option>
                   {localCategories.map((cat) => (
                     <option key={cat.id} value={cat.id}>{cat.nume}</option>
                   ))}
                 </select>
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                   <Plus size={14} className="opacity-50" />
                 </div>
               </div>
             )}
           </div>

           <div className="group">
             <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Unitate de Măsură</label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <Box size={18} />
               </div>
               <select
                 value={formData.unitate_id}
                 onChange={(e) => setFormData({ ...formData, unitate_id: e.target.value })}
                 className="block w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-500 focus:bg-white sm:text-sm transition-all font-medium cursor-pointer"
               >
                 <option value="">Alege o unitate</option>
                 {units.map((unit) => (
                   <option key={unit.id} value={unit.id}>{unit.simbol} ({unit.nume})</option>
                 ))}
               </select>
             </div>
           </div>
        </div>
      </div>

      {/* Butoane Acțiune */}
      <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
        >
          Renunță
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Se salvează...</span>
            </>
          ) : (
            <>
              <Check size={18} />
              <span>Salvează Produs</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
