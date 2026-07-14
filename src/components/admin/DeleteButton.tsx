"use client";

import { Trash2 } from "lucide-react";

export const DeleteButton = ({ id }: { id: string }) => {
  const handleDelete = () => {
    alert(`Função de excluir o cliente ${id} em breve!`);
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 hover:bg-red-900/20 rounded text-gray-400 hover:text-red-500 transition"
    >
      <Trash2 size={18} />
    </button>
  );
};