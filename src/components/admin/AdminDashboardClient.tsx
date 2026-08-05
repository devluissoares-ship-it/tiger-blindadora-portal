"use client";

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FileDown, CheckSquare, Check } from 'lucide-react';
import { Cliente } from '@/types/cliente';

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

  // Lista oficial das etapas da Tiger Blindados
  const etapasLista = [
    { num: 1, label: "ENTRADA" },
    { num: 2, label: "DESMONTAGEM" },
    { num: 3, label: "ESTRUTURA" },
    { num: 4, label: "PORTAS" },
    { num: 5, label: "VIDROS" },
    { num: 6, label: "ACABAMENTO" },
    { num: 7, label: "TESTES" },
    { num: 8, label: "FINALIZAÇÃO" },
    { num: 9, label: "ENTREGA" }
  ];

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

  const etapaAtualNum = converterStatusParaNumero(cliente?.status);

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
      <style jsx global>{`
        /* Scrollbar customizada e super fina para toda a tela e painel da IA */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #0b0b0b;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
      `}</style>

      {/* Barra Superior de Seleção e Ações (Com foco na cor da marca) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select 
          value={clienteId}
          onChange={(e) => { setClienteId(e.target.value); playSound('clickbuton.mp3'); }}
          className="flex-1 bg-[#111] border border-[#222] p-4 rounded-xl text-white font-bold uppercase tracking-widest hover:border-orange-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer outline-none shadow-inner"
        >
          {initialClientes.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#111] text-white">
              {c.nome} - {c.veiculo}
            </option>
          ))}
        </select>
        
        <button 
          onClick={handleExportPDF}
          disabled={carregandoPdf}
          className="bg-[#111] border border-[#222] px-6 py-4 rounded-xl text-white font-bold hover:border-orange-500 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-md"
        >
          <FileDown size={18} className="text-orange-500" /> {carregandoPdf ? "GERANDO..." : "FICHA PDF"}
        </button>
      </div>

      {/* Grid Principal: 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Coluna Esquerda (Conteúdo Geral) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* LINHA DE PRODUÇÃO CUSTOMIZADA (1 ao 9 perfeitamente integrados e responsivos) */}
          <div className="w-full bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4 text-center">Linha de Produção - Status do Veículo</p>
            <div className="flex items-center justify-between relative overflow-x-auto py-2">
              {etapasLista.map((etapa) => {
                const isConcluido = etapa.num < etapaAtualNum;
                const isAtual = etapa.num === etapaAtualNum;

                return (
                  <div key={etapa.num} className="flex flex-col items-center relative z-10 min-w-[55px] px-1">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                        isAtual 
                          ? 'bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.6)] scale-110 font-black border-2 border-white' 
                          : isConcluido 
                          ? 'bg-neutral-800 text-orange-400 border border-orange-500/50' 
                          : 'bg-neutral-900 text-neutral-600 border border-neutral-800'
                      }`}
                    >
                      {etapa.num}
                    </div>
                    <span className={`text-[8px] mt-2 font-bold uppercase tracking-tight text-center ${
                      isAtual ? 'text-orange-400 font-extrabold' : isConcluido ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      {etapa.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHECKLIST E VISTORIA DE ENTRADA (Sempre visível em qualquer etapa) */}
          <div className="bg-[#111] p-6 rounded-2xl border border-orange-500/40 shadow-xl shadow-orange-500/5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222] pb-3">
              <h3 className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                <CheckSquare size={16} /> Checklist e Vistoria de Entrada
              </h3>
              <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded-full font-mono font-semibold border border-orange-500/20">
                Registro Oficial
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'lataria', label: 'Lataria (Riscos/Amassados)' },
                { key: 'vidros_e_parabrisa', label: 'Vidros e Para-brisa' },
                { key: 'interior_e_bancos', label: 'Interior e Bancos' },
                { key: 'painel_e_km', label: 'Painel e Quilometragem' },
                { key: 'acessorios_e_pertences', label: 'Acessórios e Pertences' },
              ].map((item) => {
                const isChecked = !!(cliente.checklist_entrada as Record<string, boolean>)?.[item.key];
                return (
                  <div 
                    key={item.key} 
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      isChecked 
                        ? 'bg-[#161f17] border-green-500/40 text-white shadow-[0_0_10px_rgba(34,197,94,0.05)]' 
                        : 'bg-[#161616] border-[#262626] text-gray-500 opacity-60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      isChecked 
                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                        : 'bg-[#222] border-[#333] text-transparent'
                    }`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-semibold tracking-wide">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Observações do Checklist */}
            <div className="pt-1">
              <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wider">Observações Registradas</p>
              <div className="w-full bg-[#161616] border border-[#262626] p-3.5 rounded-xl text-gray-300 text-xs leading-relaxed min-h-[50px] flex items-center">
                {cliente.checklist_entrada?.observacoes || "Nenhuma observação registrada no checklist de entrada."}
              </div>
            </div>

            {/* Fotos de Entrada */}
            {cliente.fotos_entrada && cliente.fotos_entrada.length > 0 && (
              <div className="pt-3 border-t border-[#222]">
                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-3">Fotos da Vistoria de Entrada ({cliente.fotos_entrada.length})</p>
                <div className="grid grid-cols-3 gap-3">
                  {cliente.fotos_entrada.map((fotoUrl, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-[#262626] bg-black shadow-md group">
                      <img src={fotoUrl} alt={`Vistoria Entrada ${idx + 1}`} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* REVISÕES */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div> REVISÕES PROGRAMADAS
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: '6 Meses', data: cliente.data_revisao_6m },
                { label: '10.000 KM', data: cliente.data_revisao_10k },
                { label: 'Anual', data: cliente.data_revisao_anual },
              ].map((rev, idx) => (
                <div key={idx} className="bg-[#161616] p-4 rounded-xl border border-[#262626] relative shadow-inner">
                  <div className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${rev.data ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-700'}`}></div>
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{rev.label}</p>
                  <p className="text-sm font-bold text-white mt-1">
                    {rev.data ? new Date(rev.data).toLocaleDateString('pt-BR') : "--"}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <VehicleDetails cliente={cliente} />

          {/* REGISTRO FOTOGRÁFICO GERAL */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
            <h3 className="text-orange-500 font-bold mb-4 uppercase text-xs tracking-widest">Registro Fotográfico Geral</h3>
            {cliente.historico_fotos?.length ? (
              <div className="grid grid-cols-3 gap-4">
                {cliente.historico_fotos.map((foto, idx) => {
                  const textoLabel = foto.titulo || foto.descricao || "";
                  const mostrarTexto = textoLabel && typeof textoLabel === 'string' && textoLabel.toLowerCase() !== 'admin';
                  
                  return (
                    <div key={idx} className="rounded-xl overflow-hidden border border-[#262626] bg-black shadow-md group">
                      <img src={foto.url} alt={foto.titulo || "Foto"} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                      {mostrarTexto && (
                        <div className="p-2.5 bg-[#161616] border-t border-[#262626]">
                          <p className="text-[10px] text-orange-500 font-bold uppercase truncate">{textoLabel}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-gray-500 text-xs italic">Nenhuma foto registrada no momento.</p>}
          </div>

          {/* HISTÓRICO DE ATUALIZAÇÕES */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Histórico de Atualizações</h3>
            <div className="space-y-4 pl-1">
              <div className="flex gap-4">
                 <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                    <div className="w-[1px] h-6 bg-[#262626] mt-1"></div>
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
                    {idx !== (cliente.historico_eventos?.length || 0) - 1 && <div className="w-[1px] h-full bg-[#262626] mt-2"></div>}
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
        
        {/* Coluna Direita (PAINEL DA IA - Com scroll customizado e limpo) */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <div className="bg-[#111] rounded-2xl border border-[#222] shadow-xl overflow-hidden">
            <AdminAIAssistant cliente={cliente} />
          </div>
        </div>

      </div>
    </div>
  );
};