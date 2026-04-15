import { getDailyAuditDigest, getAuditLogs } from "@/app/actions/audit";
import { getSession } from "@/lib/auth";
import { History, Package, AlertTriangle, User, Clock, CheckCircle2 } from "lucide-react";

export async function DailyDigest({ companyId }: { companyId?: number }) {
// ... restul funcției DailyDigest rămâne la fel
  const dailyDigest = await getDailyAuditDigest(companyId);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl text-white shadow-lg flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <History size={20} className="text-indigo-100" />
            </div>
            <h3 className="text-xl font-bold">Daily Digest</h3>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed mb-6">
            Activitatea {companyId ? 'firmei selectate' : 'globală'} de ieri inregistrata in sistem:
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Actiuni</p>
              <p className="text-2xl font-bold">{dailyDigest.total}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Editari</p>
              <p className="text-2xl font-bold">{dailyDigest.updates}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-indigo-100 font-medium">Integritate Audit</span>
            <span className="bg-emerald-400 text-emerald-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Verificat</span>
          </div>
          <p className="text-[11px] text-indigo-200 leading-tight">
            Tranzactiile sunt logate securizat conform standardelor.
          </p>
        </div>
    </div>
  );
}

export async function AuditHistory({ companyId }: { companyId?: number }) {
  const [recentLogs, session] = await Promise.all([
    getAuditLogs(companyId),
    getSession()
  ]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <History size={20} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Timeline Activitate</h3>
        </div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Ultimele 10 acțiuni în firmă</p>
      </div>
      
      <div className="divide-y divide-gray-50">
        {recentLogs.slice(0, 10).map((log: any) => {
          let details = "";
          try {
            const rawData = log.date_noi || log.date_vechi || "{}";
            let data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
            details = data.nume || data.email || data.nume_produs || "";
          } catch (e) {}

          const isMe = session?.user?.id === log.user_id;

          return (
            <div key={log.id} className="p-6 hover:bg-indigo-50/20 transition-all flex items-start space-x-4 group">
              <div className={`mt-1 p-2 rounded-xl flex-shrink-0 transition-transform group-hover:scale-110 ${
                log.actiune.includes('CREATE') ? 'bg-emerald-100 text-emerald-600' :
                log.actiune.includes('UPDATE') ? 'bg-blue-100 text-blue-600' :
                'bg-red-100 text-red-600'
              }`}>
                {log.actiune.includes('CREATE') ? <Package size={14} /> : 
                 log.actiune.includes('UPDATE') ? <History size={14} /> : 
                 <AlertTriangle size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                    isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isMe ? "EU" : log.user?.nume || "Sistem"}
                  </span>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {log.actiune.replace(/_/g, ' ')} <span className="text-gray-400 font-normal">în</span> {log.tabel}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium italic">
                  {details ? `"${details}"` : "Detalii indisponibile"}
                </p>
                <div className="flex items-center text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-tighter">
                   <Clock size={10} className="mr-1 opacity-50" />
                   {new Date(log.timestamp).toLocaleString('ro-RO', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                </div>
              </div>
              {isMe && (
                <div className="self-center">
                  <CheckCircle2 size={16} className="text-indigo-200" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AuditSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 h-96 mt-6 animate-pulse"></div>
  );
}
