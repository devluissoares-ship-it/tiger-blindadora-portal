// src/components/admin/AdminDashboardWrapper.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { Cliente } from '@/types/cliente';

export default function AdminDashboardWrapper() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados (feita para ser reutilizável)
  const fetchClientes = async () => {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    
    if (data) {
      setClientes(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // 1. Busca inicial
    fetchClientes();

    // 2. Subscrição Realtime: Atualiza a lista automaticamente se QUALQUER cliente mudar
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'clientes',
        },
        (payload) => {
          console.log('Mudança detectada no banco:', payload);
          // Força um novo fetch para pegar os dados atualizados
          fetchClientes();
        }
      )
      .subscribe();

    // Cleanup: remove a subscrição ao desmontar o componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500">Sincronizando com a Tiger...</div>;

  // Passa os dados dinâmicos para o seu componente original
  return <AdminDashboardClient initialClientes={clientes} key={clientes.length} />;
}