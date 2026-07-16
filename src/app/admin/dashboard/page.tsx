import { supabase } from "@/lib/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

// Força o comportamento dinâmico para evitar problemas de cache no servidor
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  try {
    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;

    // Garante que se o banco retornar nulo, o componente receba um array vazio
    const clientesLimpos = clientes ?? [];

    return (
      <div className="min-h-screen bg-[#050505]">
        <AdminDashboardClient initialClientes={clientesLimpos} />
      </div>
    );
  } catch (err) {
    console.error("Erro fatal no carregamento do dashboard:", err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <p>Erro ao carregar sistema. Verifique a conexão com o banco.</p>
      </div>
    );
  }
}