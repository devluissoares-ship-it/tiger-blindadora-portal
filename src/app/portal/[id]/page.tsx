"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { Send, Loader2, Info, ChevronRight, MessageSquareText } from "lucide-react";
import { Cliente } from "@/types/cliente";

export default function DashboardCliente({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [pergunta, setPergunta] = useState("");

  useEffect(() => {
    const fetchCliente = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (!error && data) setCliente(data);
    };
    fetchCliente();
  }, [resolvedParams.id]);

  const handleConsultaIA = async (duvidaCustomizada?: string) => {
    if (!cliente) return;
    setLoading(true);
    setResposta("");
    
    try {
      const response = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCliente: cliente.nome,
          status: duvidaCustomizada ? `Dúvida: ${duvidaCustomizada}` : cliente.status,
          veiculo: cliente.veiculo,
          nivelBlindagem: cliente.nivel_blindagem || 'Nível III-A',
        }),
      });
      
      const resData = await response.json();
      setResposta(resData.text || "Consulte seu consultor técnico diretamente.");
    } catch (e) {
      setResposta("Erro ao consultar a rede Tiger Tech.");
    } finally {
      setLoading(false);
    }
  };

  if (!cliente) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#ff9500]">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">TIGER<span className="text-[#ff9500]">.</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Portal do Cliente</p>
        </div>
        <div className="text-right">
          <h1 className="text-sm md:text-lg font-bold text-[#ff9500]">{cliente.nome}</h1>
          <p className="text-[10px] md:text-xs text-gray-500 uppercase">{cliente.veiculo} • {cliente.placa || "Sem Placa"}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-[#222]">
            <div className="flex justify-between mb-4">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#ff9500]">Progresso da Blindagem</h2>
              <span className="font-mono text-[#ff9500] text-sm">{cliente.progresso}%</span>
            </div>
            <div className="w-full bg-black h-3 rounded-full border border-[#222] overflow-hidden">
              <div className="h-full bg-[#ff9500] transition-all duration-1000" style={{ width: `${cliente.progresso}%` }} />
            </div>
            <div className="mt-8 flex items-center gap-4">
               <div className="p-3 bg-[#ff9500]/10 rounded-xl text-[#ff9500]"><ChevronRight size={24}/></div>
               <div>
                 <p className="text-[10px] text-gray-500 uppercase">Etapa Atual</p>
                 <p className="text-lg md:text-xl font-bold">{cliente.status}</p>
               </div>
            </div>
          </div>

          <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-[#222]">
            <h2 className="text-[10px] font-bold mb-6 uppercase tracking-widest text-[#ff9500]">Galeria de Acompanhamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(cliente.historico_fotos || []).map((foto: any, i: number) => (
                <div key={i} className="bg-black p-2 rounded-2xl border border-[#222] hover:border-[#ff9500] transition">
                  <img src={foto.url} className="w-full aspect-video object-cover rounded-xl" alt="Foto do progresso" />
                  <p className="text-[#ff9500] text-[10px] font-bold mt-3 px-2 uppercase truncate">{foto.titulo || "Foto do processo"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna IA e Técnica */}
        <div className="space-y-8">
          <div className="bg-[#111111] p-6 md:p-8 rounded-3xl border border-[#222]">
            <div className="flex items-center gap-2 mb-6 font-bold text-[#ff9500]">
              <MessageSquareText size={20}/> Consultor Técnico IA
            </div>
            <button onClick={() => handleConsultaIA()} className="w-full bg-[#ff9500] text-black font-bold py-4 rounded-xl hover:bg-white transition mb-4">
              {loading ? "ANALISANDO..." : "EXPLICAR ETAPA ATUAL"}
            </button>
            <div className="w-full flex gap-2">
              <input className="flex-1 bg-black border border-[#222] p-4 rounded-xl text-sm outline-none focus:border-[#ff9500]" placeholder="Dúvida específica?" value={pergunta} onChange={(e) => setPergunta(e.target.value)} />
              <button onClick={() => handleConsultaIA(pergunta)} className="bg-[#222] px-4 rounded-xl hover:bg-[#ff9500] transition"><Send size={18} /></button>
            </div>
            {resposta && <div className="mt-6 p-4 bg-black rounded-xl text-xs text-gray-400 border border-[#222] leading-relaxed">{resposta}</div>}
          </div>

          <div className="bg-[#111111] p-8 rounded-3xl border border-[#222] text-sm">
             <div className="flex items-center gap-2 mb-4 text-[#ff9500] font-bold"><Info size={16}/> Dados Técnicos</div>
             <div className="space-y-3 text-gray-400">
                <p>Nível: <span className="text-white">{cliente.nivel_blindagem || "III-A"}</span></p>
                <p>Próxima Revisão: <span className="text-white">{cliente.data_revisao ? new Date(cliente.data_revisao).toLocaleDateString('pt-BR') : "Agendar"}</span></p>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}