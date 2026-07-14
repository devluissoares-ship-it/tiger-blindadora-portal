"use client";

import { Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface ClientActionsProps {
  id: string;
}

export const ClientActions = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) {
      // Deleta direto no Supabase
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir: " + error.message);
      } else {
        // router.refresh() é suficiente para Server Components
        router.refresh();
      }
    }
  };

  return (
    <div className="flex gap-2">
      {/* CORRIGIDO: O caminho agora aponta para a pasta correta /admin/clientes/... */}
      <Link 
        href={`/admin/clientes/${id}/editar`} 
        className="p-2 hover:bg-[#222] rounded-lg transition border border-transparent hover:border-[#333]"
        title="Editar"
      >
        <Edit2 size={18} className="text-gray-400"/>
      </Link>
      
      <button 
        onClick={handleDelete}
        className="p-2 hover:bg-red-900/20 rounded-lg transition border border-transparent hover:border-red-900/50"
        title="Excluir"
      >
        <Trash2 size={18} className="text-red-500"/>
      </button>
    </div>
  );
};