"use client";
import { useState } from 'react';
import { gerarExplicacaoEtapa } from '@/lib/ai';
import { playClick, playNotification } from "@/lib/audio";
import { Bot, Loader2 } from 'lucide-react';

export default function AIAssistant({ cliente, isUserAdmin = false }: { cliente: any, isUserAdmin?: boolean }) {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);

  // Aqui formatamos o contexto técnico para evitar alucinações
  const handleResponder = async () => {
    if (!pergunta) return;
    
    playClick();
    setLoading(true);

    try {
      // Passamos o contexto estruturado para a função gerarExplicacaoEtapa
      // Certifique-se de que no seu arquivo lib/ai, você utilize esses dados 
      // para criar o 'system prompt' da IA.
      const respostaIA = await gerarExplicacaoEtapa(pergunta, cliente, isUserAdmin);
      
      setResposta(respostaIA);
      playNotification();
    } catch (error) {
      setResposta("Desculpe, não consegui processar sua solicitação técnica agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222] mt-6 shadow-xl">
      <h3 className="text-[#ff9500] font-bold mb-4 flex items-center gap-2">
        <Bot size={18}/> Assistente Técnico Tiger
      </h3>
      
      <div className="space-y-3">
        <input 
          className="w-full bg-[#050505] p-3 rounded border border-[#333] text-white text-sm focus:border-[#ff9500] outline-none transition"
          placeholder={isUserAdmin ? "Ex: Status da revisão de 10k km?" : "Dúvida sobre seu veículo..."}
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleResponder()}
        />
        
        <button 
          onClick={handleResponder} 
          className="bg-[#ff9500] text-black px-4 py-2 rounded font-bold w-full hover:bg-white transition flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={16}/> Processando...</>
          ) : "Analisar com IA"}
        </button>
      </div>

      {resposta && (
        <div className="mt-6 p-4 bg-[#0a0a0a] border-l-2 border-[#ff9500] rounded-r text-sm text-gray-300 animate-in slide-in-from-bottom-2">
          <p className="font-bold text-[#ff9500] mb-1 text-[10px] uppercase">Resposta Técnica:</p>
          {resposta}
        </div>
      )}
      
      <p className="mt-4 text-[9px] text-gray-600 text-center uppercase tracking-widest">
        IA Tiger Blindadora • Foco em Segurança Técnica
      </p>
    </div>
  );
}