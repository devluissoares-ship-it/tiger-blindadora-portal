"use client";

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { atualizarCliente } from '@/app/actions/clienteActions';
import { Cliente } from '@/types/cliente';

export const ProjectDetails = ({ cliente, onSave }: { cliente: Cliente, onSave: (updates: Partial<Cliente>) => Promise<void> }) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState(cliente?.nome || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Usando a prop onSave que vem do AdminDashboardClient 
      // Isso mantém a sincronia do estado global
      await onSave({ nome });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao sincronizar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <h3 className="text-lg font-bold mb-4 text-[#ff9500]">Dados do Cliente: {cliente?.nome}</h3>
      
      <div className="mb-4">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Cliente</label>
        <input 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full bg-[#050505] border border-[#222] p-2 rounded text-white font-semibold focus:border-[#ff9500] outline-none mt-1"
        />
      </div>

      <div className="mb-6">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Veículo</label>
        <p className="text-sm text-gray-300 bg-[#050505] p-2 rounded border border-[#222] mt-1">
          {cliente?.veiculo}
        </p>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        className="bg-[#ff9500] text-black px-4 py-2 rounded font-bold flex items-center gap-2 transition hover:bg-[#e08400] w-full justify-center disabled:opacity-50"
      >
        {loading ? (
          <><Loader2 className="animate-spin" size={16}/> Salvando...</>
        ) : (
          <><Save size={16}/> Salvar Alterações</>
        )}
      </button>
    </form>
  );
};