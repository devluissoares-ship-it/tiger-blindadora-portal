"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function NovoCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    nome: "", veiculo: "", telefone: "", senha: "" 
  });

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
      progresso: 0
    };

    const { error } = await supabase.from("clientes").insert([novoCliente]);

    if (error) {
      alert(`Erro ao salvar: ${error.message}`);
    } else {
      alert("Sucesso!");
      router.push("/admin/clientes");
    }
    setLoading(false);
  };

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <h1 className="text-2xl font-bold mb-6">Novo Cadastro de Projeto</h1>
      <form onSubmit={handleSubmit} className="bg-[#111111] p-6 rounded-xl border border-[#222] max-w-lg space-y-4">
        <input className="w-full p-3 bg-black border border-[#222] rounded text-white" placeholder="Nome" onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
        <input className="w-full p-3 bg-black border border-[#222] rounded text-white" placeholder="Veículo" onChange={(e) => setFormData({...formData, veiculo: e.target.value})} required />
        <input className="w-full p-3 bg-black border border-[#222] rounded text-white" placeholder="Telefone" onChange={(e) => setFormData({...formData, telefone: e.target.value})} required />
        <input className="w-full p-3 bg-black border border-[#222] rounded text-white" placeholder="Senha" onChange={(e) => setFormData({...formData, senha: e.target.value})} required />
        <button type="submit" disabled={loading} className="w-full bg-[#ff9500] text-black font-bold p-3 rounded mt-4">{loading ? "Cadastrando..." : "Criar Cadastro"}</button>
      </form>
    </main>
  );
}