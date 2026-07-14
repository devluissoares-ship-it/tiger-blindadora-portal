import Sidebar from "@/components/admin/Sidebar"; // Ajuste o caminho se necessário

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />
      
      {/* Conteúdo à direita da Sidebar */}
      {/* O pl-64 garante que o conteúdo não fique escondido atrás da sidebar de 64 (256px) */}
      <main className="flex-1 pl-64 bg-[#0a0a0a]">
        {children}
      </main>
    </div>
  );
}