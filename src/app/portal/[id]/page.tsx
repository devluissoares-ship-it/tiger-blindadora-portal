"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { Loader2, Sparkles, Phone, Send, ClipboardCheck, CheckSquare } from 'lucide-react';

export default function PortalPage() {
  const params = useParams();
  const [cliente, setCliente] = useState<any>(null);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const playSound = (type: 'click' | 'notification') => {
    try {
      const audio = new Audio(type === 'click' ? '/clickbuton.mp3' : '/notification.mp3');
      audio.play().catch(() => {});
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    const rawId = params?.id;
    if (!rawId) return;
    
    const fetchCliente = async () => {
      const idString = Array.isArray(rawId) ? rawId[0] : rawId;
      const idDecodificado = decodeURIComponent(idString);
      
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', idDecodificado)
        .single();
        
      if (data) {
        setCliente(data);
      }
    };
    fetchCliente();
  }, [params]);

  const enviarParaIA = async (tipo: 'etapa' | 'pergunta', textoCustomizado?: string) => {
    if (!cliente) return;
    const textoFinal = textoCustomizado || pergunta || "Poderia me dar mais informações sobre o processo?";
    
    setLoading(true);
    playSound('click');
    
    try {
      const res = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nomeCliente: cliente.nome, 
          status: tipo === 'etapa' ? cliente.status : `Dúvida: ${textoFinal}`, 
          veiculo: cliente.veiculo,
          progresso: cliente.progresso,
          isUserAdmin: false,
          checklistEntrada: cliente.checklist_entrada,
          fotosEntrada: cliente.fotos_entrada
        })
      });
      
      const data = await res.json();
      setResposta(data.text || "Sinto muito, fale com nossa equipe via WhatsApp.");
      
      if (tipo === 'pergunta') {
        setPergunta("");
      }
    } catch { 
      setResposta("Sinto muito, fale com nossa equipe via WhatsApp."); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!mounted) return null;

  if (!cliente) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Loader2 className="animate-spin text-orange-500" size={48} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      {/* Header com Logo Pulsando */}
      <div className="flex justify-between items-center mb-10">
        <img src="/logo-tiger.png" className="w-24 animate-pulse" alt="Logo Tiger" />
        <div className="text-right">
          <h1 className="text-2xl font-bold">{cliente.nome}</h1>
          <p className="text-orange-500 font-medium">{cliente.veiculo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Esquerdo: Status, Vistoria de Entrada e Fotos */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-[#222]">
            <h2 className="text-orange-500 font-bold mb-4 uppercase text-xs tracking-widest">
              Etapa Atual: {cliente.status}
            </h2>
            <div className="w-full bg-black h-4 rounded-full border border-[#222] overflow-hidden">
              <div className="bg-orange-500 h-full transition-all duration-1000" style={{ width: `${cliente.progresso}%` }} />
            </div>
            <p className="mt-2 font-bold text-lg">{cliente.progresso}% de conclusão</p>
          </div>

          {/* CHECKLIST E VISTORIA DE ENTRADA */}
          {cliente.checklist_entrada && (
            <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-[#222]">
              <div className="flex items-center gap-3 mb-6 text-orange-500">
                <ClipboardCheck size={22} />
                <h3 className="font-bold uppercase tracking-wider text-xs">Vistoria e Checklist de Entrada do Veículo</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-6 text-gray-300">
                <div className="flex items-center gap-2 bg-black p-3.5 rounded-2xl border border-[#222]">
                  <CheckSquare size={16} className={cliente.checklist_entrada.lataria ? "text-green-500" : "text-gray-600"} />
                  <span>Lataria (Riscos/Amassados)</span>
                </div>
                <div className="flex items-center gap-2 bg-black p-3.5 rounded-2xl border border-[#222]">
                  <CheckSquare size={16} className={cliente.checklist_entrada.vidros_e_parabrisa ? "text-green-500" : "text-gray-600"} />
                  <span>Vidros e Para-brisa</span>
                </div>
                <div className="flex items-center gap-2 bg-black p-3.5 rounded-2xl border border-[#222]">
                  <CheckSquare size={16} className={cliente.checklist_entrada.interior_e_bancos ? "text-green-500" : "text-gray-600"} />
                  <span>Interior e Bancos</span>
                </div>
                <div className="flex items-center gap-2 bg-black p-3.5 rounded-2xl border border-[#222]">
                  <CheckSquare size={16} className={cliente.checklist_entrada.painel_e_km ? "text-green-500" : "text-gray-600"} />
                  <span>Painel e Quilometragem</span>
                </div>
                <div className="flex items-center gap-2 bg-black p-3.5 rounded-2xl border border-[#222] md:col-span-2">
                  <CheckSquare size={16} className={cliente.checklist_entrada.acessorios_e_pertences ? "text-green-500" : "text-gray-600"} />
                  <span>Acessórios e Pertences</span>
                </div>
              </div>

              {cliente.checklist_entrada.observacoes && (
                <div className="mb-6 p-4 bg-black rounded-2xl border border-[#222] text-sm text-gray-400">
                  <span className="text-orange-500 font-bold">Observações da Entrada:</span> {cliente.checklist_entrada.observacoes}
                </div>
              )}

              {/* FOTOS DA VISTORIA INICIAL */}
              {cliente.fotos_entrada && cliente.fotos_entrada.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Fotos da Vistoria Inicial</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {cliente.fotos_entrada.map((fotoUrl: string, i: number) => (
                      <div key={i} className="bg-black p-3 rounded-2xl border border-[#222]">
                        <img src={fotoUrl} className="w-full h-32 object-cover rounded-xl" alt={`Vistoria Entrada ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTÓRICO FOTOGRÁFICO DE EVOLUÇÃO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cliente.historico_fotos?.map((f: any, i: number) => (
              <div key={i} className="bg-[#0a0a0a] rounded-[2rem] border border-[#222] hover:border-orange-500/50 transition overflow-hidden flex flex-col shadow-lg">
                <div className="w-full h-48 bg-black overflow-hidden">
                  <img src={f.url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt={f.titulo || f.etapa || "Atualização de processo"} />
                </div>
                <div className="p-4 bg-black/90 border-t border-[#222] text-center">
                  <h4 className="font-extrabold text-orange-400 uppercase tracking-widest text-xs">
                    {f.titulo || f.etapa || "Atualização"}
                  </h4>
                  {f.descricao && (
                    <p className="text-xs text-gray-400 mt-1">{f.descricao}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultor IA Tiger */}
        <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-[#222] shadow-2xl h-fit">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-orange-500 animate-pulse" size={24} />
            <h3 className="font-bold">Consultor IA Tiger</h3>
          </div>
          
          <button 
            onClick={() => enviarParaIA('etapa')} 
            disabled={loading}
            className="w-full bg-orange-500 text-black font-bold py-4 rounded-2xl mb-4 hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-black" /> : null}
            {loading ? "Processando..." : "EXPLICAR ETAPA ATUAL"}
          </button>
          
          <div className="relative mb-4">
            <input 
              className="w-full bg-[#111] border border-[#222] p-4 pr-12 rounded-2xl text-white outline-none focus:border-orange-500 transition" 
              placeholder="Alguma dúvida específica?" 
              value={pergunta} 
              onChange={(e) => setPergunta(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  enviarParaIA('pergunta', pergunta);
                }
              }}
            />
            <button 
              onClick={() => enviarParaIA('pergunta', pergunta)} 
              disabled={loading}
              className="absolute right-2 top-2 p-3 bg-orange-500 rounded-xl hover:bg-white transition disabled:opacity-50"
            >
              <Send size={18} className="text-black"/>
            </button>
          </div>

          {resposta && (
            <div className="p-4 bg-[#111] rounded-2xl border border-[#222] text-sm text-gray-300 italic mb-4 animate-in fade-in leading-relaxed">
              {resposta}
            </div>
          )}

          <button 
            onClick={() => { playSound('notification'); window.open('https://wa.me/5511991343588'); }} 
            className="w-full bg-[#222] py-4 rounded-2xl hover:bg-orange-500 hover:text-black font-bold flex justify-center gap-2 items-center transition"
          >
            <Phone size={20} /> FALAR COM EQUIPE
          </button>
        </div>
      </div>
    </main>
  );
}