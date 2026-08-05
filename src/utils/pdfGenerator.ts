import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const exportarRelatorioPDF = async (clientes: any[]) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.height;

    // Função para adicionar o rodapé institucional em todas as páginas
    const addFooter = () => {
      doc.setDrawColor(255, 149, 0);
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 18, 196, pageHeight - 18);
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text('Tiger Blindadora | Operando sob os mais rígidos pilares de conformidade balística.', 14, pageHeight - 13);
      doc.text('Atendimento Técnico: (11) 99134-3588 | Tv. João Mendes, 113 - Santo André - SP', 14, pageHeight - 9);
      doc.text('Homologação Certificada Exército Brasileiro | CNPJ: 09.273.694/0002-96', 14, pageHeight - 5);
    };

    // Cabeçalho institucional elegante no topo da primeira página
    doc.setFillColor(255, 149, 0);
    doc.rect(0, 0, 210, 26, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TIGER BLINDADORA", 14, 11);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("RELATÓRIO GERAL DE PROJETOS E CONFORMIDADE", 14, 18);

    // Tabela detalhada dos projetos cadastrados
    autoTable(doc, {
      head: [['Cliente', 'Veículo', 'Status Atual', 'Progresso']],
      body: clientes.map(c => [
        c.nome || '-', 
        c.veiculo || '-', 
        c.status || '-', 
        `${c.progresso || 0}%`
      ]),
      startY: 34,
      theme: 'striped',
      headStyles: { 
        fillColor: [255, 149, 0], 
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [40, 40, 40]
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      didDrawPage: () => addFooter(),
      margin: { left: 14, right: 14, bottom: 25 }
    });

    // Nome do arquivo gerado com data atual limpa
    const dataAtual = new Date().toISOString().slice(0, 10);
    doc.save(`Relatorio-Geral-Tiger-${dataAtual}.pdf`);
  } catch (error) {
    console.error("Erro fatal ao gerar relatório em PDF:", error);
  }
};