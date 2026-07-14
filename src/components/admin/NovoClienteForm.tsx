"use client";

import { useState } from 'react';
import { criarNovoCliente } from '@/app/actions/clienteActions'; // Nossa Server Action
import { clientePadrao } from '@/types/cliente'; // Importando a estrutura base

export const NovoClienteForm = ({ onClose }: { onClose: () => void }) => {
  const [nome, setNome] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Gerando um ID aleatório seguindo o padrão que você já usava
    const idSlug = `${nome.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 1000)}`;
    
    // Criando o objeto respeitando a interface Cliente
    const novoCliente = {
      ...clientePadrao, // Traz os campos vazios definidos no seu arquivo de tipos
      id: idSlug,
      nome,
      veiculo,
      historicoEventos: [{ 
        data: new Date().toLocaleDateString('pt-BR'), 
        titulo: "Entrada", 
        descricao: "Veículo cadastrado no sistema." 
      }]
    };
    
    try {
      // Chamada direta para a Server Action, sem passar pelo useDB
      await criarNovoCliente(novoCliente);
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao salvar no banco de dados!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCadastrar} className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <h3 className="text-lg font-bold mb-4 text-[#ff9500]">Novo Cliente</h3>
      <input 
        className="w-full bg-[#050505] p-2 mb-3 rounded border border-[#222] text-sm text-white" 
        placeholder="Nome do Cliente" 
        value={nome}
        onChange={(e) => setNome(e.target.value)} 
        required
      />
      <input 
        className="w-full bg-[#050505] p-2 mb-4 rounded border border-[#222] text-sm text-white" 
        placeholder="Modelo do Veículo" 
        value={veiculo}
        onChange={(e) => setVeiculo(e.target.value)} 
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#ff9500] text-black font-bold p-2 rounded hover:bg-white transition-all disabled:opacity-50"
      >
        {loading ? "Salvando..." : "Cadastrar Projeto"}
      </button>
    </form>
  );
};