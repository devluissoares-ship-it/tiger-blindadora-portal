"use client";

import { useState } from 'react';
import { Send, Bot, Loader2, MessageCircle, Sparkles } from 'lucide-react';
import { Cliente } from '@/types/cliente';

export const AdminAIAssistant = ({ cliente }: { cliente: Cliente }) => {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviarPergunta = async (textoPersonalizado?: string) => {
    const textoEnvio = textoPersonalizado || pergunta;
    if (!textoEnvio.trim() || carregando) return;

    setCarregando(true);
    try {
      const res = await fetch('/api/admin-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente,
          pergunta: textoEnvio
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro na resposta do servidor.");
      }

      setResposta(data.text || "Sem resposta do servidor.");
      if (!textoPersonalizado) setPergunta("");
    } catch (error) {
      console.error("Erro na comunicação com o painel IA:", error);
      setResposta("Erro na central de comando. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const dispararWhatsApp = () => {
    // Busca por telefone ou whatsapp na tipagem do cliente
    const tel = cliente?.telefone || (cliente as any)?.whatsapp;
    
    if (!tel) {
      alert("Telefone do cliente não cadastrado no sistema!");
      return;
    }
    
    const telefone = tel.replace(/\D/g, '');
    const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(resposta)}`;
    window.open(link, '_blank');
  };

  const isEntrada = cliente?.status === "Entrada";

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-[#222] h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="text-orange-500" size={20} />
          <h3 className="text-white font-bold uppercase text-sm tracking-widest">Painel Admin IA</h3>
        </div>
        {cliente?.status && (
          <span className="text-[10px] bg-[#1a1a1a] border border-[#333] px-2.5 py-1 rounded-full text-orange-500 font-bold">
            Fase: {cliente.status}
          </span>
        )}
      </div>

      {/* Atalhos rápidos inteligentes baseados na fase atual */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {isEntrada ? (
          <button 
            onClick={() => enviarPergunta("Gere uma mensagem amigável informando que o veículo deu entrada na Tiger, mencionando que a vistoria e checklist inicial foram concluídos com sucesso.")}
            disabled={carregando}
            className="text-[11px] bg-[#1a1a1a] border border-[#333] hover:border-orange-500 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles size={12} className="text-orange-500" /> Gerar Msg de Entrada + Checklist
          </button>
        ) : (
          <button 
            onClick={() => enviarPergunta(`Gere uma atualização profissional informando que o veículo avançou para a etapa de ${cliente?.status} (${cliente?.progresso}% concluído).`)}
            disabled={carregando}
            className="text-[11px] bg-[#1a1a1a] border border-[#333] hover:border-orange-500 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles size={12} className="text-orange-500" /> Gerar Atualização da Fase Atual
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] min-h-[100px]">
        {resposta && (
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] text-gray-200 text-sm whitespace-pre-line leading-relaxed">
            <p className="mb-4">{resposta}</p>
            
            <button 
              onClick={dispararWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <MessageCircle size={16} /> DISPARAR NO WHATSAPP
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input 
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: Gere uma atualização para o cliente..."
          className="flex-1 bg-[#050505] border border-[#222] p-3 rounded-xl text-white text-sm outline-none focus:border-orange-500 disabled:opacity-50"
          onKeyDown={(e) => e.key === 'Enter' && enviarPergunta()}
          disabled={carregando}
        />
        <button 
          onClick={() => enviarPergunta()}
          disabled={carregando || !pergunta.trim()}
          className="bg-orange-500 p-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center min-w-[48px]"
        >
          {carregando ? <Loader2 className="animate-spin text-black" size={18} /> : <Send size={18} className="text-black" />}
        </button>
      </div>
    </div>
  );
};