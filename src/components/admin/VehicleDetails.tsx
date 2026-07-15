"use client";

import { Car, Fingerprint, Hash, CalendarDays } from 'lucide-react';
import { Cliente } from '@/types/cliente';

// Agora usamos a interface Cliente global, que aceita valores nulos do banco
interface VehicleDetailsProps {
  cliente: Cliente;
}

export const VehicleDetails = ({ cliente }: VehicleDetailsProps) => {
  if (!cliente) return null;

  return (
    <div className="bg-[#111111] p-8 rounded-2xl border border-[#222] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#ff9500]/10 rounded-lg">
          <Car size={20} className="text-[#ff9500]" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">Dados Técnicos do Veículo</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Modelo</p>
            {/* Usamos o campo 'modelo' e fallback para 'veiculo' se necessário */}
            <p className="font-bold text-white text-sm">{cliente.modelo || cliente.veiculo || "Não informado"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Ano / Modelo</p>
            <div className="flex items-center gap-2 text-gray-300">
              <CalendarDays size={14} className="text-gray-600" />
              {/* Ajustado para 'ano_modelo' conforme a estrutura do Supabase */}
              <span className="font-medium text-sm">{cliente.ano_modelo || "---"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Placa</p>
            <div className="flex items-center gap-2 text-white bg-[#050505] w-fit px-3 py-1 rounded-md border border-[#222]">
              <Hash size={14} className="text-[#ff9500]" />
              <span className="font-mono font-bold">{cliente.placa || "---"}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Chassi</p>
            <div className="flex items-center gap-2 text-gray-400">
              <Fingerprint size={14} className="text-gray-600" />
              <span className="font-mono text-xs tracking-wider">{cliente.chassi || "---"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};