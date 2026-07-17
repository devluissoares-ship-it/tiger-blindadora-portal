"use client";

import { useState } from 'react';
import { Send, Bot, Loader2, MessageCircle } from 'lucide-react';
import { Cliente } from '@/types/cliente';

export const AdminAIAssistant = ({ cliente }: { cliente: Cliente }) => {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  const enviarPergunta = async () => {
    if (!pergunta.trim()) return;

    setCarregando(true);
    try {
      const res = await fetch('/api/admin-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente,
          pergunta
        }),
      });

      const data = await res.json();
      setResposta(data.text);
    } catch (error) {
      setResposta("Erro na central de comando. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const dispararWhatsApp = () => {
    // Se o cliente não tiver telefone cadastrado, avisa
    if (!cliente.telefone) {
      alert("Telefone do cliente não cadastrado no sistema!");
      return;
    }
    
    // Formata o telefone (remove caracteres não numéricos)
    const telefone = cliente.telefone.replace(/\D/g, '');
    const link = `https://wa.me/55${telefone}?text=${encodeURIComponent(resposta)}`;
    window.open(link, '_blank');
  };

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-[#222] h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="text-orange-500" size={20} />
        <h3 className="text-white font-bold uppercase text-sm tracking-widest">Painel Admin IA</h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {resposta && (
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] text-gray-200 text-sm whitespace-pre-line leading-relaxed">
            <p className="mb-4">{resposta}</p>
            
            {/* Botão sempre disponível se houver resposta da IA */}
            <button 
              onClick={dispararWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <MessageCircle size={14} /> DISPARAR NO WHATSAPP
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <input 
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: Gere uma atualização para o cliente..."
          className="flex-1 bg-[#050505] border border-[#222] p-3 rounded-xl text-white text-sm outline-none focus:border-orange-500"
          onKeyDown={(e) => e.key === 'Enter' && enviarPergunta()}
        />
        <button 
          onClick={enviarPergunta}
          disabled={carregando}
          className="bg-orange-500 p-3 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
        >
          {carregando ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
};