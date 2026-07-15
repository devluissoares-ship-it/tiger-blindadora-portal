"use client";

import { MessageSquare, FileText, Share2 } from "lucide-react";
import { ReportGenerator } from './ReportGenerator';

export const QuickActions = ({ cliente }: any) => {
  
  const enviarWhatsApp = () => {
    if (!cliente.telefone) {
      alert("Número de telefone não cadastrado para este cliente.");
      return;
    }
    
    const mensagem = `Olá, ${cliente.nome?.split(' ')[0]}! Novidades sobre o seu ${cliente.veiculo}. 
    
    Status atual: ${cliente.status}
    Progresso: ${cliente.progresso}%
    
    Acesse o acompanhamento em tempo real pelo nosso portal oficial.`;
    
    const url = `https://wa.me/55${cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-[#111111] p-8 rounded-2xl border border-[#222]">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Ações Rápidas</h3>
      
      <div className="space-y-3">
        {/* Botão WhatsApp */}
        <button 
          onClick={enviarWhatsApp}
          className="w-full bg-[#050505] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#ff9500] p-4 rounded-xl transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <MessageSquare size={18} className="text-[#25D366]" />
            <span className="text-sm font-bold text-gray-200">Notificar via WhatsApp</span>
          </div>
          <span className="text-[#ff9500] opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
        </button>
        
        {/* Report Generator (Mantendo sua lógica original) */}
        <div className="pt-2">
          <ReportGenerator cliente={cliente} />
        </div>

        {/* Botão Compartilhar (Exemplo de extensão futura) */}
        <button className="w-full bg-[#050505] hover:bg-[#1a1a1a] border border-[#222] p-4 rounded-xl transition-all flex items-center gap-3">
          <Share2 size={18} className="text-blue-500" />
          <span className="text-sm font-bold text-gray-200">Compartilhar Link</span>
        </button>
      </div>
    </div>
  );
};