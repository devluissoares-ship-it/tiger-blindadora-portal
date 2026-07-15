"use client";

import { Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const ClientActions = ({ id }: { id: string }) => {
  const router = useRouter();

  // Função para disparar sons modernos e leves
  const playSound = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play().catch(() => console.warn("Erro ao reproduzir som"));
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    // Som de clique ao iniciar ação
    playSound('/clickbuton.mp3');

    const { error } = await supabase.from('clientes').delete().eq('id', id);

    if (error) {
      // Som de erro
      playSound('/notification.mp3');
      alert("Erro ao excluir: " + error.message);
    } else {
      // Som de sucesso
      playSound('/click.mp3');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Link 
        href={`/admin/clientes/${id}/editar`} 
        onClick={() => playSound('/clickbuton.mp3')}
        className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all border border-transparent hover:border-[#333]"
        title="Editar Projeto"
      >
        <Edit2 size={16}/>
      </Link>
      
      <button 
        onClick={handleDelete}
        className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-900/10 rounded-lg transition-all border border-transparent hover:border-red-900/30"
        title="Excluir Projeto"
      >
        <Trash2 size={16}/>
      </button>
    </div>
  );
};