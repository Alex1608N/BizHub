"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Store,
  Users,
  History
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Catalog Produse", href: "/catalog", icon: Package },
  { name: "Timeline Audit", href: "/audit", icon: History },
  { name: "Unitati Biz", href: "/unitati", icon: Store },
  { name: "Utilizatori", href: "/utilizatori", icon: Users },
  { name: "Setari", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="text-xl font-bold text-indigo-600">BizHub ERP</span>
          ) : (
            <span className="text-xl font-bold text-indigo-600">BH</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 font-semibold" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-indigo-600" : "text-gray-400"} />
                {isSidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Section */}
        <div className="p-4 border-t border-gray-100">
          <button 
            className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
            onClick={() => {
              // TODO: Implement logout logic later
              console.log("Logout triggered");
            }}
          >
            <LogOut size={22} />
            {isSidebarOpen && <span className="ml-3">Deconectare</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-gray-700 uppercase tracking-wider">
            {menuItems.find(item => item.href === pathname)?.name || "Pagina principala"}
          </h1>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                A
             </div>
             <span className="text-sm font-medium text-gray-600">Alexandru</span>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
          {children}
        </div>
      </main>
    </div>
  );
}
