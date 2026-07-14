"use client";
import { useState } from "react";
import { LayoutDashboard, Users, Car, Search, Bell, Save, Bot, ShieldCheck, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ReportGenerator } from './ReportGenerator';

// --- Sidebar ---
export const Sidebar = () => (
  <div className="w-64 bg-[#111111] border-r border-[#222] p-6 h-screen flex flex-col">
    <div className="mb-10">
      <Image src="/logo-tiger.png" alt="Tiger Logo" width={120} height={40} />
    </div>
    <nav className="space-y-4">
      <a href="/admin/dashboard" className="flex items-center gap-3 text-[#ff9500]"><LayoutDashboard size={20}/> Dashboard</a>
      <a href="/admin/clientes" className="flex items-center gap-3 text-gray-500 hover:text-[#ff9500]"><Users size={20}/> Clientes</a>
      <a href="/admin/veiculos" className="flex items-center gap-3 text-gray-500 hover:text-[#ff9500]"><Car size={20}/> Veículos</a>
    </nav>
  </div>
);

// --- Topbar ---
export const Topbar = () => (
  <div className="flex justify-between items-center bg-[#111111] p-4 rounded-lg border border-[#222]">
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 text-gray-500" size={18}/>
      <input className="bg-[#050505] w-full p-2 pl-9 rounded border border-[#222] text-sm" placeholder="Buscar projeto..."/>
    </div>
    <Bell className="text-gray-400" />
  </div>
);

// --- Vehicle Details (INTEGRADO COM NÍVEL E REVISÃO) ---
export const VehicleDetails = ({ cliente }: any) => (
  <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
    <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
      <Car size={18} className="text-[#ff9500]" /> Dados do Veículo
    </h3>
    
    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider">Modelo</p>
        <p className="font-semibold text-gray-200">{cliente.modelo || cliente.veiculo || "---"}</p>
      </div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider">Ano/Modelo</p>
        <p className="font-semibold text-gray-200">{cliente.anoModelo || "---"}</p>
      </div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider">Nível Blindagem</p>
        <p className="font-semibold text-[#ff9500]">{cliente.nivelBlindagem || "Não definido"}</p>
      </div>
      <div>
        <p className="text-gray-500 text-[10px] uppercase tracking-wider">Próx. Revisão</p>
        <p className="font-semibold text-gray-200">{cliente.tipoRevisao || "Agendar"}</p>
      </div>
    </div>

    <div className="pt-4 border-t border-[#222]">
      <p className="text-gray-500 text-[10px] uppercase mb-1">Data da Revisão</p>
      <div className="flex items-center gap-2 text-sm font-mono text-gray-300">
        <Calendar size={14} className="text-blue-500" />
        {cliente.dataRevisao ? new Date(cliente.dataRevisao).toLocaleDateString() : "Não definida"} 
        {cliente.horaRevisao && ` às ${cliente.horaRevisao}`}
      </div>
    </div>
  </div>
);

// --- Project Details ---
export const ProjectDetails = ({ cliente, onSave }: any) => (
  <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
    <h3 className="text-lg font-bold mb-4">Projeto: {cliente?.nome}</h3>
    <button 
      onClick={() => onSave({ updatedAt: new Date().toISOString() })} 
      className="bg-[#ff9500] text-black px-4 py-2 rounded font-bold flex items-center gap-2 transition hover:bg-[#e08400]"
    >
      <Save size={16}/> Salvar Alterações
    </button>
  </div>
);

// --- Status Board ---
export const StatusBoard = ({ status, progresso }: any) => (
  <div className="p-6 rounded-xl border border-[#222] bg-[#111111]">
    <div className="flex justify-between mb-2">
      <h3 className="text-lg font-bold">Status: {status}</h3>
      <span className="text-[#ff9500] font-bold">{progresso}%</span>
    </div>
    <div className="w-full bg-[#222] h-4 rounded-full overflow-hidden">
      <div className="bg-[#ff9500] h-full" style={{ width: `${progresso}%` }}></div>
    </div>
  </div>
);

// --- Gallery & Assistant ---
export const ImageGallery = ({ fotos }: any) => (
  <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
    <h3 className="text-lg font-bold mb-4">Galeria ({fotos?.length || 0})</h3>
  </div>
);

export const QuickActions = ({ cliente }: any) => (
  <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
    <h3 className="font-bold mb-4">Ações Rápidas</h3>
    <ReportGenerator cliente={cliente} />
  </div>
);

export const AIAssistantWidget = ({ onGenerate }: any) => {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <h3 className="font-bold mb-2 flex items-center gap-2"><Bot className="text-[#ff9500]"/> Assistente IA</h3>
      <textarea 
        className="w-full bg-[#050505] p-2 rounded border border-[#222] text-sm" 
        rows={3} 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button onClick={() => onGenerate(prompt)} className="mt-2 w-full bg-[#ff9500] text-black font-bold p-2 rounded text-sm">
        Melhorar com IA
      </button>
    </div>
  );
};