"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { Loader2, Sparkles, Phone, Send } from 'lucide-react';

export default function PortalPage() {
  const { id } = useParams();
  const [cliente, setCliente] = useState<any>(null);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para tocar sons modernos
  const playSound = (type: 'click' | 'notification') => {
    const audio = new Audio(type === 'click' ? '/clickbuton.mp3' : '/notification.mp3');
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!id) return;
    const fetchCliente = async () => {
      const { data } = await supabase.from('clientes').select('*').eq('id', decodeURIComponent(id as string)).single();
      setCliente(data);
    };
    fetchCliente();
  }, [id]);

  const enviarParaIA = async (tipo: 'etapa' | 'pergunta', texto?: string) => {
    setLoading(true);
    playSound('click');
    
    try {
      const res = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nomeCliente: cliente?.nome, 
            status: cliente?.status, 
            pergunta: tipo === 'etapa' ? "Explique a etapa atual" : texto 
        })
      });
      const data = await res.json();
      setResposta(data.text);
    } catch { 
      setResposta("Sinto muito, fale com nossa equipe via WhatsApp."); 
    } finally { 
      setLoading(false); 
    }
  };

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
        {/* Painel Esquerdo: Status e Fotos */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cliente.historico_fotos?.map((f: any, i: number) => (
              <div key={i} className="bg-[#0a0a0a] p-5 rounded-[2rem] border border-[#222] hover:border-orange-500/50 transition">
                <img src={f.url} className="rounded-2xl w-full h-48 object-cover mb-4" alt="Processo" />
                
                {/* Lógica de limpeza: só exibe se o título for relevante e não for "Admin" */}
                {f.etapa && f.etapa.toLowerCase() !== 'admin' && (
                  <h4 className="font-bold text-orange-500 mb-1 uppercase tracking-wider text-xs">
                    {f.etapa}
                  </h4>
                )}
                
                {f.descricao && (
                  <p className="text-sm text-gray-400">{f.descricao}</p>
                )}
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
          
          <button onClick={() => enviarParaIA('etapa')} className="w-full bg-orange-500 text-black font-bold py-4 rounded-2xl mb-4 hover:bg-white transition-all">
            EXPLICAR ETAPA ATUAL
          </button>
          
          <div className="relative mb-4">
            <input 
              className="w-full bg-[#111] border border-[#222] p-4 rounded-2xl text-white outline-none focus:border-orange-500" 
              placeholder="Alguma dúvida específica?" 
              value={pergunta} 
              onChange={(e) => setPergunta(e.target.value)} 
            />
            <button onClick={() => enviarParaIA('pergunta', pergunta)} className="absolute right-2 top-2 p-3 bg-orange-500 rounded-xl hover:bg-white transition">
              <Send size={18} className="text-black"/>
            </button>
          </div>

          {resposta && (
            <div className="p-4 bg-[#111] rounded-2xl border border-[#222] text-sm text-gray-300 italic mb-4 animate-in fade-in">
              {resposta}
            </div>
          )}

          <button onClick={() => { playSound('notification'); window.open('https://wa.me/SEUNUMERO'); }} 
            className="w-full bg-[#222] py-4 rounded-2xl hover:bg-orange-500 font-bold flex justify-center gap-2 items-center transition">
            <Phone size={20} /> FALAR COM EQUIPE
          </button>
        </div>
      </div>
    </main>
  );
}