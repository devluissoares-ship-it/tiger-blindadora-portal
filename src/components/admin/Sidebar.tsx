"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Car, FileText, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // Garante que o link fique ativo mesmo em subpáginas (como /admin/clientes/tiger-001)
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="w-64 bg-[#111111] border-r border-[#222] p-6 flex flex-col justify-between h-screen fixed left-0 top-0 z-50">
      <div>
        <h2 className="text-[#ff9500] font-bold text-xl mb-10 tracking-wider">TIGER PAINEL</h2>
        
        <nav className="space-y-4">
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center gap-3 transition-colors ${isActive('/admin/dashboard') ? 'text-[#ff9500]' : 'text-gray-500 hover:text-white'}`}
          >
            <LayoutDashboard size={20}/> Dashboard
          </Link>

          <Link 
            href="/admin/clientes" 
            className={`flex items-center gap-3 transition-colors ${isActive('/admin/clientes') ? 'text-[#ff9500]' : 'text-gray-500 hover:text-white'}`}
          >
            <Users size={20}/> Clientes
          </Link>

          <Link 
            href="/admin/veiculos" 
            className={`flex items-center gap-3 transition-colors ${isActive('/admin/veiculos') ? 'text-[#ff9500]' : 'text-gray-500 hover:text-white'}`}
          >
            <Car size={20}/> Veículos
          </Link>

          <Link 
            href="/admin/relatorios" 
            className={`flex items-center gap-3 transition-colors ${isActive('/admin/relatorios') ? 'text-[#ff9500]' : 'text-gray-500 hover:text-white'}`}
          >
            <FileText size={20}/> Relatórios
          </Link>
        </nav>
      </div>

      <button 
        onClick={() => window.location.href = '/login'} 
        className="flex items-center gap-3 text-red-500 hover:text-red-400 transition-colors font-medium"
      >
        <LogOut size={20}/> Sair
      </button>
    </div>
  );
}