"use client"; // Mantive client para lidar com estados de carregamento se precisar futuramente

import { Trash2, Edit2, Plus, User, Car, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientActions } from "@/components/admin/lista/ClientActions";

export default function ListaClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClientes() {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, veiculo, status, progresso')
        .order('nome', { ascending: true }); // Ordenado por nome para ficar organizado

      if (data) setClientes(data);
      setLoading(false);
    }
    fetchClientes();
  }, []);

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Gestão de Projetos</h1>
            <p className="text-gray-500 text-sm">Controle de blindagem e revisões</p>
        </div>
        <Link 
          href="/admin/clientes/novo" 
          className="bg-[#ff9500] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e68600] transition-all"
        >
          <Plus size={20} /> Novo Projeto
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-orange-500" size={40}/></div>
      ) : (
        <div className="space-y-3">
          {clientes.map((cliente) => (
            <div 
              key={cliente.id} 
              className="group flex items-center justify-between p-5 bg-[#111111] border border-[#222] rounded-2xl hover:border-[#333] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#050505] rounded-xl border border-[#222]">
                  <User size={20} className="text-[#ff9500]" />
                </div>
                <div>
                  <p className="font-bold text-white">{cliente.nome}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Car size={12} /> {cliente.veiculo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-[#ff9500] font-bold uppercase">{cliente.status}</p>
                  <div className="w-24 h-1.5 bg-[#222] rounded-full mt-1">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${cliente.progresso}%` }}></div>
                  </div>
                </div>
                <ClientActions id={cliente.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}