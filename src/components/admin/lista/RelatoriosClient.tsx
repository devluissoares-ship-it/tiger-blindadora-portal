"use client";

import { Cliente } from "@/types/cliente";

interface RelatoriosClientProps {
  initialClientes: Cliente[];
}

export const RelatoriosClient = ({ initialClientes }: RelatoriosClientProps) => {
  return (
    <div className="p-6 bg-[#050505] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Relatório de Projetos</h1>
        <span className="bg-[#111] px-4 py-2 rounded-lg border border-[#222]">
          Total: {initialClientes.length} clientes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#222] text-gray-400 text-sm">
              <th className="p-3">Cliente</th>
              <th className="p-3">Veículo</th>
              <th className="p-3">Status</th>
              <th className="p-3">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {initialClientes.map((c) => (
              <tr key={c.id} className="border-b border-[#222] hover:bg-[#111] transition-colors">
                <td className="p-3 font-medium">{c.nome}</td>
                <td className="p-3">{c.veiculo}</td>
                <td className="p-3">
                  <span className="bg-green-900/20 text-green-500 px-2 py-1 rounded text-xs border border-green-900/50">
                    {c.status || "Em andamento"}
                  </span>
                </td>
                <td className="p-3 w-48">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-[#222] h-2 rounded-full">
                      <div className="bg-[#ff9500] h-2 rounded-full" style={{ width: `${c.progresso || 0}%` }}></div>
                    </div>
                    <span className="text-xs font-mono">{c.progresso || 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};