import { jsPDF } from "jspdf";

export const exportarFichaTecnicaPDF = (cliente: any) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  let currentY = 15;

  // Função para verificar quebra de página automática e manter o rodapé seguro
  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > 270) {
      addFooter();
      doc.addPage();
      currentY = 20; // Reseta Y no topo da nova página
    }
  };

  // Cabeçalho Premium
  doc.setFillColor(255, 149, 0);
  doc.rect(0, 0, 210, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("TIGER BLINDADORA", 14, 11);
  doc.setFontSize(10);
  doc.text("FICHA TÉCNICA DE PROJETO E CONFORMIDADE", 14, 18);
  
  currentY = 35;

  // Informações do Cliente & Status
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do Projeto", 14, currentY);
  doc.setDrawColor(255, 149, 0);
  doc.line(14, currentY + 2, 196, currentY + 2);

  currentY += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Cliente: ${cliente.nome || 'N/D'}`, 14, currentY);
  doc.text(`Veículo: ${cliente.veiculo || 'N/D'}`, 110, currentY);
  
  currentY += 6;
  doc.text(`Etapa Atual: ${cliente.status || 'N/D'}`, 14, currentY);
  doc.text(`Progresso: ${cliente.progresso || 0}%`, 110, currentY);

  currentY += 12;

  // CHECKLIST E VISTORIA DE ENTRADA (Fixo, nunca some)
  if (cliente.checklist_entrada) {
    checkPageBreak(45);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Vistoria e Checklist de Entrada", 14, currentY);
    doc.setDrawColor(255, 149, 0);
    doc.line(14, currentY + 2, 196, currentY + 2);

    currentY += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const check = cliente.checklist_entrada;
    const items = [
      { label: "Lataria (Riscos/Amassados)", val: check.lataria },
      { label: "Vidros e Para-brisa", val: check.vidros_e_parabrisa },
      { label: "Interior e Bancos", val: check.interior_e_bancos },
      { label: "Painel e Quilometragem", val: check.painel_e_km },
      { label: "Acessórios e Pertences", val: check.acessorios_e_pertences },
    ];

    items.forEach((item, index) => {
      const xPos = index % 2 === 0 ? 14 : 110;
      if (index % 2 === 0 && index > 0) currentY += 6;
      
      const statusText = item.val ? "[X] Conforme / Verificado" : "[  ] Não verificado / Pendente";
      doc.text(`${item.label}: ${statusText}`, xPos, currentY);
    });

    currentY += 8;
    if (check.observacoes) {
      checkPageBreak(15);
      doc.setFont("helvetica", "bold");
      doc.text("Observações de Entrada:", 14, currentY);
      currentY += 5;
      doc.setFont("helvetica", "normal");
      // Trata textos longos quebrando linhas automaticamente
      const splitObs = doc.splitTextToSize(check.observacoes, 182);
      doc.text(splitObs, 14, currentY);
      currentY += (splitObs.length * 5) + 4;
    }
    currentY += 6;
  }

  // HISTÓRICO DE EVOLUÇÃO E ETAPAS (De ponta a ponta)
  if (cliente.historico_fotos && cliente.historico_fotos.length > 0) {
    checkPageBreak(20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Histórico de Evolução do Projeto", 14, currentY);
    doc.setDrawColor(255, 149, 0);
    doc.line(14, currentY + 2, 196, currentY + 2);

    currentY += 10;

    cliente.historico_fotos.forEach((f: any, idx: number) => {
      checkPageBreak(18);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(200, 100, 0);
      const tituloEtapa = f.titulo || f.etapa || `Atualização ${idx + 1}`;
      doc.text(`• ${tituloEtapa.toUpperCase()}`, 14, currentY);
      
      currentY += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);

      if (f.descricao) {
        const splitDesc = doc.splitTextToSize(f.descricao, 182);
        doc.text(splitDesc, 14, currentY);
        currentY += (splitDesc.length * 5) + 4;
      } else {
        doc.text("Sem descrição detalhada para esta etapa.", 14, currentY);
        currentY += 8;
      }
    });
  }

  // Rodapé Institucional Fixo
  const addFooter = () => {
    const footerY = 282;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, footerY - 4, 196, footerY - 4);
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Tiger Blindadora | Operando sob os mais rígidos pilares de conformidade balística.', 14, footerY);
    doc.text('Atendimento Técnico: (11) 99134-3588 | Base: Tv. João Mendes, 113 - Santo André - SP', 14, footerY + 3.5);
    doc.text('CNPJ: 09.273.694/0002-96 | Homologação Certificada Exército Brasileiro', 14, footerY + 7);
  };

  addFooter();
  doc.save(`Ficha-Tecnica-${(cliente.nome || 'Cliente').replace(/\s+/g, '-')}.pdf`);
};