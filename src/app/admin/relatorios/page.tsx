// 1. Importações essenciais: Sem isso, o código não sabe o que é 'supabase' ou 'RelatoriosClient'
import { supabase } from "@/lib/supabase"; 
import { RelatoriosClient } from "@/components/admin/lista/RelatoriosClient";

// 2. Garante que os dados sejam sempre frescos
export const dynamic = 'force-dynamic';

export default async function RelatoriosPage() {
  // 3. Busca os dados no Supabase
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*') // Buscando tudo para evitar erro de tipo
    .order('data_criacao', { ascending: false });

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return <div className="p-8 text-red-500">Erro ao carregar relatórios.</div>;
  }
  
  // 4. Passa os dados para o componente 'RelatoriosClient'
  // O 'as any' resolve o conflito de tipo que estava acontecendo antes
  return <RelatoriosClient initialClientes={(clientes as any) || []} />;
}