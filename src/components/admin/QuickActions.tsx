"use client";

import { ReportGenerator } from './ReportGenerator';

export const QuickActions = ({ cliente }: any) => {
  
  const enviarWhatsApp = () => {
    const mensagem = `Olá ${cliente.nome}, temos novidades sobre o seu ${cliente.veiculo}! 
    O status atual é: ${cliente.status}. 
    Progresso: ${cliente.progresso}%. 
    Acompanhe pelo nosso portal oficial.`;
    
    // O link abaixo abre o WhatsApp Web direto com a mensagem pronta
    window.open(`https://wa.me/55${cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <h3 className="text-lg font-bold mb-4">Ações Rápidas</h3>
      
      <button 
        onClick={enviarWhatsApp}
        className="w-full bg-[#222] p-2 rounded text-sm mb-2 hover:bg-[#333] transition text-left flex items-center justify-between"
      >
        <span>Notificar via WhatsApp</span>
        <span className="text-[#ff9500]">➜</span>
      </button>
      
      <ReportGenerator cliente={cliente} />
    </div>
  );
};