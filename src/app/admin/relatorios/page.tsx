import { supabase } from "@/lib/supabase"; 
import { RelatoriosClient } from "@/components/admin/lista/RelatoriosClient";
import { Cliente } from "@/types/cliente";

// Garante que o Next.js não guarde cache desta página (crucial para dados em tempo real)
export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  
  // Busca os dados no Supabase. 
  // Caso sua tabela tenha uma coluna de data real, você pode adicionar .order('nome_da_sua_coluna', { ascending: false })
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*');

  // Tratamento de erro robusto
  if (error) {
    console.error("Erro na busca do Supabase:", error);
    return (
      <div className="p-8 min-h-screen bg-[#050505] text-white">
        <h2 className="text-xl font-bold text-red-500">Erro ao carregar relatórios</h2>
        <p className="text-sm mt-2 text-gray-400">{error.message}</p>
        <p className="text-[10px] mt-2 text-gray-600">Verifique sua conexão ou as políticas RLS no painel do Supabase.</p>
      </div>
    );
  }
  
  // Passa os dados carregados do banco para o componente Client
  return <RelatoriosClient initialClientes={(clientes as Cliente[]) || []} />;
}