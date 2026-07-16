"use client";

import { useState, useEffect } from 'react';
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient"; 
import { supabase } from "@/lib/supabase";
import { Cliente } from '@/types/cliente'; // Importação do tipo definida no seu projeto

export default function AdminDashboardPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // Relógio em tempo real
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const playSound = (file: string) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(`/${file}`);
      audio.play().catch(() => {});
    }
  };

  // Função para buscar dados
  const fetchData = async () => {
    const { data, error } = await supabase.from('clientes').select('*').order('nome');
    if (error) {
      console.error("Erro ao buscar clientes:", error);
    } else {
      setClientes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // ESCUTA EM TEMPO REAL: Se algo mudar no banco, o Dashboard atualiza na hora!
    const channel = supabase
      .channel('realtime-clientes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500 animate-pulse font-bold tracking-widest">
      CARREGANDO SISTEMA TIGER...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-[#222] pb-6">
        <img src="/logo-tiger.png" className="w-20 hover:scale-105 transition-transform cursor-pointer" alt="Tiger Logo" />
        
        <div className="bg-[#0a0a0a] border border-[#222] px-6 py-3 rounded-2xl text-right">
          <p className="text-orange-500 font-bold text-lg font-mono">
            {time.toLocaleTimeString('pt-BR')}
          </p>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest">
            {time.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Container Principal */}
      <div onClick={() => playSound('clickbuton.mp3')}>
        {/* Passamos o key={clientes.length} para forçar a remontagem caso a lista mude */}
        <AdminDashboardClient key={clientes.length} initialClientes={clientes} />
      </div>
    </main>
  );
}