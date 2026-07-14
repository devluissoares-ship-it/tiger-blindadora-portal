"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Conexão direta
import { Loader2 } from "lucide-react";
import { Cliente } from "@/types/cliente";

interface EditarClienteProps {
  params: { id: string };
  initialData: Cliente; // Dados que vêm do Server Component pai
}

export default function EditarCliente({ params, initialData }: EditarClienteProps) {
  const [formData, setFormData] = useState<Cliente>(initialData);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Salvamento direto no Supabase
      const { error } = await supabase
        .from("clientes")
        .update({
          nome: formData.nome,
          veiculo: formData.veiculo,
          status: formData.status,
          senha: formData.senha,
          progresso: formData.progresso,
        })
        .eq("id", params.id);

      if (error) throw error;

      alert("Projeto atualizado com sucesso!");
      router.push("/admin/clientes");
      router.refresh();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <h1 className="text-2xl font-bold mb-6 text-[#ff9500]">Editar Projeto: {formData.nome}</h1>
      
      <form onSubmit={handleSubmit} className="bg-[#111111] p-6 rounded-xl border border-[#222] max-w-2xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOME */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Nome do Cliente</label>
            <input 
              className="w-full p-3 bg-black border border-[#222] rounded text-white mt-1 outline-none focus:border-[#ff9500]" 
              value={formData.nome || ""} 
              onChange={(e) => setFormData({...formData, nome: e.target.value})} 
            />
          </div>

          {/* VEÍCULO */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Veículo</label>
            <input 
              className="w-full p-3 bg-black border border-[#222] rounded text-white mt-1 outline-none focus:border-[#ff9500]" 
              value={formData.veiculo || ""} 
              onChange={(e) => setFormData({...formData, veiculo: e.target.value})} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* STATUS */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Status</label>
            <select 
              className="w-full p-3 bg-black border border-[#222] rounded text-white mt-1 outline-none focus:border-[#ff9500]"
              value={formData.status || "Entrada"}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Entrada">Entrada</option>
              <option value="Desmontagem">Desmontagem</option>
              <option value="Blindagem">Blindagem</option>
              <option value="Montagem">Montagem</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          {/* PROGRESSO */}
          <div>
            <label className="text-xs text-gray-500 uppercase">Progresso (%)</label>
            <input 
              type="number"
              className="w-full p-3 bg-black border border-[#222] rounded text-white mt-1 outline-none focus:border-[#ff9500]" 
              value={formData.progresso || 0} 
              onChange={(e) => setFormData({...formData, progresso: parseInt(e.target.value)})} 
            />
          </div>
        </div>

        {/* SENHA */}
        <div>
          <label className="text-xs text-gray-500 uppercase">Senha de Acesso</label>
          <input 
            className="w-full p-3 bg-black border border-[#222] rounded text-white mt-1 outline-none focus:border-[#ff9500]" 
            value={formData.senha || ""} 
            onChange={(e) => setFormData({...formData, senha: e.target.value})} 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={saving}
          className="w-full bg-[#ff9500] text-black font-bold p-3 rounded mt-4 hover:bg-white transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {saving ? <><Loader2 className="animate-spin" size={18}/> Salvando...</> : "Salvar Alterações"}
        </button>
      </form>
    </main>
  );
}