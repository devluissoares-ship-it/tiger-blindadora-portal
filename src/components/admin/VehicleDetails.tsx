"use client";

import { Car } from 'lucide-react';

interface VehicleDetailsProps {
  cliente: {
    id: string;
    modelo?: string;
    anoModelo?: string;
    placa?: string;
    chassi?: string;
    veiculo?: string;
  };
}

export const VehicleDetails = ({ cliente }: VehicleDetailsProps) => {
  if (!cliente) return null;

  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Car size={18} className="text-[#ff9500]" /> Dados do Veículo
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Modelo</p>
          <p className="font-semibold text-gray-200">
            {cliente.modelo || cliente.veiculo || "Não informado"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Ano/Modelo</p>
          <p className="font-semibold text-gray-200">{cliente.anoModelo || "---"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Placa</p>
          <p className="font-semibold text-gray-200">{cliente.placa || "---"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider">Chassi</p>
          <p className="font-mono text-[11px] mt-1 text-gray-200">
            {cliente.chassi || "---"}
          </p>
        </div>
      </div>
    </div>
  );
};