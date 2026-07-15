"use client";

import { Cliente } from "@/types/cliente";
import { Car, User, Settings, CheckCircle2 } from "lucide-react";

interface VeiculosClientProps {
  initialClientes: Partial<Cliente>[];
}

export const VeiculosClient = ({ initialClientes }: VeiculosClientProps) => {
  return (
    <div className="p-8 bg-[#050505] min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Frota em Blindagem</h1>
        <p className="text-gray-500 text-sm mt-1">Gerenciamento técnico dos veículos na linha de produção.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialClientes.map((c) => (
          <div 
            key={c.id} 
            className="bg-[#111111] p-6 rounded-2xl border border-[#222] hover:border-[#333] transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#050505] p-3 rounded-xl border border-[#222]">
                <Car size={20} className="text-[#ff9500]" />
              </div>
              <span className="text-[10px] uppercase tracking-widest bg-[#1a1a1a] px-3 py-1 rounded-full text-gray-400">
                {c.status || "Pendente"}
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-white group-hover:text-[#ff9500] transition-colors">
                {c.veiculo || "Veículo não identificado"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User size={14} />
                <span>{c.nome || "Cliente sem nome"}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between">
              <div className="text-[10px] text-gray-600 uppercase font-bold">Progresso</div>
              <div className="text-[#ff9500] font-mono font-bold">{c.progresso}%</div>
            </div>
          </div>
        ))}
      </div>

      {initialClientes.length === 0 && (
        <div className="text-center py-20 text-gray-600 border border-dashed border-[#222] rounded-2xl">
          Nenhum veículo em processamento no momento.
        </div>
      )}
    </div>
  );
};