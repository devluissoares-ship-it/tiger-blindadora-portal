"use client";

import { useDB } from "@/hooks/useDB";
import { useRouter } from "next/navigation";
import { 
  ProjectDetails, 
  QuickActions, 
  AIAssistantWidget 
} from '@/components/admin/AdminComponents';
import { ProcessSteps } from '@/components/admin/ProcessSteps';
import { VehicleDetails } from '@/components/admin/VehicleDetails';
import { useState, useEffect } from 'react';
import { playNotification } from "@/lib/audio";
import { User, Clock, ShieldCheck, Camera, Car, Key } from 'lucide-react';

export default function AdminDashboard() {
  const { data, updateCliente } = useDB();
  const router = useRouter();
  const [clienteId, setClienteId] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  
  // Garantimos que o cliente exista com uma verificação dupla
  const cliente = data?.clientes?.find((c: any) => c.id === clienteId);

  useEffect(() => {
    if (data?.clientes?.length > 0 && !clienteId) {
      setClienteId(data.clientes[0].id);
    }
  }, [data, clienteId]);

  const handleUpdate = async (updates: any) => {
    if (cliente) {
      const dadosCompletos = { ...cliente, ...updates };
      await updateCliente(cliente.id, dadosCompletos);
      playNotification();
      setFeedback("Dados atualizados com sucesso!");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Loading State blindado para evitar o erro #460
  if (!data?.clientes || data.clientes.length === 0) {
    return <div className="p-8 text-white min-h-screen bg-[#050505]">Carregando sistema e validando dados...</div>;
  }

  if (!cliente) {
    return <div className="p-8 text-white min-h-screen bg-[#050505]">Selecione um cliente para começar.</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-[#050505] text-white">
      {feedback && (
        <div className="fixed top-4 right-4 bg-[#ff9500] text-black px-6 py-3 rounded-lg font-bold z-50 shadow-xl animate-in fade-in slide-in-from-top-4">
          {feedback}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold border-l-4 border-[#ff9500] pl-4">Painel Administrativo</h1>
        <select 
          className="bg-[#111] border border-[#222] p-2 rounded-lg text-[#ff9500] outline-none cursor-pointer" 
          value={clienteId} 
          onChange={(e) => setClienteId(e.target.value)}
        >
          {data.clientes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nome || "Cliente"} - {c.veiculo || "Sem veículo"}</option>
          ))}
        </select>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center gap-4">
          <ShieldCheck className="text-[#ff9500]" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Status</p>
            <p className="font-bold text-sm">{cliente.status || "Pendente"}</p>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center gap-4">
          <Car className="text-blue-500" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Veículo</p>
            <p className="font-bold text-sm">{cliente.veiculo || "---"}</p>
          </div>
        </div>
        <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center gap-4">
          <Clock className="text-green-500" />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Revisão</p>
            <p className="font-bold text-sm">{cliente.dataRevisao || cliente.revisao || "---"}</p>
          </div>
        </div>
        <button onClick={() => router.push(`/admin/clientes/${cliente.id}/editar`)} className="bg-[#111] p-6 rounded-xl border border-[#222] flex items-center justify-between hover:border-[#ff9500] transition group">
          <span className="font-bold text-sm">Editar Cliente</span>
          <User size={16} className="text-white" />
        </button>
      </div>

      {/* CONTEÚDO CENTRAL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="col-span-2 space-y-10">
          <ProcessSteps 
            etapaAtual={Number(cliente.etapaAtual) || 1} 
            onSelect={(etapa: number) => handleUpdate({ etapaAtual: etapa })} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectDetails cliente={cliente} onSave={handleUpdate} />
            <VehicleDetails cliente={cliente} />
          </div>

          {/* GALERIA DE FOTOS */}
          <div className="bg-[#111] p-8 rounded-2xl border border-[#222]">
            <h3 className="text-[#ff9500] font-bold mb-6 flex items-center gap-2 text-lg">
              <Camera size={20} /> Registro Fotográfico
            </h3>
            {Array.isArray(cliente.historicoFotos) && cliente.historicoFotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cliente.historicoFotos.map((item: any, idx: number) => (
                  <div key={idx} className="group relative rounded-lg overflow-hidden border border-[#333] hover:border-[#ff9500] transition">
                    <img src={item.url || "/placeholder.png"} alt={item.descricao || "Progresso"} className="w-full h-32 object-cover" />
                    <div className="p-2 bg-black/80">
                      <p className="text-[10px] text-white truncate">{item.descricao || "Progresso"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm italic">Nenhuma foto registrada.</p>}
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="col-span-1 space-y-8">
          <QuickActions cliente={cliente} />
          <div className="bg-[#111] p-6 rounded-xl border border-[#222]">
            <h4 className="text-xs text-gray-500 uppercase font-bold mb-4">Senha de Acesso</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400">
               <Key size={16}/> {cliente.senha || "Sem senha"}
            </div>
          </div>
          <AIAssistantWidget cliente={cliente} isUserAdmin={true} />
        </div>
      </div>
    </div>
  );
}