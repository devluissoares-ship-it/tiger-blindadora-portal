"use client";

import { useState } from 'react';
import { useDB } from '@/hooks/useDB';

export const NovoClienteForm = ({ onClose }: { onClose: () => void }) => {
  const { addCliente } = useDB();
  const [nome, setNome] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Gerando um ID aleatório
    const idSlug = `${nome.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 1000)}`;
    
    // Mapeamento correto para o banco de dados (usando snake_case como o Supabase espera)
    const novo = {
      id: idSlug,
      nome,
      veiculo,
      senha: "123", 
      status: "Entrada",
      progresso: 0,
      etapaAtual: 1, // O useDB vai traduzir para etapa_atual no insert
      telefone: "",
      modelo: veiculo,
      anoModelo: "",
      placa: "",
      chassi: "",
      tipoRevisao: "",
      dataRevisao: "",
      horaRevisao: "",
      nivelBlindagem: "",
      historicoFotos: [], // O useDB vai traduzir para historico_fotos no insert
      historicoEventos: [{ 
        data: new Date().toLocaleDateString('pt-BR'), 
        titulo: "Entrada", 
        descricao: "Veículo cadastrado no sistema." 
      }]
    };
    
    try {
      // Chamamos a função que processa o salvamento
      await addCliente(novo);
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
      <h3 className="text-lg font-bold mb-4 text-[#ff9500]">Novo Projeto</h3>
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