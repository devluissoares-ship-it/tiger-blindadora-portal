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
    <div className="space-y-3 bg-[#111] p-6 rounded-2xl border border-[#222]">
      <h3 className="text-white font-bold mb-4 uppercase text-sm">Ações do Projeto</h3>
      <button 
        onClick={handleDownload}
        className="w-full bg-[#ff9500] hover:bg-[#e68600] text-black p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Download size={18} /> Baixar Ficha Técnica
      </button>
      
      <button 
        onClick={gerarWhatsApp}
        className="w-full bg-[#050505] border border-[#ff9500] text-[#ff9500] hover:bg-[#ff9500] hover:text-black p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Share2 size={18} /> Compartilhar via WhatsApp
      </button>
    </div>
  );
};