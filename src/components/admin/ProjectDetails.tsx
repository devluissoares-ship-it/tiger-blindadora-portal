"use client";

import { useState } from 'react';
import { Save, Loader2, User, Car } from 'lucide-react';
import { Cliente } from '@/types/cliente';

export const ProjectDetails = ({ cliente, onSave }: { cliente: Cliente, onSave: (updates: Partial<Cliente>) => Promise<void> }) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState(cliente?.nome || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ nome });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSave} className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
          <User size={18} className="text-orange-500" />
        </div>
        <h3 className="text-white font-bold uppercase text-xs tracking-widest">Dados do Projeto</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Nome do Cliente</label>
          <input 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-[#161616] border border-[#262626] p-3.5 rounded-xl text-white text-xs font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition mt-1"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Veículo</label>
          <div className="flex items-center gap-3 w-full bg-[#161616] p-3.5 rounded-xl border border-[#262626] mt-1 text-gray-400">
            <Car size={16} className="text-orange-500" />
            <span className="text-xs font-semibold uppercase">{cliente?.veiculo}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-500 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:bg-white active:scale-[0.98] disabled:opacity-50 shadow-md"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={16}/> Processando...</>
          ) : (
            <><Save size={16}/> Salvar Alterações</>
          )}
        </button>
      </div>
    </form>
  );
};