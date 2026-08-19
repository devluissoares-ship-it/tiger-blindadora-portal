"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { playClick, playNotification } from "@/lib/audio";
import { Loader2 } from 'lucide-react';
import { Cliente } from "@/types/cliente";

export default function PainelAdmin() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*');
      
      if (!error && data) {
        setClientes(data);
      }
      setLoading(false);
    };
    fetchClientes();
  }, []);

  const atualizarCliente = async (id: string, campo: string, valor: any) => {
    playClick();
    
    // Atualiza no Supabase
    const { error } = await supabase
      .from('clientes')
      .update({ [campo]: valor })
      .eq('id', id);

    if (!error) {
      // Atualiza localmente
      setClientes(prev => prev.map(c => c.id === id ? { ...c, [campo]: valor } : c));
      playNotification();
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#FF5C00]">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white p-8 font-sans">
      <header className="mb-10 border-b border-[#222] pb-6">
        <h1 className="text-4xl font-bold text-[#FF5C00] uppercase tracking-widest">Painel Tiger</h1>
        <p className="text-[#555]">Centro de Controle de Blindagem</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {clientes.map((c) => (
          <div key={c.id} className="bg-[#0A0A0A] p-8 rounded-3xl border border-[#222] shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{c.nome}</h2>
                <p className="text-[#FF5C00]">{c.veiculo}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#555] uppercase">ID: {c.id.slice(0, 8)}...</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* STATUS */}
              <div>
                <label className="text-[9px] text-[#555] uppercase mb-1 block">Status de Produção</label>
                <select 
                  className="w-full bg-[#000] p-4 rounded-xl border border-[#222] text-sm focus:border-[#FF5C00] outline-none"
                  value={c.status}
                  onChange={(e) => atualizarCliente(c.id, 'status', e.target.value)}
                >
                  {['Entrada', 'Triagem', 'Desmontagem', 'Blindagem', 'Remontagem', 'Testes', 'Entrega'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* PROGRESSO */}
              <div>
                <label className="text-[9px] text-[#555] uppercase mb-1 block">Progresso (%)</label>
                <input 
                  type="number"
                  className="w-full bg-[#000] p-4 rounded-xl border border-[#222] text-sm focus:border-[#FF5C00] outline-none"
                  value={c.progresso || 0}
                  onChange={(e) => atualizarCliente(c.id, 'progresso', parseInt(e.target.value))}
                />
              </div>

              {/* AÇÕES */}
              <a 
                href={`https://wa.me/${c.telefone}?text=Olá ${c.nome}, o status do seu veículo (${c.veiculo}) foi atualizado para: ${c.status}.`}
                target="_blank"
                onClick={playClick}
                className="w-full bg-[#FF5C00] text-black font-bold py-4 rounded-xl text-center uppercase tracking-widest text-xs hover:bg-white transition-all mt-4"
              >
                Notificar via WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}