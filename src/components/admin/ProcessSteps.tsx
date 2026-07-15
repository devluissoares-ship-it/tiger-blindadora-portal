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
    "Vidros", "Acabamento", "Testes", "Finalização", "Entrega", "Pós-Venda"
  ];
  
  return (
    <div className="bg-[#111111] p-8 rounded-2xl border border-[#222] my-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Linha de Produção</h3>
      
      <div className="flex justify-between relative px-2">
        {/* Linha de fundo (conectora) */}
        <div className="absolute top-4 left-0 w-full h-[1px] bg-[#222] z-0"></div>
        
        {etapas.map((etapa, index) => {
          const numeroEtapa = index + 1;
          const isConcluido = numeroEtapa < etapaAtual;
          const isAtual = numeroEtapa === etapaAtual;
          
          return (
            <button 
              key={index} 
              type="button"
              onClick={() => onSelect(numeroEtapa)}
              className="flex flex-col items-center relative z-10 group cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110
                ${isConcluido 
                  ? 'bg-green-500/10 border-green-500 text-green-500' 
                  : isAtual 
                    ? 'bg-[#ff9500] border-[#ff9500] text-black font-bold shadow-[0_0_15px_rgba(255,149,0,0.5)]' 
                    : 'bg-[#050505] border-[#222] text-gray-600'
                }`}>
                {isConcluido ? <Check size={14} strokeWidth={3} /> : numeroEtapa}
              </div>
              <span className={`text-[10px] mt-3 font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                isAtual ? 'text-[#ff9500]' : 'text-gray-500 group-hover:text-gray-300'
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