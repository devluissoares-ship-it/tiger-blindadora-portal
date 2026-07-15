/**
 * Motor de IA da Tiger Blindadora.
 * Gerencia a comunicação entre o frontend e o processamento de linguagem natural.
 */
export async function gerarExplicacaoEtapa(pergunta: string, cliente: any, isUserAdmin: boolean = false): Promise<string> {
  try {
    // 1. Estruturação do contexto (Separado para facilitar a manutenção do Prompt)
    const context = {
      cliente: cliente.nome,
      veiculo: cliente.modelo || cliente.veiculo,
      blindagem: cliente.nivelBlindagem || 'Não especificada',
      status: cliente.status,
      revisao: {
        tipo: cliente.tipoRevisao || 'N/A',
        data: cliente.dataRevisao || 'N/A'
      },
      perfil: isUserAdmin ? 'ADMIN' : 'CLIENTE',
      pergunta: pergunta
    };

    // 2. Chamada de rede otimizada
    const response = await fetch('/api/chat-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contexto: context,
        historico: cliente.historicoEventos || []
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
    return `Olá! Seu veículo (${cliente.modelo || cliente.veiculo}) encontra-se atualmente no status: ${cliente.status}. Caso precise de mais detalhes técnicos, nossa equipe está pronta para lhe atender.`;
  }
}