import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, User, Car, MoreVertical } from "lucide-react";
import { ClientActions } from "@/components/admin/lista/ClientActions";

// Adicionando revalidação para garantir que a tabela reflita o banco em tempo real
export const revalidate = 0;

export default async function ClientesPage() {
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nome, veiculo, status, progresso")
    .order("nome", { ascending: true }); // Ordena alfabeticamente para ficar organizado

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Gestão de Projetos</h1>
        <Link 
          href="/admin/clientes/novo" 
          className="bg-[#ff9500] text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#e68600] transition-all shadow-lg shadow-[#ff9500]/10"
        >
          <Plus size={20} /> Novo Projeto
        </Link>
      </div>

      <div className="bg-[#111111] rounded-xl border border-[#222] shadow-2xl overflow-hidden">
        {error && (
          <div className="p-6 text-red-500 bg-red-500/10 border-b border-red-500/20">
            Erro ao carregar: {error.message}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#161616] text-[#666] text-xs uppercase tracking-widest">
              <tr>
                <th className="p-5">Cliente</th>
                <th className="p-5">Veículo</th>
                <th className="p-5">Status / Progresso</th>
                <th className="p-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {clientes?.map((c) => (
                <tr key={c.id} className="hover:bg-[#161616]/50 transition-colors group">
                  <td className="p-5 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center border border-[#222]">
                      <User size={14} className="text-[#ff9500]"/>
                    </div>
                    {c.nome}
                  </td>
                  <td className="p-5 text-gray-400">
                    <div className="flex items-center gap-2"><Car size={16} className="text-[#333]"/> {c.veiculo}</div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#050505] border border-[#222] px-3 py-1 rounded-full text-xs text-[#ff9500] font-mono">
                        {c.status}
                      </span>
                      <div className="text-xs text-gray-500 font-bold">{c.progresso}%</div>
                    </div>
                  </td>
                  <td className="p-5 flex justify-center">
                    <ClientActions id={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!clientes?.length && !error && (
          <div className="p-12 text-center text-gray-600">
            Nenhum projeto cadastrado ainda.
          </div>
        )}
      </div>
    </main>
  );
}