"use client";

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FileDown } from 'lucide-react';
import { Cliente } from '@/types/cliente';

const ProcessSteps = dynamic(() => import('@/components/admin/ProcessSteps').then((mod) => mod.ProcessSteps), { ssr: false });
const AdminAIAssistant = dynamic(() => import('@/components/admin/AdminAIAssistant').then((mod) => mod.AdminAIAssistant), { ssr: false });
const VehicleDetails = dynamic(() => import('@/components/admin/VehicleDetails').then((mod) => mod.VehicleDetails), { ssr: false });

export const AdminDashboardClient = ({ initialClientes }: { initialClientes: Cliente[] }) => {
  const [clienteId, setClienteId] = useState<string>("");
  const [carregandoPdf, setCarregandoPdf] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id');
    setClienteId(idFromUrl || initialClientes?.[0]?.id || "");
  }, [initialClientes]);

  const converterStatusParaNumero = (status: string | undefined) => {
    const mapa: Record<string, number> = {
      "Entrada": 1, "Desmontagem": 2, "Estrutura": 3, "Portas": 4, 
      "Vidros": 5, "Acabamento": 6, "Testes": 7, "Finalização": 8, "Entrega": 9, "Revisões": 10
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

  const handleExportPDF = async () => {
    if (!cliente) return;
    setCarregandoPdf(true);
    try {
      const { exportarFichaTecnicaPDF } = await import('@/utils/dashboardPdfGenerator');
      await exportarFichaTecnicaPDF(cliente);
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
      alert("Erro ao gerar a ficha técnica.");
    } finally {
      setCarregandoPdf(false);
    }
  };

  if (!cliente) return <div className="p-8 text-white">Nenhum projeto encontrado.</div>;

  return (
    <div className="space-y-6" onClick={() => playSound('clickbuton.mp3')}>
      <div className="flex gap-4">
        <select 
          value={clienteId}
          onChange={(e) => { setClienteId(e.target.value); playSound('clickbuton.mp3'); }}
          className="flex-1 bg-[#111] border border-[#222] p-4 rounded-xl text-white font-bold uppercase tracking-widest hover:border-orange-500 transition-all cursor-pointer outline-none"
        >
          {initialClientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} - {c.veiculo}</option>
          ))}
        </select>
        
        <button 
          onClick={handleExportPDF}
          disabled={carregandoPdf}
          className="bg-[#111] border border-[#222] px-6 rounded-xl text-white font-bold hover:border-orange-500 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          <FileDown size={18} /> {carregandoPdf ? "GERANDO..." : "FICHA PDF"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full">
            <ProcessSteps 
              etapaAtual={converterStatusParaNumero(cliente.status)} 
              onSelect={(e) => console.log("Etapa selecionada:", e)} 
            />
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div> REVISÕES
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: '6 Meses', data: cliente.data_revisao_6m },
                { label: '10.000 KM', data: cliente.data_revisao_10k },
                { label: 'Anual', data: cliente.data_revisao_anual },
              ].map((rev, idx) => (
                <div key={idx} className="bg-[#1a1a1a] p-3 rounded-xl border border-[#333] relative">
                  <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${rev.data ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'}`}></div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">{rev.label}</p>
                  <p className="text-sm font-bold text-white mt-1">
                    {rev.data ? new Date(rev.data).toLocaleDateString('pt-BR') : "--"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <VehicleDetails cliente={cliente} />

          {/* AJUSTE AQUI: O código abaixo filtra o "Admin" de forma robusta */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-orange-500 font-bold mb-4 uppercase text-sm">Registro Fotográfico</h3>
            {cliente.historico_fotos?.length ? (
              <div className="grid grid-cols-3 gap-4">
                {cliente.historico_fotos.map((foto, idx) => {
                  const f = foto as any;
                  // Tenta pegar a etapa, se não houver, pega a descrição.
                  const textoLabel = f.etapa || f.descricao || "";
                  // Verifica se o texto existe, não é vazio e não é "admin" (case-insensitive)
                  const mostrarTexto = textoLabel && typeof textoLabel === 'string' && textoLabel.toLowerCase() !== 'admin';
                  
                  return (
                    <div key={idx} className="rounded-lg overflow-hidden border border-[#333] bg-black">
                      <img src={foto.url} alt={foto.titulo || "Foto"} className="w-full h-32 object-cover" />
                      {mostrarTexto && (
                        <div className="p-2 bg-[#1a1a1a]">
                          <p className="text-[10px] text-orange-500 font-bold uppercase truncate">{textoLabel}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-gray-500 text-sm italic">Nenhuma foto registrada.</p>}
          </div>

          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h3 className="text-white font-bold mb-4 uppercase text-sm">Histórico de Atualizações</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                    <div className="w-[1px] h-6 bg-[#333] mt-1"></div>
                 </div>
                 <div>
                   <p className="text-white text-xs font-bold uppercase">{cliente.status}</p>
                   <p className="text-gray-400 text-[10px]">Status atual do projeto.</p>
                 </div>
              </div>
              {cliente.historico_eventos?.map((evento, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                    {idx !== (cliente.historico_eventos?.length || 0) - 1 && <div className="w-[1px] h-full bg-[#333] mt-2"></div>}
                  </div>
                  <div className="pb-2">
                    <p className="text-white text-xs font-bold uppercase">{evento.titulo}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{evento.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <AdminAIAssistant cliente={cliente} />
        </div>
      </div>
    </div>
  );
};