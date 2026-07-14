import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Plus, Car, Edit2 } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton"; // Importe aqui

export default async function ClientesPage() {
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nome, veiculo, status, progresso");

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      {/* ... (cabeçalho igual ao que estava) ... */}
      
      <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
        {/* ... (verificação de erro igual ao que estava) ... */}
        <ul className="divide-y divide-[#222]">
          {clientes?.map((cliente: any) => (
            <li key={cliente.id} className="py-6 flex justify-between items-center hover:bg-[#161616] transition px-2 rounded">
              {/* ... (lado esquerdo igual ao que estava) ... */}
              
              <div className="flex items-center gap-6">
                {/* ... (lado direito: status e progresso) ... */}
                
                <div className="flex gap-2">
                  <Link href={`/admin/clientes/editar/${cliente.id}`} className="p-2 hover:bg-[#222] rounded text-gray-400 hover:text-white transition">
                    <Edit2 size={18} />
                  </Link>
                  
                  {/* AQUI ESTÁ A MÁGICA: Chamamos o componente que criamos */}
                  <DeleteButton id={cliente.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}