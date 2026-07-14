"use client";

import { useDB } from "@/hooks/useDB";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { playNotification } from "@/lib/audio";

export default function NovoCliente() {
  const { addCliente } = useDB();
  const router = useRouter();
  
  const [notification, setNotification] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    veiculo: "",
    telefone: "",
    senha: "" 
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    playNotification();
    setTimeout(() => setNotification(null), 3000);
  };

  const generateSlug = (nome: string, veiculo: string) => {
    return `${nome.toLowerCase().replace(/\s+/g, '-')}-${veiculo.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoCliente = {
      id: generateSlug(formData.nome, formData.veiculo),
      nome: formData.nome,
      veiculo: formData.veiculo,
      telefone: formData.telefone,
      senha: formData.senha,
      status: "Entrada",
      progresso: 0,
      etapaAtual: 1,
      nivelBlindagem: "III-A",
      modelo: formData.veiculo,
      anoModelo: "",
      placa: "",
      chassi: "",
      tipoRevisao: "",
      dataRevisao: "",
      horaRevisao: "",
      dataCadastro: new Date().toISOString(),
      imagens: [],
      historicoFotos: [],
      historicoEventos: [{ 
        data: new Date().toLocaleDateString('pt-BR'), 
        titulo: "Cadastro Realizado", 
        descricao: `Projeto criado para ${formData.nome}.` 
      }]
    };

    // A mágica acontece aqui com o AWAIT
    const res = await addCliente(novoCliente);
    
    if (res?.success !== false) {
      showNotification("Cliente cadastrado com sucesso!");
      setTimeout(() => {
        router.push("/admin/clientes");
      }, 1000);
    } else {
      alert("Erro ao salvar no banco. Verifique sua conexão.");
    }
  };

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      {notification && (
        <div className="fixed top-6 right-6 bg-[#ff9500] text-black px-6 py-4 rounded-xl font-bold shadow-2xl z-50">
          {notification}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">Novo Cadastro de Projeto</h1>
      
      <form onSubmit={handleSubmit} className="bg-[#111111] p-6 rounded-xl border border-[#222] max-w-lg space-y-4">
        <input 
          className="w-full p-3 bg-black border border-[#222] rounded focus:border-[#ff9500] outline-none" 
          placeholder="Nome do Cliente" 
          onChange={(e) => setFormData({...formData, nome: e.target.value})} 
          required 
        />
        <input 
          className="w-full p-3 bg-black border border-[#222] rounded focus:border-[#ff9500] outline-none" 
          placeholder="Veículo (Modelo)" 
          onChange={(e) => setFormData({...formData, veiculo: e.target.value})} 
          required 
        />
        <input 
          className="w-full p-3 bg-black border border-[#222] rounded focus:border-[#ff9500] outline-none" 
          placeholder="WhatsApp (com DDD)" 
          onChange={(e) => setFormData({...formData, telefone: e.target.value})} 
          required 
        />
        <input 
          type="text" 
          className="w-full p-3 bg-black border border-[#222] rounded focus:border-[#ff9500] outline-none" 
          placeholder="Definir Senha de Acesso" 
          onChange={(e) => setFormData({...formData, senha: e.target.value})} 
          required 
        />

        <button type="submit" className="w-full bg-[#ff9500] text-black font-bold p-3 rounded mt-4 hover:bg-white transition-all">
          Criar Cadastro
        </button>
      </form>
    </main>
  );
}