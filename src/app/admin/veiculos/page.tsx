import { supabase } from "@/lib/supabase";
import { VeiculosClient } from "@/components/admin/lista/VeiculosClient";

// Otimizado: removemos o cache estático para que qualquer atualização no banco
// reflita instantaneamente no seu painel de veículos.
export const dynamic = 'force-dynamic';

export default async function VeiculosPage() {
  // Ajuste: incluímos 'progresso' e 'etapa_atual' no select, 
  // pois o visual que você me mandou nas fotos exibe essas barras de progresso.
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('id, nome, veiculo, status, progresso, etapa_atual')
    .order('veiculo', { ascending: true });

  if (error) {
    console.error("Erro ao buscar veículos:", error);
    return (
      <main className="p-8 text-white min-h-screen bg-[#050505]">
        <div className="text-red-500">Erro ao carregar lista de veículos.</div>
      </main>
    );
  }

  return <VeiculosClient initialClientes={clientes || []} />;
}