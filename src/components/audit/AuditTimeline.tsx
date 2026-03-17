'use client';

import React from 'react';
import { 
  PlusCircle, 
  RefreshCcw, 
  Trash2, 
  User, 
  Database,
  ArrowRight
} from 'lucide-react';

interface AuditLog {
  id: number;
  user: { nume: string } | null;
  actiune: string;
  tabel: string;
  date_vechi: string | null;
  date_noi: string | null;
  timestamp: any;
}

export default function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  
  const renderValue = (val: any) => {
    if (val === null || val === undefined) return <span className="text-gray-400 italic">null</span>;
    if (typeof val === 'object') return JSON.stringify(val);
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
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Ultimele acțiuni înregistrate</h2>
          <span className="text-xs text-gray-400">Arată ultimele {logs.length} loguri</span>
        </div>
        
        <div className="divide-y divide-gray-100">
          {logs.map((log) => (
            <div key={log.id} className="p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                    {getActionIcon(log.actiune)}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{log.actiune}</span>
                      <span className="text-gray-400">pe</span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-mono uppercase">
                        {log.tabel}
                      </span>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <User size={12} className="mr-1" />
                        {log.user?.nume || 'Sistem'}
                      </div>
                      <div className="flex items-center">
                        <Database size={12} className="mr-1" />
                        ID Log: #{log.id}
                      </div>
                      <div>
                        {new Date(log.timestamp).toLocaleString('ro-RO')}
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      {formatChanges(log.date_vechi, log.date_noi)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="p-10 text-center text-gray-500 italic">
              Nu s-au găsit loguri de audit în baza de date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
