import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Tratamento seguro para parsing do corpo da requisição
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { 
          text: "Sinto muito, não consegui processar os dados da sua requisição. Verifique as informações enviadas e tente novamente." 
        },
        { status: 400 }
      );
    }

    const { 
      nomeCliente = "Cliente", 
      status = "Em andamento", 
      veiculo = "Veículo", 
      progresso = 0, 
      pergunta = "", 
      checklistEntrada = null, 
      fotosEntrada = [] 
    } = body || {};

    // 2. Validação defensiva da chave de API
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          text: `Sinto muito, ${nomeCliente}, a API da Groq não foi configurada corretamente nas variáveis de ambiente.` 
        },
        { status: 500 }
      );
    }

    // 3. Proteção e montagem do contexto do checklist
    let contextoChecklistCliente = "";
    if (checklistEntrada) {
      const obs = typeof checklistEntrada.observacoes === 'string' ? checklistEntrada.observacoes.trim() : "";
      const qtdFotos = Array.isArray(fotosEntrada) ? fotosEntrada.length : 0;
      
      contextoChecklistCliente = `
INFORMAÇÕES DA VISTORIA DE ENTRADA E CHECKLIST:
- O veículo passou pela vistoria inicial com os seguintes status por setor:
  • Lataria: ${checklistEntrada.lataria ? 'Inspecionado e OK' : (obs ? 'Inspecionado com apontamento/observação registrada' : 'Não verificado')}
  • Vidros e Para-brisa: ${checklistEntrada.vidros_e_parabrisa ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Interior e Bancos: ${checklistEntrada.interior_e_bancos ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Painel e Quilometragem: ${checklistEntrada.painel_e_km ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Acessórios e Pertences: ${checklistEntrada.acessorios_e_pertences ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Observações Técnicas Registradas pela Equipe: ${obs || "Nenhuma observação extra registrada."}
- Total de fotos da vistoria de entrada anexadas para conferência visual do cliente: ${qtdFotos} fotos.
- DIRETRIZ DE LEITURA DO CHECKLIST PARA A IA: Se houver observações descritas (ex: risco, detalhe na lataria), NUNCA diga que o item "não foi verificado". Explique com clareza profissional que o item foi inspecionado, que há um registro transparente (como um pequeno risco apontado na vistoria preventiva) e oriente o cliente a conferir as fotos de entrada anexadas no portal para tranquilizá-lo de que é apenas um mapeamento prévio de controle.
`;
    }

    // 4. System Prompt refinado
    const systemPrompt = `Você é a Consultora de Atendimento Técnico Oficial da Tiger Blindadora. Sua comunicação é impecável, acolhedora, extremamente profissional e voltada à engenharia de alta performance.

INFORMAÇÕES DA EMPRESA:
- Missão: Conformidade balística e engenharia de alta performance.
- Especialidade: Proteção patrimonial nível superior.
- Homologação: Exército Brasileiro.
- Endereço: Tv. João Mendes, 113, Santo André - SP.
- Suporte Oficial: (11) 99134-3588 (Seg-Sex, 08:00-18:00).

FLUXO OPERACIONAL COMPLETO DA TIGER (Domine do início ao fim):
1. Entrada e Vistoria Inicial (Conferência de itens, checklist de recebimento e registro fotográfico).
2. Desmontagem (Retirada técnica de acabamentos, bancos e painéis com cuidado minucioso).
3. Estrutura (Aplicação de aço balístico e mantas de alta resistência nas colunas, portas e tetos).
4. Portas (Reforço estrutural nas dobradiças, pinos de sustentação e vidros balísticos das portas).
5. Vidros (Instalação de vidros balísticos de alta performance com homologação balística).
6. Acabamento (Remontagem interna com encaixes perfeitos, sem ruídos ou folgas, padrão original).
7. Testes (Testes rigorosos de infiltração, funcionamento elétrico, vidros e acabamento dinâmico).
8. Finalização (Limpeza técnica detalhada, checagem de qualidade final e prontidão para entrega).
9. Entrega Técnica (Apresentação do veículo blindado, documentação e manual ao proprietário).
10. Revisões Periódicas (Pós-venda fundamental aos 6 meses, 10.000km e Anual para manutenção da garantia e certificação do Exército).

CONTEXTO ATUAL DO CLIENTE:
- Cliente: ${nomeCliente}
- Veículo: ${veiculo}
- Etapa Atual do Projeto: ${status}
- Progresso Atual: ${progresso}%
${contextoChecklistCliente}

DIRETRIZES RÍGIDAS DE ATENDIMENTO:
1. Personalização: Sempre chame o cliente pelo nome (${nomeCliente}) no início da resposta.
2. Clareza de Etapa: Explique em que pé está o projeto. Se estiver na Entrada, comente com tranquilidade sobre a vistoria, as fotos e o checklist de forma transparente. Se o cliente perguntar o que vem a seguir, cite a próxima etapa exata do fluxo operacional listado acima.
3. Interpretação Inteligente do Checklist: Siga estritamente a diretriz descrita no bloco de checklist acima. Nunca diga que um item não foi verificado se há uma observação ou contexto preenchido; trate o apontamento como uma vistoria preventiva transparente e sugira olhar as fotos.
4. Revisões e Pós-venda: Se houver dúvidas sobre revisões, explique com firmeza que o acompanhamento periódico (6 meses / 10k km / Anual) é obrigatório e vital para garantir a segurança balística e a garantia Tiger.
5. Tom de Voz: Seja técnica, polida, tranquilizadora e firme. Evite respostas genéricas.
6. Direcionamento: Questões financeiras, comerciais ou de prazos contratuais complexos devem ser educadamente direcionadas para o nosso Canal de Atendimento Direto no WhatsApp: (11) 99134-3588.`;

    // 5. Chamada para a API Groq com modelo llama-3.3-70b-versatile
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: pergunta || "Olá, gostaria de saber sobre o status do meu veículo." }
        ],
        temperature: 0.3
      })
    });

    // Tratamento específico para limite de requisições (429)
    if (response.status === 429) {
      return NextResponse.json(
        { 
          text: `Sinto muito, ${nomeCliente}, nosso sistema de atendimento está com um volume elevado no momento. Por favor, aguarde alguns instantes e tente novamente.` 
        },
        { status: 429 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da Groq no Chat do Cliente:", data);
      return NextResponse.json(
        { 
          text: `Sinto muito, ${nomeCliente}, não consegui conectar à nossa central. Motivo: ${data?.error?.message || "Erro de resposta da API."}` 
        },
        { status: response.status }
      );
    }

    const respostaTexto = data?.choices?.[0]?.message?.content;

    if (!respostaTexto) {
      return NextResponse.json(
        { 
          text: `Sinto muito, ${nomeCliente}, não recebemos uma resposta válida do assistente. Por favor, tente novamente em instantes.` 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: respostaTexto });

  } catch (error: any) {
    console.error("Erro no processamento da rota:", error);
    return NextResponse.json(
      { 
        text: `Sinto muito, meu sistema de consulta técnica está passando por uma atualização de rotina neste exato momento. Por favor, fale diretamente com nossa equipe via WhatsApp: (11) 99134-3588.` 
      },
      { status: 500 }
    );
  }
}