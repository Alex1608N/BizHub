"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Store,
  Users,
  History,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { logout } from "@/app/actions/auth";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Catalog Produse", href: "/catalog", icon: Package },
  { name: "Timeline Audit", href: "/audit", icon: History },
  { name: "Unitati Biz", href: "/unitati", icon: Store },
  { name: "Utilizatori", href: "/utilizatori", icon: Users },
  { name: "Setari", href: "/settings", icon: Settings },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Stări pentru Desktop (collapsible) și Mobil (drawer)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  // Închidem meniul de mobil când se schimbă pagina
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <>
      {/* Buton Hamburger pentru Mobil - Vizibil doar pe ecrane mici */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
        <span className="text-xl font-bold text-indigo-600 tracking-tight text-shadow-sm">BizHub</span>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay pentru Mobil (fundalul întunecat) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Structură adaptivă */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 flex flex-col transition-all duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-72
        `}
      >
        {/* Header Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-50 bg-white">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              B
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="text-xl font-bold text-gray-900 tracking-tight">BizHub</span>
            )}
          </Link>
          
          {/* Buton de colapsare (doar pe Desktop) */}
          <button 
            onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isMobileOpen ? <X size={20} /> : (isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />)}
          </button>
        </div>

        {/* Meniu Navigare */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"}
                `}
              >
                <item.icon size={22} className={`${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
                {isCollapsed && !isMobileOpen && (
                   <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.name}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar - Profil Utilizator și Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className={`flex items-center ${isCollapsed && !isMobileOpen ? "justify-center" : "px-2 mb-4"}`}>
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm ring-1 ring-indigo-200">
               {initial}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="ml-3 overflow-hidden text-ellipsis whitespace-nowrap">
                <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{userName}</p>
                <p className="text-xs text-gray-500">Membru Echipa Alpha</p>
              </div>
            )}
          </div>
          
          <button 
            className={`
              flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all group
              ${isCollapsed && !isMobileOpen ? "justify-center" : ""}
            `}
            onClick={handleLogout}
          >
            <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
            {(!isCollapsed || isMobileOpen) && <span className="ml-3 font-medium">Deconectare</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
