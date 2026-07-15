import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, User, Car } from "lucide-react";
import { ClientActions } from "@/components/admin/lista/ClientActions";

export const revalidate = 0;

export default async function ListaClientesPage() {
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('id, nome, veiculo, status, progresso')
    .order('created_at', { ascending: false });

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Gestão de Projetos</h1>
        <Link 
          href="/admin/clientes/novo" 
          className="bg-[#ff9500] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e68600] transition-all shadow-lg shadow-[#ff9500]/10"
        >
          <Plus size={20} /> Novo Projeto
        </Link>
      </div>

      <div className="space-y-3">
        {error && <p className="text-red-500">Erro ao carregar lista.</p>}
        
        {clientes?.map((cliente) => (
          <div 
            key={cliente.id} 
            className="group flex items-center justify-between p-5 bg-[#111111] border border-[#222] rounded-2xl hover:border-[#333] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#050505] rounded-xl border border-[#222]">
                <User size={20} className="text-[#ff9500]" />
              </div>
              <div>
                <p className="font-bold text-white">{cliente.nome}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Car size={12} /> {cliente.veiculo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-xs text-[#ff9500] font-bold uppercase">{cliente.status}</p>
                <p className="text-xs text-gray-600">{cliente.progresso}% Concluído</p>
              </div>
              <ClientActions id={cliente.id} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}