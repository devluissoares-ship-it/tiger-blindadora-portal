import { jsPDF } from "jspdf";

export const exportarFichaTecnicaPDF = (cliente: any) => {
  const doc = new jsPDF('p', 'mm', 'a4');

  // Cabeçalho Premium
  doc.setFillColor(255, 149, 0);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("TIGER BLINDADORA", 14, 18);
  doc.setFontSize(12);
  doc.text("FICHA TÉCNICA DE PROJETO E CONFORMIDADE", 14, 25);

  // Informações do Cliente
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Dados do Cliente", 14, 45);
  doc.setDrawColor(255, 149, 0);
  doc.line(14, 47, 196, 47);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${cliente.nome}`, 14, 55);
  doc.text(`Veículo: ${cliente.veiculo}`, 14, 62);
  doc.text(`Status: ${cliente.status}`, 14, 69);
  doc.text(`Progresso: ${cliente.progresso}%`, 14, 76);

  // Rodapé Institucional (como você pediu)
  const addFooter = () => {
    const footerY = 280;
    doc.setDrawColor(255, 149, 0);
    doc.line(14, footerY - 5, 196, footerY - 5);
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text('Tiger Blindadora | Operando sob os mais rígidos pilares de conformidade balística.', 14, footerY);
    doc.text('Atendimento Técnico: (11) 99134-3588 | Base: Tv. João Mendes, 113 - Santo André - SP', 14, footerY + 4);
    doc.text('CNPJ: 09.273.694/0002-96 | Homologação Certificada Exército Brasileiro', 14, footerY + 8);
  };

  addFooter();
  doc.save(`Ficha-${cliente.nome.replace(/\s+/g, '-')}.pdf`);
};