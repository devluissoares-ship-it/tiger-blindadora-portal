// src/app/admin/dashboard/page.tsx
import { supabase } from "@/lib/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

// Esta configuração garante que o Next.js busque os dados frescos do Supabase a cada acesso,
// evitando que o dashboard fique exibindo informações obsoletas após uma edição.
export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Ajuste do select: Trazer '*' para garantir que o AdminDashboardClient 
  // tenha todos os campos (fotos, eventos, revisões) para calcular a lógica de progresso.
  const { data: clientes, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar clientes para o Dashboard:", error);
    return (
      <div className="min-h-screen p-8 text-center text-red-500 bg-[#050505]">
        <h2 className="text-xl font-bold">Erro ao carregar o painel</h2>
        <p>Não foi possível conectar ao banco de dados.</p>
      </div>
    );
  }

  // Garantimos que nunca passaremos 'null' para o componente, apenas array vazio se necessário
  const clientesLimpos = clientes || [];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Passamos os clientes carregados diretamente para o componente cliente.
        Isso evita o "loading" desnecessário no lado do cliente.
      */}
      <AdminDashboardClient initialClientes={clientesLimpos} />
    </div>
  );
}