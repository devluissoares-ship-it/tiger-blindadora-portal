"use client";

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Share2 } from 'lucide-react';

interface ReportGeneratorProps {
  cliente: any;
}

export const ReportGenerator = ({ cliente }: ReportGeneratorProps) => {
  
  const gerarPDF = () => {
    const doc = new jsPDF();
    
    // Configuração visual do PDF
    doc.setFillColor(255, 149, 0); // Laranja Tiger
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text("TIGER BLINDADORA", 14, 18);
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE ACOMPANHAMENTO TÉCNICO", 14, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(`Cliente: ${cliente.nome}`, 14, 45);
    doc.text(`Veículo: ${cliente.veiculo}`, 14, 52);
    
    // @ts-ignore
    doc.autoTable({
      startY: 60,
      head: [['Etapa do Projeto', 'Progresso', 'Status Atual']],
      body: [[cliente.status || "Análise", `${cliente.progresso || 0}%`, "Em execução"]],
      headStyles: { fillColor: [255, 149, 0] },
    });

    doc.save(`Relatorio_${cliente.nome.replace(/\s/g, '_')}.pdf`);
  };

  const gerarWhatsApp = () => {
    const texto = `*TIGER BLINDADORA - Atualização de Projeto*

Olá, *${cliente.nome}*! 🚗
Temos novidades sobre o seu *${cliente.veiculo}*:

✅ Status: *${cliente.status}*
📈 Progresso: *${cliente.progresso}%*

Acompanhe os detalhes em tempo real pelo nosso portal oficial:
${window.location.origin}/portal/${cliente.id}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={gerarPDF}
        className="w-full bg-[#ff9500] hover:bg-[#e68600] text-black p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Download size={18} /> Baixar Relatório PDF
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