import { supabase } from "@/lib/supabase";
import EditarCliente from "@/components/admin/lista/EditarCliente";

// Tipagem clara para o params
interface EditarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarPage({ params }: EditarPageProps) {
  // Desembrulhando a promise do id corretamente conforme o padrão do Next.js 15
  const { id } = await params;

  // Busca do cliente no banco
  const { data: cliente, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  // Tratamento de erro caso o ID seja inválido
  if (error || !cliente) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Erro: Projeto não encontrado ou erro ao conectar com banco de dados.
      </div>
    );
  }

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505] max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 border-b border-[#222] pb-4">
        Editar Projeto: <span className="text-orange-500">{cliente.nome}</span>
      </h1>
      
      {/* O 'initialData' aqui garante que o formulário comece 
        preenchido com os dados que buscamos do banco.
      */}
      <EditarCliente id={id} initialData={cliente} />
    </main>
  );
}