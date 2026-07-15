"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Car, FileText, LogOut, Shield } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Clientes', icon: Users, href: '/admin/clientes' },
    { name: 'Veículos', icon: Car, href: '/admin/veiculos' },
    { name: 'Relatórios', icon: FileText, href: '/admin/relatorios' },
  ];

  return (
    <div className="w-64 bg-[#111111] border-r border-[#222] p-6 flex flex-col justify-between h-screen fixed left-0 top-0 z-50">
      <div>
        {/* Logo/Brand */}
        <div className="flex items-center gap-2 mb-12 px-2">
          <Shield className="text-[#ff9500]" size={24} />
          <h2 className="text-white font-bold text-lg tracking-[0.2em] uppercase">Tiger Admin</h2>
        </div>
        
        {/* Navegação */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                isActive(item.href) 
                  ? 'bg-[#1a1a1a] text-[#ff9500] border border-[#222]' 
                  : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]/50'
              }`}
            >
              <item.icon size={18}/> {item.name}
              {isActive(item.href) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff9500] shadow-[0_0_10px_rgba(255,149,0,0.8)]"></div>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button 
        onClick={() => window.location.href = '/login'} 
        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-950/20 hover:text-red-400 rounded-xl transition-all text-sm font-medium"
      >
        <LogOut size={18}/> Sair do Sistema
      </button>
    </div>
  );
}