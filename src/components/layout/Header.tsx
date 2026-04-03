'use client';

import React from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "./NotificationBell";
import { Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Header({ userName, userRole, hasCompany }: { userName: string, userRole: string, hasCompany: boolean }) {
  const pathname = usePathname();
  const pageName = pathname.split('/').pop() || 'Dashboard';

  return (
    <header className="hidden lg:flex h-16 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">BizHub</span>
          <span className="text-sm font-semibold text-gray-700 capitalize">{pageName === 'dashboard' ? 'ERP' : pageName}</span>
        </div>
        
        {userRole === 'ADMIN' && hasCompany && (
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-amber-100 transition-all border border-amber-100"
          >
            <Globe size={12} /> Revenire la Global
          </Link>
        )}
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell />

        <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 leading-tight">{userName}</p>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{userRole}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md uppercase">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
