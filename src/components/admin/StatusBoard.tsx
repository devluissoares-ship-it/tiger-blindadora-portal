"use client";

import { CalendarDays, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StatusBoardProps {
  status: string;
  progresso: number;
  revisao?: string;
}

export const StatusBoard = ({ status, progresso, revisao }: StatusBoardProps) => {
  return (
    <div className="bg-[#111111] p-8 rounded-2xl border border-[#222] space-y-8 shadow-sm">
      {/* Header com Status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Status do Projeto</h2>
          <p className="text-xl font-bold mt-1">{status}</p>
        </div>
        <div className="bg-[#ff9500]/10 text-[#ff9500] px-4 py-1.5 rounded-full border border-[#ff9500]/20 text-xs font-bold uppercase tracking-wider">
          Em Execução
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
          <span>Progresso Geral</span>
          <span className="text-white">{progresso}%</span>
        </div>
        <div className="w-full bg-[#050505] h-3 rounded-full overflow-hidden border border-[#222]">
          <div 
            className="bg-[#ff9500] h-full transition-all duration-1000 ease-out" 
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Alerta de Revisão (Estilo Tiger) */}
      {revisao && (
        <div className="bg-[#050505] p-5 rounded-xl border border-[#222] flex items-center gap-4">
          <div className="bg-[#1a0505] p-2 rounded-lg border border-red-900/30">
            <ShieldAlert className="text-red-500" size={20} />
          </div>
          <div>
            <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest">Próxima Revisão</p>
            <p className="text-sm font-medium text-white">{new Date(revisao).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      )}

      {/* Indicadores de Etapa */}
      <div className="flex gap-6 pt-4 border-t border-[#222]">
        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase ${progresso >= 30 ? 'text-green-500' : 'text-gray-600'}`}>
          <CheckCircle2 size={14} /> Blindagem
        </div>
        <div className={`flex items-center gap-2 text-[11px] font-bold uppercase ${progresso >= 70 ? 'text-green-500' : 'text-gray-600'}`}>
          {progresso >= 70 ? <CheckCircle2 size={14}/> : <Loader2 size={14} className="animate-spin" />} Documentação
        </div>
      </div>
    </div>
  );
};