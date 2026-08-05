"use client";

import { Car, Fingerprint, Hash, CalendarDays } from 'lucide-react';
import { Cliente } from '@/types/cliente';

interface VehicleDetailsProps {
  cliente: Cliente;
}

export const VehicleDetails = ({ cliente }: VehicleDetailsProps) => {
  if (!cliente) return null;

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
          <Car size={18} className="text-orange-500" />
        </div>
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Dados Técnicos do Veículo</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-[#161616] p-3.5 rounded-xl border border-[#262626]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Modelo</p>
            <p className="font-bold text-white text-xs uppercase">{cliente.modelo || cliente.veiculo || "Não informado"}</p>
          </div>
          <div className="bg-[#161616] p-3.5 rounded-xl border border-[#262626]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Ano / Modelo</p>
            <div className="flex items-center gap-2 text-gray-300">
              <CalendarDays size={14} className="text-orange-500" />
              <span className="font-semibold text-xs">{cliente.ano_modelo || "---"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#161616] p-3.5 rounded-xl border border-[#262626]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Placa</p>
            <div className="flex items-center gap-2 text-white w-fit bg-[#222] px-2.5 py-1 rounded-lg border border-[#333] mt-1">
              <Hash size={14} className="text-orange-500" />
              <span className="font-mono font-bold text-xs tracking-wider">{cliente.placa || "---"}</span>
            </div>
          </div>
          <div className="bg-[#161616] p-3.5 rounded-xl border border-[#262626]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Chassi</p>
            <div className="flex items-center gap-2 text-gray-300 mt-1">
              <Fingerprint size={14} className="text-orange-500" />
              <span className="font-mono text-xs tracking-wider uppercase">{cliente.chassi || "---"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};