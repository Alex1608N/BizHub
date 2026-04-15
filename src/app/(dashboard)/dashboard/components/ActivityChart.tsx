import React from "react";
import { getUserWeeklyActivity } from "@/app/actions/audit";
import { BarChart3, TrendingUp } from "lucide-react";

export async function ActivityChart({ userId }: { userId?: string }) {
  const { weekly, today } = await getUserWeeklyActivity(userId);
  
  // Pregatim datele pentru ultimele 7 zile, chiar daca nu exista logs in unele zile
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const log = weekly.find((l: { day: string; count: number }) => l.day === dateStr);
    return {
      label: d.toLocaleDateString('ro-RO', { weekday: 'short' }).charAt(0).toUpperCase(),
      date: dateStr,
      count: log ? log.count : 0
    };
  });

  const maxCount = Math.max(...last7Days.map(d => d.count), 5); // Minim 5 pentru scala

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600" />
            Activitatea Mea
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">Ultimele 7 zile</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
          <TrendingUp size={12} />
          {today} AZI
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 px-2 min-h-[120px]">
        {last7Days.map((day, i) => {
          const height = (day.count / maxCount) * 100;
          const isToday = i === 6;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex flex-col items-center">
                {/* Tooltip la hover */}
                <div className="absolute -top-8 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 font-bold">
                  {day.count} acțiuni
                </div>
                
                {/* Bara propriu-zisa */}
                <div 
                  className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ease-out ${
                    isToday ? 'bg-indigo-600' : 'bg-indigo-100 group-hover:bg-indigo-200'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-black ${isToday ? 'text-indigo-600' : 'text-gray-400'}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ActivityChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full animate-pulse">
      <div className="h-4 w-32 bg-gray-100 rounded mb-6"></div>
      <div className="flex-1 flex items-end justify-between gap-2 px-2 min-h-[120px]">
        {[1,2,3,4,5,6,7].map(i => (
          <div key={i} className="flex-1 bg-gray-50 rounded-t-lg h-12"></div>
        ))}
      </div>
    </div>
  );
}
