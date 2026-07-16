"use client";

import { useState } from 'react';
import { Send, MessageSquare, Phone, Loader2, Sparkles } from 'lucide-react';

export const ConsultorIA = ({ clienteNome, dadosCliente }: { clienteNome: string, dadosCliente: any }) => {
  const [mensagem, setMensagem] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  // Proteção: Garante que o som só toque no navegador
  const playClick = () => {
    if (typeof window !== "undefined") {
      new Audio('/clickbuton.mp3').play().catch(() => {});
    }
  };

  const enviarParaIA = async (texto: string) => {
    if (!texto.trim()) return;
    
    playClick();
    setLoading(true);
    setResposta("");

    try {
      const response = await fetch('/api/chat/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta: texto,
          nomeCliente: clienteNome,
          // Uso de encadeamento opcional para evitar erros se dadosCliente for null
          veiculo: dadosCliente?.veiculo || "Não informado",
          status: dadosCliente?.status || "Em processamento",
          nivelBlindagem: dadosCliente?.nivel_blindagem || "Não informado"
        })
      });
      
      const data = await response.json();
      setResposta(data.text || "O assistente está processando, tente novamente em breve.");
    } catch (err) {
      setResposta("Sistema temporariamente indisponível. Nossa equipe está atenta!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-[#222] shadow-2xl w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#111] p-3 rounded-2xl border border-[#222]">
          <MessageSquare className="text-orange-500" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-white">Consultor Técnico</h3>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sistemas Tiger AI</p>
        </div>
      </div>

      {/* Botão de Ação Rápida */}
      <button 
        onClick={() => enviarParaIA("Explique a etapa atual do meu veículo.")}
        className="w-full bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold py-4 rounded-2xl hover:bg-orange-500 hover:text-black transition-all duration-300 mb-6"
      >
        EXPLICAR ETAPA ATUAL
      </button>

      {/* Input de Mensagem */}
      <div className="relative mb-6">
        <textarea 
          className="w-full bg-[#111] border border-[#222] p-4 pr-14 rounded-2xl text-white outline-none focus:border-orange-500 transition-all h-32 resize-none placeholder:text-[#444]" 
          placeholder={`Olá ${clienteNome}, como posso te ajudar?`}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <button 
          onClick={() => enviarParaIA(mensagem)}
          disabled={loading}
          className="absolute right-3 bottom-3 bg-orange-500 text-black p-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>

      {/* Resposta da IA com estilo premium */}
      {resposta && (
        <div className="bg-[#111] p-5 rounded-2xl border-l-4 border-orange-500 text-sm text-gray-300 mb-6 italic animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="flex items-center gap-2 mb-2 text-orange-500">
             <Sparkles size={14} />
             <span className="text-[10px] uppercase font-bold tracking-widest">Tiger AI</span>
           </div>
           {resposta}
        </div>
      )}

      {/* Rodapé de Contato */}
      <button 
        onClick={() => { playClick(); window.open('https://wa.me/SEUNUMERO'); }}
        className="w-full flex items-center justify-center gap-3 bg-[#222] text-white font-bold py-4 rounded-2xl hover:bg-orange-500 hover:text-black transition-all"
      >
        <Phone size={20} /> FALAR COM EQUIPE
      </button>
    </div>
  );
};