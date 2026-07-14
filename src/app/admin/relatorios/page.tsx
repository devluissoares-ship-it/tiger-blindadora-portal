import { supabase } from "@/lib/supabase";
import { RelatoriosClient } from "@/components/admin/lista/RelatoriosClient";

// Isso garante que a página busque os dados novos toda vez que você abrir
export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  const { data: clientes } = await supabase.from('clientes').select('*');
  
  return <RelatoriosClient initialClientes={clientes || []} />;
}