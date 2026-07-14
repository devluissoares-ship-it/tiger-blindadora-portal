"use client";

import { useDB } from "@/hooks/useDB";
import Link from "next/link";
import { Trash2, Edit2, Plus, Car, Key, User } from "lucide-react";
import { playClick, playNotification } from "@/lib/audio";

export default function ClientesPage() {
  const { data, updateCliente } = useDB(); // Adicionamos o updateCliente caso precise, mas aqui usaremos a lógica direta
  
  const handleDelete = (id: string) => {
    playClick();
    if (confirm("Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) {
      // 1. Remove da lista local
      const novaLista = data.clientes.filter((c: any) => c.id !== id);
      const newData = { ...data, clientes: novaLista };
      
      // 2. Salva no localStorage (dispara o evento storage para outras abas)
      localStorage.setItem('tiger_db', JSON.stringify(newData));
      
      // 3. Feedback visual
      playNotification();
      
      // Nota: Não precisamos mais de window.location.reload() porque o useDB 
      // detecta a mudança no localStorage e atualiza o estado automaticamente.
    }
  };

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
          <p className="text-gray-500 text-sm">Gerencie o fluxo de blindagens da Tiger</p>
        </div>
        <Link 
          href="/admin/clientes/novo" 
          onClick={playClick}
          className="bg-[#ff9500] hover:bg-[#e08400] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> Novo Cliente
        </Link>
      </div>

      <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
        {data?.clientes?.length > 0 ? (
          <ul className="divide-y divide-[#222]">
            {data.clientes.map((cliente: any) => (
              <li key={cliente.id} className="py-6 flex justify-between items-center hover:bg-[#161616] transition px-2 rounded">
                <div className="flex items-center gap-4">
                  <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#222]">
                    <Car className="text-[#ff9500]" size={24} />
                  </div>
                  <div>
                    <span className="font-bold text-lg block">{cliente.nome}</span>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex gap-2 items-center text-xs text-gray-400">
                        <span className="font-mono bg-[#222] px-1 rounded">{cliente.veiculo}</span>
                        <span>•</span>
                        <span>{cliente.placa || "Sem placa"}</span>
                      </div>
                      <div className="flex gap-3 text-[10px] mt-1">
                        <span className="flex items-center gap-1 text-[#ff9500] font-mono">
                          <User size={10} /> ID: {cliente.id}
                        </span>
                        <span className="flex items-center gap-1 text-gray-300 font-mono">
                          <Key size={10} /> SENHA: {cliente.senha || "---"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-6 items-center">
                  <div className="text-right hidden md:block">
                    <span className="text-[#ff9500] font-bold block">{cliente.progresso || 0}%</span>
                    <span className="text-[10px] uppercase text-gray-500">{cliente.status || "Entrada"}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      href={`/admin/clientes/${cliente.id}/editar`} 
                      onClick={playClick}
                      className="p-2 hover:bg-[#222] rounded-lg transition border border-transparent hover:border-[#333]"
                      title="Editar"
                    >
                      <Edit2 size={18} className="text-gray-400"/>
                    </Link>
                    <button 
                      onClick={() => handleDelete(cliente.id)}
                      className="p-2 hover:bg-red-900/20 rounded-lg transition border border-transparent hover:border-red-900/50"
                      title="Excluir"
                    >
                      <Trash2 size={18} className="text-red-500"/>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <Car size={48} className="mx-auto mb-4 opacity-20" />
            <p>Nenhum projeto de blindagem encontrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}