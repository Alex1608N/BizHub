'use client';

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  RefreshCcw, 
  Trash2, 
  User, 
  Database,
  ArrowRight,
  FileDown,
  Calendar,
  Clock
} from 'lucide-react';
import { generateStockPDF } from '@/lib/pdf-generator';
import { exportAuditToExcel } from '@/lib/excel-generator';

interface AuditLog {
  id: number;
  user: { nume: string } | null;
  actiune: string;
  tabel: string;
  date_vechi: string | null;
  date_noi: string | null;
  timestamp: any;
}

export default function AuditTimeline({ logs, company }: { logs: AuditLog[], company: any }) {
  
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtrare loguri pe baza de date (Client-Side pentru MVP)
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp).toISOString().split('T')[0];
      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      return true;
    });
  }, [logs, startDate, endDate]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await exportAuditToExcel(filteredLogs, company?.nume || 'BizHub_ERP');
    } catch (e) {
      console.error('Excel Export Error:', e);
      alert('Eroare la exportul Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPDF = (log: AuditLog) => {
    if (!log.date_noi || !log.date_vechi) return;
    
    try {
      const oldData = JSON.parse(log.date_vechi);
      const newData = JSON.parse(log.date_noi);
      
      const stocVechi = oldData.stoc || 0;
      const stocNou = newData.stoc || 0;
      const diferenta = stocNou - stocVechi;
      
      const produsId = newData.id || oldData.id;
      const numeProdus = newData.nume || oldData.nume || `Produs #${produsId}`;
      const unitate = newData.unitate || oldData.unitate || 'Buc';
      const pret = newData.pret || oldData.pret || 0;

      generateStockPDF(company || { nume: 'BizHub ERP' }, {
        id: log.id,
        data: new Date(log.timestamp),
        tip: diferenta > 0 ? 'INTRARE' : 'IESIRE',
        user: log.user?.nume || 'Sistem',
        items: [{
          nume: numeProdus,
          cantitate: Math.abs(diferenta),
          pret: pret,
          unitate: unitate
        }]
      });
    } catch (e) {
      console.error('Error generating PDF:', e);
      alert('Eroare la generarea PDF-ului.');
    }
  };

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return <span className="text-gray-400 italic">null</span>;
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'number' && val > 1000000000000) return new Date(val).toLocaleString('ro-RO');
    return String(val);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="text-green-500" size={18} />;
      case 'UPDATE': return <RefreshCcw className="text-blue-500" size={18} />;
      case 'DELETE': return <Trash2 className="text-red-500" size={18} />;
      case 'IMPORT': return <Database className="text-purple-500" size={18} />;
      default: return <Database className="text-gray-500" size={18} />;
    }
  };

  const formatChanges = (oldDataStr: string | null, newDataStr: string | null) => {
    try {
      const oldData = oldDataStr ? JSON.parse(oldDataStr) : null;
      const newData = newDataStr ? JSON.parse(newDataStr) : null;

      if (!oldData && newData) {
        return <div className="text-sm text-gray-600">Creat cu datele: <span className="font-mono bg-gray-100 p-0.5 rounded text-xs">{newDataStr}</span></div>;
      }

      if (oldData && !newData) {
        return <div className="text-sm text-gray-600">Șters datele: <span className="font-mono bg-gray-100 p-0.5 rounded text-xs">{oldDataStr}</span></div>;
      }

      if (oldData && newData) {
        const changes: React.ReactNode[] = [];
        Object.keys(newData).forEach(key => {
          if (oldData[key] !== newData[key] && key !== 'timestamp') {
            changes.push(
              <div key={key} className="flex items-center space-x-2 text-sm py-0.5">
                <span className="font-semibold text-gray-700 w-24 truncate">{key}:</span>
                <span className="text-red-500 line-through truncate max-w-[100px]">{renderValue(oldData[key])}</span>
                <ArrowRight size={14} className="text-gray-400" />
                <span className="text-green-600 font-medium truncate max-w-[100px]">{renderValue(newData[key])}</span>
              </div>
            );
          }
        });
        return changes.length > 0 ? changes : <span className="text-xs text-gray-400 italic">Nicio schimbare detectată în câmpuri</span>;
      }
    } catch (e) {
      return <span className="text-xs text-red-400 italic font-mono">Eroare parsing date: {oldDataStr || newDataStr}</span>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header cu Filtre */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Calendar size={10} /> De la
              </label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                <Calendar size={10} /> Până la
              </label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium pb-2"
              >
                Resetează
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="text-right mr-2 hidden sm:block">
              <div className="text-sm font-semibold text-gray-700">Filtre active</div>
              <div className="text-xs text-gray-400">{filteredLogs.length} înregistrări</div>
            </div>
            <button
              onClick={handleExportExcel}
              disabled={isExporting || filteredLogs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FileDown size={18} />
              )}
              Export Contabil
            </button>
          </div>
        </div>
        
        {/* Lista Loguri */}
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => {
            let itemName = "";
            try {
              const data = JSON.parse(log.date_noi || log.date_vechi || "{}");
              itemName = data.nume || data.email || "";
            } catch (e) {}

            return (
              <div key={log.id} className="p-5 hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 p-2 bg-gray-100 rounded-lg group-hover:bg-white shadow-sm transition-colors border border-gray-100">
                      {getActionIcon(log.actiune)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-gray-900 tracking-tight">{log.actiune}</span>
                        {itemName && (
                          <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            "{itemName}"
                          </span>
                        )}
                        <span className="text-gray-400 text-xs font-medium lowercase">pe</span>
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-black uppercase tracking-widest border border-gray-200">
                          {log.tabel}
                        </span>
                      </div>
                      
                      <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-gray-400 font-medium">
                        <div className="flex items-center text-gray-600">
                          <User size={12} className="mr-1 text-gray-400" />
                          {log.user?.nume || 'Sistem'}
                        </div>
                        <div className="flex items-center">
                          <Database size={12} className="mr-1 text-gray-300" />
                          ID: #{log.id}
                        </div>
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1 text-gray-300" />
                          {new Date(log.timestamp).toLocaleString('ro-RO')}
                        </div>
                      </div>
                      
                      <div className="mt-3 p-4 bg-white rounded-xl border border-gray-100 group-hover:border-indigo-100 shadow-sm transition-all">
                        {formatChanges(log.date_vechi, log.date_noi)}
                      </div>
                    </div>
                  </div>

                  {log.tabel === 'stoc' && (
                    <button
                      onClick={() => handleDownloadPDF(log)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      title="Descarcă PDF"
                    >
                      <FileDown size={14} />
                      PDF
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic">
              {logs.length === 0 ? "Nu s-au găsit loguri în baza de date." : "Nicio înregistrare pentru intervalul selectat."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
