'use client';

import React, { useEffect, useState } from "react";
import { X, History, Clock, FileText, ArrowRight } from "lucide-react";
import { getUserFullActivity } from "@/app/actions/audit";

export default function UserActivityModal({ userId, userName, onClose }: { userId: string, userName: string, onClose: () => void }) {
  const [data, setData] = useState<{ logs: any[], attendance: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'pontaj'>('audit');

  useEffect(() => {
    async function fetchData() {
      const res = await getUserFullActivity(userId);
      setData(res);
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-50/30">
          <div>
            <h3 className="font-black text-gray-900 text-xl tracking-tight">Activitate: {userName}</h3>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-widest mt-1">Istoric Audit & Pontaj</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm border border-transparent hover:border-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-4 border-b border-gray-50">
          <button 
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'audit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} /> Audit Modificări
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('pontaj')}
            className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'pontaj' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} /> Pontaj (Timp Lucru)
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Se încarcă datele...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'audit' ? (
                data?.logs.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 font-medium italic">Nicio acțiune înregistrată încă.</p>
                ) : (
                  data?.logs.map((log) => (
                    <div key={log.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          log.actiune === 'CREATE' ? 'bg-emerald-100 text-emerald-700' : 
                          log.actiune === 'UPDATE' ? 'bg-indigo-100 text-indigo-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {log.actiune}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {new Date(log.timestamp).toLocaleString('ro-RO')}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-800">
                        {log.actiune === 'CREATE' ? 'A adăugat' : log.actiune === 'UPDATE' ? 'A modificat' : 'A șters'} un obiect în <span className="text-indigo-600">{log.tabel}</span>
                      </p>
                    </div>
                  ))
                )
              ) : (
                data?.attendance.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 font-medium italic">Nicio înregistrare de pontaj.</p>
                ) : (
                  <div className="space-y-3">
                    {data?.attendance.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.tip === 'START' ? 'bg-emerald-100 text-emerald-600' :
                          entry.tip === 'END' ? 'bg-rose-100 text-rose-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {entry.tip === 'START' ? <Play size={18} fill="currentColor" /> :
                           entry.tip === 'END' ? <Square size={18} fill="currentColor" /> :
                           <Coffee size={18} fill="currentColor" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-800 text-sm tracking-tight">
                            {entry.tip === 'START' ? 'Început Lucru' :
                             entry.tip === 'END' ? 'Finalizat Lucru' :
                             entry.tip === 'PAUZA_START' ? 'Început Pauză' : 'Finalizat Pauză'}
                          </p>
                          <p className="text-xs text-gray-400 font-bold uppercase">
                            {new Date(entry.timestamp).toLocaleString('ro-RO')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/30 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sistem de Monitorizare BizHub v1.0</p>
        </div>
      </div>
    </div>
  );
}

const Play = ({ size, fill, className }: { size: number, fill?: string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Square = ({ size, fill, className }: { size: number, fill?: string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="6" width="12" height="12" />
  </svg>
);

const Coffee = ({ size, fill, className }: { size: number, fill?: string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
