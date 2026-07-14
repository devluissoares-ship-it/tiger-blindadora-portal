// src/app/admin/dashboard/page.tsx
import { supabase } from "@/lib/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const { data: clientes, error } = await supabase.from('clientes').select('*');

  if (error) {
    console.error("Erro ao buscar clientes:", error);
    return <div>Erro ao carregar o painel.</div>;
  }

  // A MÁGICA: Converte para JSON puro, removendo objetos complexos/funções do Supabase
  const clientesLimpos = JSON.parse(JSON.stringify(clientes || []));

  return <AdminDashboardClient initialClientes={clientesLimpos} />;
}