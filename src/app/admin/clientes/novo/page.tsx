"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function NovoCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    nome: "", 
    veiculo: "", 
    telefone: "", 
    senha: "" 
  });

  // Função utilitária de notificação otimizada
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Som disparado de forma independente sem travar a thread principal
    new Audio(type === 'success' ? '/notification.mp3' : '/error.mp3').play().catch(() => {});
    
    const toast = document.createElement('div');
    toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-xl text-white font-bold shadow-2xl z-[9999] ${
      type === 'success' ? 'bg-[#ff9500]' : 'bg-red-600'
    }`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const novoCliente = {
      id: `${formData.nome.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`,
      nome: formData.nome,
      veiculo: formData.veiculo,
      telefone: formData.telefone,
      senha: formData.senha,
      status: "Entrada",
      progresso: 0,
      etapa_atual: 1, // Ajustado para snake_case conforme padrão Supabase
      historico_fotos: [],
      historico_eventos: [{ 
        data: new Date().toLocaleDateString('pt-BR'), 
        titulo: "Início", 
        descricao: "Projeto cadastrado no sistema." 
      }]
    };

    try {
      const { error } = await supabase
        .from("clientes")
        .insert([novoCliente]);

      if (error) throw error;

      showToast("Cliente cadastrado com sucesso!");
      router.push("/admin/clientes");
      router.refresh();
    } catch (err: any) {
      showToast("Erro ao cadastrar: " + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <h1 className="text-2xl font-bold mb-6 text-[#ff9500]">Novo Cadastro de Projeto</h1>
      
      <form onSubmit={handleSubmit} className="bg-[#111111] p-8 rounded-xl border border-[#222] max-w-lg shadow-2xl space-y-4">
        <input className="w-full p-3 bg-[#050505] border border-[#222] rounded-lg text-white focus:border-[#ff9500] outline-none transition-all" placeholder="Nome do Cliente" onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
        <input className="w-full p-3 bg-[#050505] border border-[#222] rounded-lg text-white focus:border-[#ff9500] outline-none transition-all" placeholder="Veículo" onChange={(e) => setFormData({...formData, veiculo: e.target.value})} required />
        <input className="w-full p-3 bg-[#050505] border border-[#222] rounded-lg text-white focus:border-[#ff9500] outline-none transition-all" placeholder="Telefone" onChange={(e) => setFormData({...formData, telefone: e.target.value})} required />
        <input className="w-full p-3 bg-[#050505] border border-[#222] rounded-lg text-white focus:border-[#ff9500] outline-none transition-all" placeholder="Senha de Acesso" onChange={(e) => setFormData({...formData, senha: e.target.value})} required />

        <button type="submit" disabled={loading} className="w-full bg-[#ff9500] text-black font-bold p-3 rounded-lg mt-4 flex justify-center items-center gap-2 hover:bg-[#e68600] transition-all disabled:opacity-50">
          {loading ? <><Loader2 className="animate-spin" size={18}/> Processando...</> : "Criar Cadastro"}
        </button>
      </form>
    </main>
  );
}