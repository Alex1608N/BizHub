'use client';

import React, { useState, useEffect } from "react";
import { Play, Square, Coffee, PlayCircle, Loader2 } from "lucide-react";
import { getTodayStatus, recordAttendance, AttendanceType } from "@/app/actions/attendance";

export default function AttendanceControls() {
  const [lastStatus, setLastStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    setLoading(true);
    const status = await getTodayStatus();
    setLastStatus(status);
    setLoading(false);
  }

  async function handleAction(tip: AttendanceType) {
    setActionLoading(true);
    const result = await recordAttendance(tip);
    if (result.success) {
      await fetchStatus();
    }
    setActionLoading(false);
  }

  if (loading) {
    return <div className="animate-pulse w-32 h-8 bg-gray-100 rounded-lg"></div>;
  }

  const currentType = lastStatus?.tip;

  return (
    <div className="flex items-center gap-2">
      {actionLoading && <Loader2 size={16} className="animate-spin text-indigo-600" />}
      
      {!currentType || currentType === 'END' ? (
        <button
          onClick={() => handleAction('START')}
          disabled={actionLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
          title="Incepe activitatea"
        >
          <Play size={14} fill="currentColor" /> START
        </button>
      ) : currentType === 'START' || currentType === 'PAUZA_STOP' ? (
        <>
          <button
            onClick={() => handleAction('PAUZA_START')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100 shadow-sm"
            title="Incepe pauza"
          >
            <Coffee size={14} fill="currentColor" /> PAUZA
          </button>
          <button
            onClick={() => handleAction('END')}
            disabled={actionLoading}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100 shadow-sm"
            title="Termina activitatea"
          >
            <Square size={14} fill="currentColor" /> STOP
          </button>
        </>
      ) : currentType === 'PAUZA_START' ? (
        <button
          onClick={() => handleAction('PAUZA_STOP')}
          disabled={actionLoading}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm"
          title="Reia activitatea"
        >
          <PlayCircle size={14} fill="currentColor" /> REIA LUCRUL
        </button>
      ) : null}
    </div>
  );
}
