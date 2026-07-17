import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportarRelatorioPDF = async (clientes: any[]) => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    // Função para adicionar o rodapé em todas as páginas
    const addFooter = () => {
      doc.setDrawColor(255, 149, 0);
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 20, 196, pageHeight - 20);
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text('Tiger Blindadora | Atendimento: (11) 99134-3588 | Tv. João Mendes, 113 - Santo André - SP', 14, pageHeight - 15);
      doc.text('Homologação Certificada Exército Brasileiro | CNPJ: 09.273.694/0002-96', 14, pageHeight - 11);
    };

    doc.text("RELATÓRIO GERAL DE PROJETOS - TIGER BLINDADORA", 14, 15);

    autoTable(doc, {
      head: [['Cliente', 'Veículo', 'Status', 'Progresso']],
      body: clientes.map(c => [c.nome || '-', c.veiculo || '-', c.status || '-', `${c.progresso || 0}%`]),
      startY: 25,
      theme: 'striped',
      headStyles: { fillColor: [255, 149, 0] },
      didDrawPage: () => addFooter(), // Chama o rodapé ao desenhar a página
      margin: { bottom: 25 }
    });

    doc.save("relatorio-projetos-tiger.pdf");
  } catch (error) {
    console.error("Erro fatal:", error);
  }
};