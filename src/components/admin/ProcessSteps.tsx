"use client";

import React from 'react';

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
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222] my-6 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-white">Etapas do Processo</h3>
      
      <div className="flex justify-between relative px-2">
        {/* Linha de conexão entre os círculos - ajustada para ficar centralizada */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-[#222] -z-0"></div>
        
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
                  ? 'bg-green-600 border-green-500 text-white' 
                  : isAtual 
                    ? 'bg-[#ff9500] border-orange-400 text-black font-bold' 
                    : 'bg-[#222] border-[#333] text-gray-500'
                }`}>
                {isConcluido ? '✓' : numeroEtapa}
              </div>
              <span className={`text-[10px] mt-2 font-medium transition-colors whitespace-nowrap ${
                isAtual ? 'text-[#ff9500]' : 'text-gray-400 group-hover:text-white'
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