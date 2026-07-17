"use client";

import { useState } from 'react';
import { FileDown, Search, ArrowRight } from 'lucide-react';
import { Cliente } from '@/types/cliente';
import Link from 'next/link';

const CircularProgress = ({ progress }: { progress: number }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="24" cy="24" r={radius} stroke="#222" strokeWidth="4" fill="transparent" />
        <circle cx="24" cy="24" r={radius} stroke="#ff9500" strokeWidth="4" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
      </svg>
      <span className="absolute text-[9px] font-bold">{progress}%</span>
    </div>
  );
};

export const RelatoriosClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);

  const filtered = initialClientes.filter(c => 
    (c.nome?.toLowerCase() || "").includes(busca.toLowerCase()) || 
    (c.veiculo?.toLowerCase() || "").includes(busca.toLowerCase())
  );

  const handleDownload = async () => {
    if (filtered.length === 0) {
      alert("Nenhum projeto encontrado para exportar.");
      return;
    }
    
    setCarregando(true);
    try {
      // Importação dinâmica para evitar erros de SSR e dependências
      const { exportarRelatorioPDF } = await import('@/utils/pdfGenerator');
      await exportarRelatorioPDF(filtered);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      alert("Erro ao gerar o PDF. Verifique o console.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#050505] text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Relatório de Projetos</h1>
          <p className="text-gray-500">Gestão e exportação de dados técnicos</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={carregando}
          className="bg-[#111] border border-[#222] px-6 py-3 rounded-xl flex items-center gap-2 hover:border-[#ff9500] transition active:scale-95 disabled:opacity-50"
        >
          {carregando ? (
            "Gerando..."
          ) : (
            <><FileDown size={18} /> Exportar PDF</>
          )}
        </button>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
          <input 
            className="w-full bg-[#050505] border border-[#222] p-3 pl-10 rounded-xl focus:border-[#ff9500] outline-none"
            placeholder="Buscar por cliente ou veículo..."
            onChange={(e) => setBusca(e.target.value)}
          />
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
                  <CircularProgress progress={c.progresso || 0} />
                </td>
                <td className="py-5">
                   <span className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-[#222] text-[10px] font-bold text-[#ff9500]">
                     {c.status}
                   </span>
                </td>
                <td className="py-5 text-right">
                  <Link href={`/admin/dashboard?id=${c.id}`} className="flex items-center justify-end gap-2 text-[#ff9500] hover:underline text-sm font-bold">
                    Ver Detalhes <ArrowRight size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};