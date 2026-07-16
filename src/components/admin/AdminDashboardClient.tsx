"use client";

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Car, Clock, ChevronDown, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import { Cliente } from '@/types/cliente';
import { StatusBoard } from '@/components/admin/StatusBoard'; 
import { VehicleDetails } from '@/components/admin/VehicleDetails';

// Carregamento dinâmico isolado
const AIAssistant = dynamic(() => import('@/components/cliente/AIAssistant'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse bg-[#111] rounded-[2rem]" />
});

export const AdminDashboardClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [clienteId, setClienteId] = useState<string>(initialClientes?.[0]?.id || "");
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cliente = useMemo(() => 
    initialClientes?.find((c) => c.id === clienteId) || initialClientes?.[0], 
    [initialClientes, clienteId]
  );

  // Se não montou no cliente, retorna nulo para evitar erro de hidratação
  if (!isMounted) return null;

  if (!cliente) return <div className="p-8 text-white">Nenhum projeto encontrado.</div>;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#050505] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StatusBoard status={cliente.status || "Entrada"} progresso={cliente.progresso || 0} />
          <VehicleDetails cliente={cliente} />
        </div>
        
        <div className="space-y-8">
          {/* IA agora só aparece depois que a página carregou */}
          <AIAssistant cliente={cliente} isUserAdmin={true} />
        </div>
      </div>
    </div>
  );
};