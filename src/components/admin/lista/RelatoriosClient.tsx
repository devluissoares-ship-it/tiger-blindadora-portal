"use client";

import { useState } from 'react';
import { FileDown, Search, Filter, ShieldCheck } from 'lucide-react';
import { Cliente } from '@/types/cliente';

export const RelatoriosClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const [busca, setBusca] = useState("");

  const filtered = initialClientes.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    c.veiculo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-[#050505] text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Relatório de Projetos</h1>
          <p className="text-gray-500">Gestão e exportação de dados técnicos</p>
        </div>
        <button className="bg-[#111] border border-[#222] px-6 py-3 rounded-xl flex items-center gap-2 hover:border-[#ff9500] transition">
          <FileDown size={18} /> Exportar PDF
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input 
              className="w-full bg-[#050505] border border-[#222] p-3 pl-10 rounded-xl focus:border-[#ff9500] outline-none"
              placeholder="Buscar por cliente ou veículo..."
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase text-gray-500 tracking-widest border-b border-[#222]">
              <th className="pb-4">Cliente</th>
              <th className="pb-4">Veículo</th>
              <th className="pb-4">Progresso</th>
              <th className="pb-4">Status</th>
              <th className="pb-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-[#222] hover:bg-[#1a1a1a] transition">
                <td className="py-5 font-bold">{c.nome}</td>
                <td className="py-5 text-gray-400">{c.veiculo}</td>
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-[#050505] rounded-full overflow-hidden border border-[#222]">
                      <div className="h-full bg-[#ff9500]" style={{ width: `${c.progresso}%` }} />
                    </div>
                    <span className="text-xs font-mono">{c.progresso}%</span>
                  </div>
                </td>
                <td className="py-5">
                   <span className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#222] text-[10px] font-bold text-[#ff9500]">
                     {c.status}
                   </span>
                </td>
                <td className="py-5 text-right">
                  <button className="text-[#ff9500] hover:underline text-sm font-bold">Ver Detalhes</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};