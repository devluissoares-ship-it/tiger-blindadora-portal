import { supabase } from "@/lib/supabase";
// O caminho correto agora inclui a subpasta 'lista'
import { VeiculosClient } from "@/components/admin/lista/VeiculosClient";

export default async function VeiculosPage() {
  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, nome, veiculo, status');

  return <VeiculosClient initialClientes={clientes || []} />;
}