import { supabase } from "@/lib/supabase";
import EditarCliente from "@/components/admin/EditarCliente";

// Força a busca de dados sempre em tempo real
export const revalidate = 0;

export default async function EditarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Busca do cliente no Supabase
  const { data: cliente, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  // Tratamento de erro caso o cliente não exista ou ocorra erro de conexão
  if (error || !cliente) {
    return (
      <main className="p-8 text-white min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Projeto não encontrado</h2>
        <p className="text-gray-400">Não foi possível carregar os dados para o ID: {id}</p>
        <a href="/admin/clientes" className="mt-6 text-[#ff9500] hover:underline underline-offset-4">
          Voltar para lista de clientes
        </a>
      </main>
    );
  }

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505] max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Editar Projeto: <span className="text-[#ff9500]">{cliente.nome}</span>
        </h1>
        <p className="text-[#666] text-sm uppercase tracking-widest mt-1">
          ID: {cliente.id}
        </p>
      </div>
      
      {/* Passamos o 'params' e o 'initialData'. 
        O EditarCliente.tsx agora está preparado para receber esses dados.
      */}
      <EditarCliente params={{ id }} initialData={cliente} />
    </main>
  );
}