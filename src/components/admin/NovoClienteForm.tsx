"use client";

import { useState } from 'react';
import { criarNovoCliente } from '@/app/actions/clienteActions';
import { criarClientePadrao } from '@/types/cliente';

export const NovoClienteForm = ({ onClose }: { onClose: () => void }) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Gerador de ID único baseado no nome e timestamp
    const idSlug = `${nome.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`;
    
    // Criamos o objeto baseado no padrão corrigido
    const novoCliente = {
      ...criarClientePadrao(),
      id: idSlug,
      nome,
      telefone,
      veiculo,
      // Usando o nome correto da coluna no banco: historico_eventos
      historico_eventos: [{ 
        data: new Date().toISOString(), 
        titulo: "Entrada", 
        descricao: "Veículo cadastrado no sistema via Painel Admin." 
      }]
    };
    
    try {
      await criarNovoCliente(novoCliente);
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      alert("Erro ao criar cadastro. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCadastrar} className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-[#222] shadow-2xl">
      <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wider">Novo Projeto</h3>
      
      <div className="space-y-4">
        <input 
          className="w-full bg-[#050505] p-4 rounded-xl border border-[#222] text-white focus:border-[#ff9500] outline-none transition-all placeholder:text-[#444]" 
          placeholder="Nome do Cliente" 
          value={nome}
          onChange={(e) => setNome(e.target.value)} 
          required
        />
        <input 
          className="w-full bg-[#050505] p-4 rounded-xl border border-[#222] text-white focus:border-[#ff9500] outline-none transition-all placeholder:text-[#444]" 
          placeholder="Telefone (WhatsApp)" 
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)} 
          required
        />
        <input 
          className="w-full bg-[#050505] p-4 rounded-xl border border-[#222] text-white focus:border-[#ff9500] outline-none transition-all placeholder:text-[#444]" 
          placeholder="Modelo do Veículo" 
          value={veiculo}
          onChange={(e) => setVeiculo(e.target.value)} 
          required
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full mt-8 bg-[#ff9500] text-black font-bold p-4 rounded-xl hover:bg-white transition-all disabled:opacity-50"
      >
        {loading ? "Processando..." : "Criar Cadastro"}
      </button>
    </form>
  );
};