"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Car, Clock, User, ChevronDown, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import { Cliente } from '@/types/cliente';
// Certifique-se de que esses caminhos de importação estão corretos no seu projeto
import { StatusBoard } from '@/components/admin/StatusBoard'; 
import { VehicleDetails } from '@/components/admin/VehicleDetails';

export const AdminDashboardClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const router = useRouter();
  const [clienteId, setClienteId] = useState<string>(initialClientes[0]?.id || "");
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'alert' } | null>(null);
  
  const cliente = useMemo(() => 
    initialClientes.find((c) => c.id === clienteId), 
    [initialClientes, clienteId]
  );

  if (!cliente) return (
    <div className="p-12 text-center text-gray-500 bg-[#050505] min-h-screen">
      Nenhum projeto encontrado no banco de dados.
    </div>
  );

  return (
    <div className="p-8 min-h-screen bg-[#050505] text-white">
      {/* Toast de Alerta */}
      {feedback && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-2xl font-bold z-50 flex items-center gap-3 shadow-2xl border ${feedback.type === 'success' ? 'bg-[#111] border-green-500 text-green-500' : 'bg-[#111] border-[#ff9500] text-[#ff9500]'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
          {feedback.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel <span className="text-[#ff9500]">Tiger</span> Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de blindagem em tempo real</p>
        </div>
        <div className="relative">
          <select 
            className="bg-[#111] border border-[#222] p-4 pl-4 pr-12 rounded-2xl text-white outline-none focus:border-[#ff9500] transition appearance-none w-72 font-bold cursor-pointer"
            value={clienteId} 
            onChange={(e) => setClienteId(e.target.value)}
          >
            {initialClientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome} - {c.veiculo}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-5 text-gray-500 pointer-events-none" size={16}/>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: ShieldCheck, label: 'Status', val: cliente.status, color: '#ff9500' },
          { icon: Car, label: 'Veículo', val: cliente.veiculo, color: '#3b82f6' },
          { icon: Clock, label: 'Revisão', val: cliente.data_revisao || '---', color: '#10b981' },
          { icon: Pencil, label: 'Ação', val: 'Editar Projeto', color: '#6b7280', onClick: () => router.push(`/admin/clientes/${cliente.id}/editar`) }
        ].map((item, i) => (
          <button key={i} onClick={item.onClick} className="bg-[#111] p-6 rounded-2xl border border-[#222] hover:border-[#333] transition flex items-center gap-4 text-left">
            <item.icon style={{ color: item.color }} size={24} />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.label}</p>
              <p className="font-bold text-sm truncate">{item.val}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StatusBoard status={cliente.status} progresso={cliente.progresso} />
          <VehicleDetails cliente={cliente} />
        </div>
        
        {/* Coluna de Ações Rápidas */}
        <div className="space-y-8">
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h2 className="font-bold mb-6 uppercase text-[10px] tracking-widest text-[#ff9500]">Resumo Técnico</h2>
            <div className="space-y-4 text-sm">
               <div className="flex justify-between border-b border-[#222] pb-2">
                 <span className="text-gray-500">Nível</span>
                 <span className="font-bold">{cliente.nivel_blindagem || "Não definido"}</span>
               </div>
               <div className="flex justify-between border-b border-[#222] pb-2">
                 <span className="text-gray-500">Placa</span>
                 <span className="font-mono font-bold">{cliente.placa || "---"}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-500">Chassi</span>
                 <span className="font-mono text-xs">{cliente.chassi || "---"}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};