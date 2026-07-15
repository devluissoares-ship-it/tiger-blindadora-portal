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
    <form onSubmit={handleSave} className="bg-[#111111] p-8 rounded-2xl border border-[#222] shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#ff9500]/10 rounded-lg">
          <User size={20} className="text-[#ff9500]" />
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Dados do Projeto</h3>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Nome do Cliente</label>
          <input 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-[#050505] border border-[#222] p-3 rounded-xl text-white font-medium focus:border-[#ff9500] outline-none transition mt-1"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Veículo</label>
          <div className="flex items-center gap-3 w-full bg-[#050505] p-3 rounded-xl border border-[#222] mt-1 text-gray-400">
            <Car size={16} />
            <span className="text-sm font-medium">{cliente?.veiculo}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#ff9500] text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition hover:bg-[#e68600] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={18}/> Processando...</>
          ) : (
            <><Save size={18}/> Salvar Alterações</>
          )}
        </button>
      </div>
    </form>
  );
};