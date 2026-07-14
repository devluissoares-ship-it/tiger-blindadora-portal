// src/lib/ai.ts

/**
 * Função para gerar explicações técnicas da IA da Tiger Blindadora.
 * @param pergunta A dúvida ou comando do usuário
 * @param cliente Objeto completo com dados do cliente e veículo
 * @param isUserAdmin Define o tom de voz da IA (Analítico vs. Consultivo)
 */
export async function gerarExplicacaoEtapa(pergunta: string, cliente: any, isUserAdmin: boolean = false) {
  try {
    // Montamos um contexto rico para a IA decidir o que falar
    // Usamos os dados do cliente para garantir que a IA não alucine
    const context = `
      Contexto Técnico do Veículo:
      - Cliente: ${cliente.nome}
      - Veículo: ${cliente.modelo || cliente.veiculo}
      - Nível de Blindagem: ${cliente.nivelBlindagem || 'Não informado'}
      - Status Atual: ${cliente.status}
      - Próxima Revisão: ${cliente.tipoRevisao || 'Não agendada'} em ${cliente.dataRevisao || 'N/A'}
      - Perfil do Usuário: ${isUserAdmin ? 'ADMIN (Gerente - Seja operacional e técnico)' : 'CLIENTE (Seja consultivo, cordial e transmita segurança)'}
      - Dúvida do Usuário: "${pergunta}"
    `;

    const response = await fetch('/api/chat-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contexto: context, // Enviamos o contexto estruturado para o backend
        pergunta: pergunta,
        nomeCliente: cliente.nome,
        veiculo: cliente.modelo || cliente.veiculo,
        status: cliente.status,
        nivelBlindagem: cliente.nivelBlindagem,
        tipoRevisao: cliente.tipoRevisao,
        isUserAdmin,
        dadosSistema: { historico: cliente.historicoEventos }
      })
    });

    if (!response.ok) throw new Error("Falha ao comunicar com a IA Tiger");

    const data = await response.json();
    return data.text || "Tiger Blindadora: Processo em andamento com excelência técnica.";
    
  } catch (error) {
    console.error("Erro na IA Tiger:", error);
    // Retorno seguro em caso de falha na IA
    return `Olá! Seu veículo encontra-se no status de ${cliente.status}. Para detalhes técnicos específicos, nossa equipe está à disposição.`;
  }
}