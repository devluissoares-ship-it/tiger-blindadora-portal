"use client";

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Cliente } from '@/types/cliente';

const ProcessSteps = dynamic(() => import('@/components/admin/ProcessSteps').then((mod) => mod.ProcessSteps), { ssr: false });
const AdminAIAssistant = dynamic(() => import('@/components/admin/AdminAIAssistant').then((mod) => mod.AdminAIAssistant), { ssr: false });
const VehicleDetails = dynamic(() => import('@/components/admin/VehicleDetails').then((mod) => mod.VehicleDetails), { ssr: false });

export const AdminDashboardClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const [clienteId, setClienteId] = useState<string>(initialClientes?.[0]?.id || "");
  
  const converterStatusParaNumero = (status: string | undefined) => {
    const mapa: Record<string, number> = {
      "Entrada": 1, "Desmontagem": 2, "Estrutura": 3, "Portas": 4, 
      "Vidros": 5, "Acabamento": 6, "Testes": 7, "Finalização": 8, "Entrega": 9
    };
    return mapa[status || ""] || 1;
  };
  
  const playSound = (file: string) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(`/${file}`);
      audio.play().catch(() => {});
    }
  };

  const cliente = useMemo(() => 
    initialClientes?.find((c) => c.id === clienteId) || initialClientes?.[0], 
    [initialClientes, clienteId]
  );

  if (!cliente) return <div className="p-8 text-white">Nenhum projeto encontrado.</div>;

  return (
    <div className="space-y-6" onClick={() => playSound('clickbuton.mp3')}>
      <select 
        value={clienteId}
        onChange={(e) => { setClienteId(e.target.value); playSound('clickbuton.mp3'); }}
        className="w-full bg-[#111] border border-[#222] p-4 rounded-xl text-white font-bold uppercase tracking-widest hover:border-orange-500 transition-all cursor-pointer outline-none"
      >
        {initialClientes.map((c) => (
          <option key={c.id} value={c.id}>{c.nome} - {c.veiculo}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="w-full">
            <ProcessSteps 
              etapaAtual={converterStatusParaNumero(cliente.status)} 
              onSelect={(e) => console.log("Etapa selecionada:", e)} 
            />
          </div>

          {/* Bloco de Revisões Programadas - Corrigido para os campos existentes na interface */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] grid grid-cols-3 gap-4 text-center">
            <div className="border-r border-[#222]">
              <p className="text-[9px] text-gray-500 uppercase font-bold">6 Meses</p>
              <p className="text-sm font-bold text-white mt-1">{cliente.tipo_revisao === '6_meses' ? cliente.data_revisao : '--'}</p>
            </div>
            <div className="border-r border-[#222]">
              <p className="text-[9px] text-gray-500 uppercase font-bold">10.000 KM</p>
              <p className="text-sm font-bold text-white mt-1">{cliente.tipo_revisao === '10k_km' ? cliente.data_revisao : '--'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase font-bold">Anual</p>
              <p className="text-sm font-bold text-white mt-1">{cliente.tipo_revisao === 'anual' ? cliente.data_revisao : '--'}</p>
            </div>
          </div>
          
          <VehicleDetails cliente={cliente} />

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-orange-500 font-bold mb-4 uppercase text-sm">Registro Fotográfico</h3>
            {cliente.historico_fotos?.length ? (
              <div className="grid grid-cols-3 gap-4">
                {cliente.historico_fotos.map((foto, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-[#333]">
                    <img src={foto.url} alt={foto.titulo || "Foto"} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-500 text-sm italic">Nenhuma foto registrada.</p>}
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-white font-bold mb-4 uppercase text-sm">Histórico de Atualizações</h3>
            <div className="space-y-4">
              {cliente.historico_eventos?.length ? (
                cliente.historico_eventos.map((evento, idx) => {
                  const dataObj = evento.data ? new Date(evento.data) : null;
                  const dataValida = dataObj && !isNaN(dataObj.getTime());
                  
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                        {idx !== cliente.historico_eventos.length - 1 && <div className="w-[1px] h-full bg-[#333] mt-2"></div>}
                      </div>
                      <div className="pb-2">
                        <p className="text-white text-xs font-bold uppercase">{evento.titulo || "Atualização"}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">{evento.descricao}</p>
                        {dataValida && (
                          <p className="text-gray-600 text-[9px] uppercase mt-1">
                            {dataObj.toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : <p className="text-gray-500 text-sm italic">Nenhuma atualização registrada.</p>}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <AdminAIAssistant cliente={cliente} />
          
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-white font-bold mb-4 uppercase text-sm">Ações Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full bg-orange-600 p-3 rounded-lg font-bold text-black hover:bg-orange-500 transition-all text-sm">Baixar Relatório PDF</button>
              <button className="w-full border border-orange-600 text-orange-600 p-3 rounded-lg font-bold hover:bg-orange-600 hover:text-black transition-all text-sm">Enviar via WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};