"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface ProcessStepsProps {
  etapaAtual: number;
  onSelect: (etapa: number) => void;
}

export const ProcessSteps = ({ etapaAtual, onSelect }: ProcessStepsProps) => {
  const etapas = [
    "Entrada", "Desmontagem", "Estrutura", "Portas", 
    "Vidros", "Acabamento", "Testes", "Finalização", "Entrega"
  ];
  
  return (
    <div className="w-full">
      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4 text-center">Linha de Produção - Status do Veículo</p>
      
      {/* Container flex sem wrap, garantindo que tudo fique lado a lado perfeitamente */}
      <div className="flex items-center justify-between w-full overflow-x-auto py-2">
        {etapas.map((etapa, index) => {
          const numeroEtapa = index + 1;
          const isConcluido = numeroEtapa < etapaAtual;
          const isAtual = numeroEtapa === etapaAtual;
          
          return (
            <button 
              key={index} 
              onClick={() => onSelect(numeroEtapa)} 
              className="flex flex-col items-center gap-1.5 group flex-1 min-w-[55px] cursor-pointer focus:outline-none"
            >
              <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md ${
                isAtual 
                  ? 'bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.6)] scale-110 font-black border-2 border-white' 
                  : isConcluido 
                  ? 'bg-neutral-800 text-orange-400 border border-orange-500/50' 
                  : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
              }`}>
                {isConcluido ? <Check size={14} strokeWidth={3} className="text-green-400" /> : <span className="text-xs">{numeroEtapa}</span>}
              </div>
              
              <span className={`text-[8px] uppercase font-bold text-center leading-tight transition-colors px-0.5 truncate max-w-[65px] ${
                isAtual ? 'text-orange-400 font-extrabold' : isConcluido ? 'text-neutral-300' : 'text-neutral-600'
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