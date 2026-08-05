"use client";

import { Download, Share2 } from 'lucide-react';
import { Cliente } from '@/types/cliente';
import { exportarRelatorioPDF } from '@/utils/pdfGenerator'; // Importa a função centralizada

interface ReportGeneratorProps {
  cliente: Cliente;
}

export const ReportGenerator = ({ cliente }: ReportGeneratorProps) => {
  
  // Agora ele usa a mesma função de exportação da página de relatórios!
  const handleDownload = () => {
    exportarRelatorioPDF([cliente]);
  };

  const gerarWhatsApp = () => {
    const texto = `*TIGER BLINDADORA - Atualização de Projeto*

Olá, *${cliente.nome}*! 🚗
Temos novidades sobre o seu *${cliente.veiculo}*:

✅ Status: *${cliente.status}*
📈 Progresso: *${cliente.progresso}%*

Acompanhe os detalhes em tempo real pelo nosso portal oficial:
${window.location.origin}/dashboard?id=${cliente.id}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm space-y-4">
      <h3 className="text-white font-bold uppercase text-xs tracking-widest">Ações do Projeto</h3>
      
      <div className="space-y-3">
        <button 
          onClick={handleDownload}
          className="w-full bg-orange-500 hover:bg-white text-black p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
        >
          <Download size={16} /> Baixar Ficha Técnica
        </button>
        
        <button 
          onClick={gerarWhatsApp}
          className="w-full bg-[#161616] border border-orange-500/40 text-orange-400 hover:bg-orange-500 hover:text-black p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
        >
          <Share2 size={16} /> Compartilhar via WhatsApp
        </button>
      </div>
    </div>
  );
};