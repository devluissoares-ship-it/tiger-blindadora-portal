"use client";

import { useState, useEffect } from 'react';
import { gerarExplicacaoEtapa } from '@/lib/ai';
import { playClick, playNotification } from "@/lib/audio";
import { Bot, Loader2, SendHorizontal, Phone } from 'lucide-react';

interface AIAssistantProps {
  cliente: any;
  isUserAdmin?: boolean;
}

export default function AIAssistant({ cliente, isUserAdmin = false }: AIAssistantProps) {
  const [isClient, setIsClient] = useState(false);
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleResponder = async (texto: string) => {
    if (!texto.trim()) return;
    setLoading(true);
    try {
      playClick();
      const respostaIA = await gerarExplicacaoEtapa(texto, cliente, isUserAdmin);
      setResposta(respostaIA || "Não foi possível processar.");
      playNotification();
    } catch (error) {
      setResposta("Erro técnico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-[#222]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#111] p-3 rounded-2xl border border-[#222]">
          <Bot className={isUserAdmin ? "text-blue-500" : "text-orange-500"} size={24} />
        </div>
        <div>
          <h3 className="font-bold text-white">{isUserAdmin ? "Painel Admin" : "Consultor Técnico"}</h3>
        </div>
      </div>
      
      <div className="relative mb-6">
        <textarea 
          className="w-full bg-[#111] border border-[#222] p-4 rounded-2xl text-white outline-none focus:border-orange-500 h-32 resize-none" 
          placeholder="Como posso te ajudar?"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
        />
        <button 
          onClick={() => handleResponder(pergunta)}
          disabled={loading}
          className="absolute right-3 bottom-3 bg-orange-500 text-black p-3 rounded-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={18}/> : <SendHorizontal size={18} />}
        </button>
      </div>
      
      {resposta && (
        <div className="mb-6 p-5 bg-[#111] border-l-4 border-orange-500 rounded-r-2xl text-sm text-gray-300 italic">
          <p>{resposta}</p>
        </div>
      )}
    </div>
  );
}