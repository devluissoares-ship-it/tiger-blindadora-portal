"use client";

// Vamos criar um tipo específico para essa lista, ou usar o Partial<Cliente>
import { Cliente } from "@/types/cliente";

interface VeiculosClientProps {
  // Partial diz: "aceite o objeto Cliente, mas com apenas alguns campos presentes"
  initialClientes: Partial<Cliente>[];
}

export const VeiculosClient = ({ initialClientes }: VeiculosClientProps) => {
  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Gestão de Veículos</h1>
      <div className="grid gap-4">
         {initialClientes.map((c) => (
            <div key={c.id} className="p-4 bg-[#111] rounded border border-[#222]">
                <p className="font-bold">{c.nome}</p>
                <p className="text-sm text-gray-400">{c.veiculo} - {c.status}</p>
            </div>
         ))}
      </div>
    </div>
  );
};