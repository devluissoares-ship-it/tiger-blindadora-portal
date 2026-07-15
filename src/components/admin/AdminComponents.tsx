"use client";

import { useState } from "react";
import { LayoutDashboard, Users, Car, Search, Bell, Save, Bot, Calendar, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReportGenerator } from './ReportGenerator';

// --- Sidebar: Navegação com estilo ativo ---
export const Sidebar = () => (
  <div className="w-64 bg-[#111111] border-r border-[#222] p-6 h-screen flex flex-col fixed left-0">
    <div className="mb-10 px-2">
      <Image src="/logo-tiger.png" alt="Tiger Logo" width={120} height={40} />
    </div>
    <nav className="space-y-2">
      {[
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Clientes', icon: Users, href: '/admin/clientes' },
        { name: 'Veículos', icon: Car, href: '/admin/veiculos' }
      ].map((item) => (
        <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[#1a1a1a] hover:text-[#ff9500] rounded-xl transition-all font-medium text-sm">
          <item.icon size={18}/> {item.name}
        </Link>
      ))}
    </nav>
  </div>
);

// --- Topbar: Buscador minimalista ---
export const Topbar = () => (
  <div className="flex justify-between items-center bg-[#111111] p-4 rounded-2xl border border-[#222] ml-64 mb-6">
    <div className="relative w-80">
      <Search className="absolute left-3 top-2.5 text-gray-600" size={16}/>
      <input className="bg-[#050505] w-full p-2.5 pl-10 rounded-xl border border-[#222] text-sm text-white focus:border-[#ff9500] outline-none transition" placeholder="Buscar projeto..."/>
    </div>
    <div className="flex items-center gap-4">
      <Bell className="text-gray-500 hover:text-[#ff9500] cursor-pointer" size={20} />
      <div className="w-8 h-8 rounded-full bg-[#222]"></div>
    </div>
  </div>
);

// --- Vehicle Details: Dados técnicos organizados ---
export const VehicleDetails = ({ cliente }: any) => (
  <div className="bg-[#111111] p-6 rounded-2xl border border-[#222] shadow-sm">
    <h3 className="text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-widest text-gray-400">
      <Car size={16} className="text-[#ff9500]" /> Dados do Veículo
    </h3>
    <div className="grid grid-cols-2 gap-6 text-sm">
      {[
        { label: 'Modelo', value: cliente.modelo || cliente.veiculo },
        { label: 'Nível', value: cliente.nivelBlindagem, highlight: true },
        { label: 'Ano', value: cliente.anoModelo },
        { label: 'Revisão', value: cliente.tipoRevisao }
      ].map((field) => (
        <div key={field.label}>
          <p className="text-gray-600 text-[10px] uppercase font-bold">{field.label}</p>
          <p className={`font-semibold ${field.highlight ? 'text-[#ff9500]' : 'text-gray-200'}`}>{field.value || "---"}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- Widget Status Board: visual de barra "Tiger" ---
export const StatusBoard = ({ status, progresso }: any) => (
  <div className="p-6 rounded-2xl border border-[#222] bg-[#111111]">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Progresso de Blindagem</h3>
      <span className="text-[#ff9500] font-mono text-lg font-bold">{progresso}%</span>
    </div>
    <div className="w-full bg-[#050505] h-3 rounded-full border border-[#222] overflow-hidden">
      <div className="bg-[#ff9500] h-full transition-all duration-1000" style={{ width: `${progresso}%` }}></div>
    </div>
    <p className="mt-3 text-sm font-bold text-white uppercase">{status}</p>
  </div>
);