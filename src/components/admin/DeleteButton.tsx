"use client";

import { Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const DeleteButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleDelete = async () => {
    // Confirmação nativa para evitar cliques acidentais
    if (!confirm("Tem certeza que deseja excluir este projeto? Esta ação é irreversível.")) {
      return;
    }

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Erro ao excluir cliente: " + error.message);
    } else {
      // Atualiza a página instantaneamente após a exclusão
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-900/50"
      title="Excluir Projeto"
    >
      <Trash2 size={18} />
    </button>
  );
};