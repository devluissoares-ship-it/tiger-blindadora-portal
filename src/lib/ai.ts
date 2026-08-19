/**
 * Motor de IA da Tiger Blindadora.
 * Gerencia a comunicação entre o frontend e o processamento de linguagem natural.
 */
export async function gerarExplicacaoEtapa(pergunta: string, cliente: any, isUserAdmin: boolean = false): Promise<string> {
  try {
    // 1. Estruturação do contexto completo alinhado com o banco e front-end
    const context = {
      cliente: cliente.nome,
      veiculo: cliente.modelo || cliente.veiculo,
      blindagem: cliente.nivelBlindagem || cliente.nivel_blindagem || 'Não especificada',
      status: cliente.status,
      progresso: cliente.progresso || 0,
      revisao: {
        tipo: cliente.tipoRevisao || 'N/A',
        data: cliente.dataRevisao || 'N/A'
      },
      perfil: isUserAdmin ? 'ADMIN' : 'CLIENTE',
      pergunta: pergunta,
      checklistEntrada: cliente.checklist_entrada || null,
      fotosEntrada: cliente.fotos_entrada || []
    };

    // 2. Chamada de rede otimizada
    const response = await fetch('/api/chat-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pergunta: pergunta,
        contexto: context,
        historico: cliente.historicoEventos || cliente.historico_fotos || []
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.text || "Tiger Blindadora: Processo em andamento com excelência técnica.";
    
  } catch (error) {
    console.error("Erro no processamento da IA Tiger:", error);
    
    // 3. Fallback inteligente (se a IA cair, o sistema responde com dados reais do objeto cliente)
    return `Olá! Seu veículo (${cliente.modelo || cliente.veiculo}) encontra-se atualmente na etapa: ${cliente.status} (${cliente.progresso || 0}% concluído). Caso precise de mais detalhes técnicos, nossa equipe está pronta para lhe atender.`;
  }
}