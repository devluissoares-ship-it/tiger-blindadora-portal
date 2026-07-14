import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ClientActions } from "@/components/admin/lista/ClientActions"; 

export default async function ListaClientesPage() {
  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, nome, veiculo') // Busque apenas o necessário para a lista
    .order('created_at', { ascending: false });

  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Lista de Clientes</h1>
      {clientes?.map((cliente) => (
        <div key={cliente.id} className="p-4 bg-[#111111] border border-[#222] rounded flex justify-between">
          <p>{cliente.nome}</p>
          <ClientActions id={cliente.id} />
        </div>
      ))}
    </main>
  );
}