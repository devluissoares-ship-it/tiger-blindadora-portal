"use client";

import { useState } from 'react';
import { gerarExplicacaoEtapa } from '@/lib/ai';
import { playClick, playNotification } from "@/lib/audio";
import { Bot, Loader2, Sparkles, SendHorizontal } from 'lucide-react';

interface AIAssistantProps {
  cliente: {
    nome: string;
    nivelBlindagem?: string;
    tipoRevisao?: string;
    dataRevisao?: string;
    etapaAtual?: number;
    [key: string]: any;
  };
  isUserAdmin?: boolean;
}

export default function AIAssistant({ cliente, isUserAdmin = false }: AIAssistantProps) {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResponder = async () => {
    if (!pergunta.trim()) return;
    
    playClick();
    setLoading(true);

    try {
      const respostaIA = await gerarExplicacaoEtapa(pergunta, cliente, isUserAdmin);
      setResposta(respostaIA || "Não foi possível processar sua solicitação no momento.");
      playNotification();
    } catch (error) {
      console.error("Erro no Assistente IA:", error);
      setResposta("Ops! Estamos com uma instabilidade técnica. Por favor, fale diretamente com nossa equipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] p-8 rounded-2xl border border-[#222] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#ff9500]/10 rounded-lg">
          <Bot size={20} className="text-[#ff9500]" />
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Assistente Técnico Tiger</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Inteligência Artificial Blindada</p>
        </div>
      </div>
      
      <div className="relative group">
        <input 
          className="w-full bg-[#050505] p-4 pr-12 rounded-xl border border-[#222] text-sm text-white focus:border-[#ff9500] outline-none transition-all placeholder:text-gray-700" 
          placeholder={isUserAdmin ? "Consultar status técnico..." : "Como posso te ajudar hoje?"}
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleResponder()}
        />
        <button 
          onClick={handleResponder}
          disabled={loading}
          className="absolute right-3 top-3.5 text-[#ff9500] hover:text-white transition"
        >
          {loading ? <Loader2 className="animate-spin" size={18}/> : <SendHorizontal size={18} />}
        </button>
      </div>
      
      {resposta && (
        <div className="mt-6 p-5 bg-[#0a0a0a] border-l-2 border-[#ff9500] rounded-r-xl text-sm text-gray-300 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 mb-3 text-[#ff9500]">
            <Sparkles size={14} />
            <span className="text-[10px] uppercase font-bold tracking-widest">Análise do Especialista</span>
          </div>
          <p className="leading-relaxed font-medium">{resposta}</p>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-[9px] text-gray-700 uppercase tracking-[0.2em]">Protocolo Seguro Tiger AI</p>
      </div>
    </div>
  );
}