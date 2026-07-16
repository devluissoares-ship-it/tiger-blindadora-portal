"use client";

import { Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const ClientActions = ({ id }: { id: string }) => {
  const router = useRouter();

  // Função centralizada para tocar os sons da pasta /public
  const playSound = (audioFile: string) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(audioFile);
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Erro ao tocar som:", e));
    }
  };

  const handleDelete = async () => {
    // Som de clique antes da confirmação
    playSound("/clickbuton.mp3");

    const confirmar = window.confirm(
      "TEM CERTEZA? Essa ação apagará o projeto permanentemente do banco de dados."
    );

    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Som de sucesso na exclusão
      playSound("/notification.mp3");

      alert("✅ Projeto removido do sistema.");
      router.refresh();
    } catch (err: any) {
      console.error("Erro ao deletar:", err);
      // Som de erro
      playSound("/notification.mp3");
      alert("❌ Erro ao excluir: " + (err.message || "Tente novamente mais tarde."));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/clientes/${id}/editar`}
        onClick={() => playSound("/clickbuton.mp3")}
        className="p-2 rounded-lg border border-transparent hover:border-[#333] hover:bg-[#1a1a1a] transition-all text-gray-400 hover:text-white"
        title="Editar Projeto"
      >
        <Edit2 size={18} />
      </Link>

      <button
        onClick={handleDelete}
        className="p-2 rounded-lg border border-transparent hover:border-red-900/40 hover:bg-red-900/20 transition-all text-red-500 hover:text-red-400"
        title="Excluir Projeto"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};