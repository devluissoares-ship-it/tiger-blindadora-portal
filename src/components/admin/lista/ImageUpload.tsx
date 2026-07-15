"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, UploadCloud } from "lucide-react";

export const ImageUpload = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    // Fazendo upload para o bucket 'clientes'
    const { data, error } = await supabase.storage
      .from('clientes') // Certifique-se que o nome do bucket é este
      .upload(fileName, file);

    if (error) {
      alert("Erro ao subir imagem: " + error.message);
    } else {
      // Pega a URL pública
      const { data: urlData } = supabase.storage.from('clientes').getPublicUrl(fileName);
      onUpload(urlData.publicUrl);
    }
    setUploading(false);
  };

  return (
    <label className="cursor-pointer flex items-center gap-2 p-4 bg-black border border-[#222] rounded-xl text-gray-400 hover:text-[#ff9500] hover:border-[#ff9500] transition">
      {uploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={20} />}
      <span>{uploading ? "Enviando..." : "Adicionar Foto do Veículo"}</span>
      <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
    </label>
  );
};