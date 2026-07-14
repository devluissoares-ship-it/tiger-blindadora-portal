"use client";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Adicionando a interface para o TypeScript não reclamar
interface ReportGeneratorProps {
  cliente: any;
}

export const ReportGenerator = ({ cliente }: ReportGeneratorProps) => {
  
  const gerarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Tiger Blindadora - Relatorio de Projeto", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Cliente: ${cliente.nome}`, 14, 30);
    doc.text(`Veiculo: ${cliente.veiculo}`, 14, 37);
    
    // @ts-ignore
    doc.autoTable({
      startY: 45,
      head: [['Etapa', 'Progresso', 'Status']],
      body: [[cliente.status || "N/A", `${cliente.progresso || 0}%`, cliente.status || "Em andamento"]],
    });

    doc.save(`Relatorio_${cliente.nome.replace(/\s/g, '_')}.pdf`);
  };

  const gerarWhatsApp = () => {
    const texto = `*Tiger Blindadora - Atualização de Projeto*
    
    Olá, *${cliente.nome}*! 🚗
    Temos novidades sobre o seu *${cliente.veiculo}*:
    Status: *${cliente.status}*
    Progresso: *${cliente.progresso}%* concluído.
    
    Acesse seu portal: ${window.location.origin}/portal/${cliente.id}`;

    const urlWa = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(urlWa, '_blank');
  };

  return (
    <div className="space-y-2">
      <button 
        onClick={gerarPDF}
        className="w-full bg-[#ff9500] text-black p-3 rounded-lg text-sm font-bold hover:bg-[#e08400] transition"
      >
        📥 Baixar Relatório em PDF
      </button>
      <button 
        onClick={gerarWhatsApp}
        className="w-full bg-[#111111] border border-[#ff9500] text-[#ff9500] p-3 rounded-lg text-sm font-bold hover:bg-[#ff9500] hover:text-black transition flex items-center justify-center gap-2"
      >
        📋 Enviar Relatório via WhatsApp
      </button>
    </div>
  );
};