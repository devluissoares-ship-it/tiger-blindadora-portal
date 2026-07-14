"use client";

import { useDB } from "@/hooks/useDB"; // Hook que gerencia o estado
import Link from "next/link";
import { playClick } from "@/lib/audio";

export default function VeiculosPage() {
  const { data } = useDB();
  const clientes = data?.clientes || []; // Se estiver vazio, retorna array [] para evitar erro

  return (
    <main className="p-8 bg-[#050505] min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#ff9500]">Frota em Processo</h1>
      
      <div className="grid gap-4">
        {clientes.length > 0 ? (
          clientes.map((cliente) => (
            <div 
              key={cliente.id} 
              className="bg-[#111111] p-6 rounded-xl border border-[#222] flex justify-between items-center hover:border-[#ff9500]/50 transition-colors"
            >
              <div>
                <h2 className="text-lg font-bold">{cliente.veiculo}</h2>
                <p className="text-sm text-gray-400">Cliente: {cliente.nome} • Status: {cliente.status}</p>
              </div>
              <Link 
                href={`/admin/clientes/${cliente.id}/editar`} 
                onClick={playClick}
                className="bg-[#222] hover:bg-[#ff9500] hover:text-black px-4 py-2 rounded-lg font-bold transition-all"
              >
                Ver Detalhes
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhum veículo encontrado.</p>
        )}
      </div>
    </main>
  );
}