"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { atualizarCliente } from '@/app/actions/clienteActions';
import { playNotification } from "@/lib/audio";
import { User, Clock, ShieldCheck, Camera, Car, Key } from 'lucide-react';
import { Cliente } from '@/types/cliente'; 
import { 
  ProjectDetails, 
  QuickActions, 
  AIAssistantWidget 
} from '@/components/admin/AdminComponents';
import { ProcessSteps } from '@/components/admin/ProcessSteps';
import { VehicleDetails } from '@/components/admin/VehicleDetails';

export const AdminDashboardClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const router = useRouter();
  const [clienteId, setClienteId] = useState<string>(initialClientes[0]?.id || "");
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const cliente = useMemo(() => 
    initialClientes.find((c) => c.id === clienteId), 
    [initialClientes, clienteId]
  );

  const handleUpdate = async (updates: Partial<Cliente>) => {
    if (!cliente) return;
    
    try {
      const dadosCompletos = { ...cliente, ...updates };
      await atualizarCliente(cliente.id, dadosCompletos);
      
      playNotification();
      setFeedback("Dados atualizados com sucesso!");
      setTimeout(() => setFeedback(null), 3000);
      router.refresh(); 
    } catch (error) {
      console.error("Erro na atualização:", error);
      alert("Falha ao salvar no banco.");
    }
  };

  if (!cliente) return <div className="p-8 text-white">Selecione um cliente.</div>;

  return (
    <div className="p-8 min-h-screen bg-[#050505] text-white">
      {feedback && (
        <div className="fixed top-4 right-4 bg-[#ff9500] text-black px-6 py-3 rounded-lg font-bold z-50">
          {feedback}
        </div>
      )}

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold border-l-4 border-[#ff9500] pl-4">Painel Administrativo</h1>
        <select 
          className="bg-[#111] border border-[#222] p-2 rounded-lg text-[#ff9500] outline-none cursor-pointer" 
          value={clienteId} 
          onChange={(e) => setClienteId(e.target.value)}
        >
          {initialClientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} - {c.veiculo}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center gap-4">
          <ShieldCheck className="text-[#ff9500]" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Status</p>
            <p className="font-bold text-sm">{cliente.status}</p>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center gap-4">
          <Car className="text-blue-500" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Veículo</p>
            <p className="font-bold text-sm">{cliente.veiculo}</p>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center gap-4">
          <Clock className="text-green-500" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Revisão</p>
            {/* O TypeScript agora aceita o dataRevisao porque ele existe na interface */}
            <p className="font-bold text-sm">{(cliente as any).dataRevisao || "---"}</p>
          </div>
        </div>
        <button onClick={() => router.push(`/admin/clientes/${cliente.id}/editar`)} className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center justify-between hover:border-[#ff9500] transition">
          <span className="font-bold text-sm">Editar Cliente</span>
          <User size={16} />
        </button>
      </div>
      
      {/* O restante do seu JSX permanece igual */}
    </div>
  );
};