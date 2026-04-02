'use client';

import { useState } from 'react';
import { addUnit, deleteUnit } from '@/app/actions/units';
import { Box, Trash2, Plus, Check, X } from 'lucide-react';

export default function UnitsClient({ initialUnits, userRole }: { initialUnits: any[], userRole?: string }) {
  const [units, setUnits] = useState(initialUnits);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ nume: '', simbol: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addUnit(formData);
    if (result.success) {
      setUnits([...units, result.unit]);
      setIsAdding(false);
      setFormData({ nume: '', simbol: '' });
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ești sigur că vrei să ștergi unitatea?')) {
      const result = await deleteUnit(id);
      if (result.success) {
        setUnits(units.filter(u => u.id !== id));
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Box size={20} className="text-indigo-600" />
          Unități Active
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
        >
          {isAdding ? <><X size={16} /> Renunță</> : <><Plus size={16} /> Adaugă Unit</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-6 bg-indigo-50/30 border-b border-indigo-100 flex flex-wrap gap-4 items-end animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nume Unitate</label>
            <input
              type="text"
              required
              placeholder="ex: Kilogram"
              value={formData.nume}
              onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Simbol</label>
            <input
              type="text"
              required
              placeholder="ex: Kg"
              value={formData.simbol}
              onChange={(e) => setFormData({ ...formData, simbol: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-medium text-sm"
            />
          </div>
          <button type="submit" className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
            <Check size={20} />
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Nume</th>
              <th className="px-6 py-4 text-center">Simbol</th>
              {userRole === 'ADMIN' && <th className="px-6 py-4">Companie</th>}
              <th className="px-6 py-4 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {units.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Nu există unități definite.</td>
              </tr>
            ) : (
              units.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{unit.nume}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-black">{unit.simbol}</span>
                  </td>
                  {userRole === 'ADMIN' && (
                    <td className="px-6 py-4 text-sm text-gray-500">{unit.companie?.nume || 'Global'}</td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(unit.id)} className="text-red-400 hover:text-red-600 transition-colors p-2">
                      <Trash2 size={18} />
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
