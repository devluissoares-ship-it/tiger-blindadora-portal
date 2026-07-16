"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface ProcessStepsProps {
  etapaAtual: number;
  onSelect: (etapa: number) => void;
}

export const ProcessSteps = ({ etapaAtual, onSelect }: ProcessStepsProps) => {
  // Lista de etapas de produção sem o Pós-Venda
  const etapas = [
    "Entrada", "Desmontagem", "Estrutura", "Portas", 
    "Vidros", "Acabamento", "Testes", "Finalização", "Entrega"
  ];
  
  return (
    <div className="bg-[#111] p-5 rounded-2xl border border-[#222] my-4 shadow-sm w-full">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6 text-center">Linha de Produção</h3>
      
      <div className="flex flex-wrap justify-between items-start gap-y-6">
        {etapas.map((etapa, index) => {
          const numeroEtapa = index + 1;
          const isConcluido = numeroEtapa < etapaAtual;
          const isAtual = numeroEtapa === etapaAtual;
          
          return (
            <button 
              key={index} 
              onClick={() => onSelect(numeroEtapa)} 
              className="flex flex-col items-center gap-2 group flex-1 min-w-[70px]"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isConcluido 
                  ? 'bg-green-500/10 border-green-500 text-green-500' 
                  : isAtual 
                    ? 'bg-[#ff9500] border-[#ff9500] text-black font-black shadow-[0_0_15px_rgba(255,149,0,0.4)] scale-110' 
                    : 'bg-[#050505] border-[#222] text-gray-700' 
              }`}>
                {isConcluido ? <Check size={16} strokeWidth={3} /> : <span className="text-xs">{numeroEtapa}</span>}
              </div>
              
              <span className={`text-[8px] uppercase font-bold text-center leading-tight transition-colors px-1 ${
                isAtual ? 'text-[#ff9500]' : isConcluido ? 'text-green-500' : 'text-gray-600'
              }`}>
                {etapa}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};