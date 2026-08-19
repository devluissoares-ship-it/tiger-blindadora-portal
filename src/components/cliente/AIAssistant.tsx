"use client";

import { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, Loader2, MessageCircle } from 'lucide-react';

interface ClienteData {
  nome?: string;
  status?: string;
  veiculo?: string;
  progresso?: number;
  checklist_entrada?: any;
  fotos_entrada?: any[];
  telefone?: string;
  whatsapp?: string;
}

interface AIAssistantProps {
  cliente: ClienteData;
  isUserAdmin?: boolean;
}

export default function AIAssistant({ cliente, isUserAdmin = false }: AIAssistantProps) {
  const [isReady, setIsReady] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const enviarParaIA = async (textoPersonalizado?: string) => {
    const textoEnvio = textoPersonalizado || pergunta;
    if (!textoEnvio.trim() || carregando) return;

    setCarregando(true);
    try {
      // Ajuste o endpoint conforme suas rotas reais
      const endpoint = isUserAdmin ? '/api/admin-ai' : '/api/chat';
      
      const payload = isUserAdmin 
        ? { cliente, pergunta: textoEnvio }
        : { 
            nomeCliente: cliente?.nome, 
            status: cliente?.status, 
            veiculo: cliente?.veiculo,
            progresso: cliente?.progresso,
            pergunta: textoEnvio,
            checklistEntrada: cliente?.checklist_entrada,
            fotosEntrada: cliente?.fotos_entrada
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Erro na resposta da API');
      }

      setResposta(data.text || "Sem resposta do servidor.");
      if (!textoPersonalizado) setPergunta("");
    } catch (error) {
      console.error("Erro na comunicação com a IA:", error);
      setResposta("Sinto muito, ocorreu um erro na comunicação com a inteligência artificial.");
    } finally {
      setCarregando(false);
    }
  };

  const dispararWhatsApp = () => {
    const tel = cliente?.telefone || cliente?.whatsapp;
    if (!tel) {
      alert("Telefone do cliente não cadastrado no sistema!");
      return;
    }
    const telefone = tel.replace(/\D/g, '');
    const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(resposta)}`;
    window.open(link, '_blank');
  };

  if (!isReady) {
    return (
      <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#222] flex items-center justify-center min-h-[200px]">
        <Loader2 className="animate-spin text-orange-500" size={24} />
      </div>
    );
  }

  const isEntrada = cliente?.status === "Entrada";

  return (
    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#222] shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Bot className={isUserAdmin ? "text-blue-500 animate-pulse" : "text-orange-500 animate-pulse"} size={20} />
          <h3 className="font-bold text-white uppercase text-xs tracking-widest">
            {isUserAdmin ? "Painel Admin IA" : "Consultor IA Tiger"}
          </h3>
        </div>
        {cliente?.status && (
          <span className="text-[10px] bg-[#111] border border-[#222] px-2.5 py-1 rounded-full text-orange-500 font-bold">
            {cliente.status}
          </span>
        )}
      </div>

      {isUserAdmin && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {isEntrada ? (
            <button 
              onClick={() => enviarParaIA("Gere uma mensagem amigável informando que o veículo deu entrada na Tiger, mencionando que a vistoria e checklist inicial foram concluídos com sucesso.")}
              disabled={carregando}
              className="text-[11px] bg-[#111] border border-[#222] hover:border-orange-500 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Sparkles size={12} className="text-orange-500" /> Msg de Entrada + Checklist
            </button>
          ) : (
            <button 
              onClick={() => enviarParaIA(`Gere uma atualização profissional informando que o veículo avançou para a etapa de ${cliente?.status} (${cliente?.progresso}% concluído).`)}
              disabled={carregando}
              className="text-[11px] bg-[#111] border border-[#222] hover:border-orange-500 text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Sparkles size={12} className="text-orange-500" /> Atualizar Fase Atual
            </button>
          )}
        </div>
      )}

      {!isUserAdmin && (
        <button 
          onClick={() => enviarParaIA("Explique a etapa atual")}
          disabled={carregando}
          className="w-full bg-orange-500 text-black font-bold py-3 rounded-xl mb-4 hover:bg-white transition-all text-xs tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {carregando ? <Loader2 size={16} className="animate-spin text-black" /> : null}
          {carregando ? "Processando..." : "EXPLICAR ETAPA ATUAL"}
        </button>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto mb-4 min-h-[100px]">
        {resposta && (
          <div className="bg-[#111] p-4 rounded-xl border border-[#222] text-gray-300 text-sm whitespace-pre-line leading-relaxed">
            <p className="mb-4">{resposta}</p>
            {isUserAdmin && (
              <button 
                onClick={dispararWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
              >
                <MessageCircle size={16} /> DISPARAR NO WHATSAPP
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder={isUserAdmin ? "Ex: Gere uma atualização para o cliente..." : "Alguma dúvida específica?"}
          className="flex-1 bg-[#111] border border-[#222] p-3 rounded-xl text-white text-sm outline-none focus:border-orange-500"
          onKeyDown={(e) => e.key === 'Enter' && enviarParaIA()}
          disabled={carregando}
        />
        <button 
          onClick={() => enviarParaIA()}
          disabled={carregando || !pergunta.trim()}
          className={`p-3 rounded-xl transition disabled:opacity-50 flex items-center justify-center min-w-[48px] ${
            isUserAdmin ? 'bg-orange-500 hover:bg-orange-600 text-black' : 'bg-orange-500 hover:bg-white text-black'
          }`}
        >
          {carregando ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}