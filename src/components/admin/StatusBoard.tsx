"use client";

import { CalendarDays, Loader2, CheckCircle2 } from 'lucide-react';

interface StatusBoardProps {
  status: string;
  progresso: number;
  revisao?: string; // Adicionado: Agora a prop é reconhecida oficialmente
}

export const StatusBoard = ({ status, progresso, revisao }: StatusBoardProps) => {
  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222] space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Status do Projeto</h2>
        <span className="text-xs bg-[#222] text-[#ff9500] px-3 py-1 rounded-full border border-[#333]">
          {status}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Progresso Geral</span>
          <span>{progresso}%</span>
        </div>
        <div className="w-full bg-[#050505] h-3 rounded-full overflow-hidden border border-[#222]">
          <div 
            className="bg-[#ff9500] h-full transition-all duration-700" 
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {revisao && (
        <div className="bg-[#1a0505] p-4 rounded-lg border border-red-900/30 flex items-center gap-3">
          <CalendarDays className="text-red-500" size={24} />
          <div>
            <p className="text-xs text-red-400 uppercase font-bold">Próxima Revisão</p>
            <p className="text-sm font-semibold">{new Date(revisao).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <div className={`flex items-center gap-2 text-xs ${progresso >= 30 ? 'text-green-500' : 'text-gray-600'}`}>
          <CheckCircle2 size={16} /> Blindagem
        </div>
        <div className={`flex items-center gap-2 text-xs ${progresso >= 70 ? 'text-green-500' : 'text-gray-600'}`}>
          <Loader2 size={16} className={progresso >= 70 ? "" : "animate-spin"} /> Documentação
        </div>
      </div>
    </div>
  );
};