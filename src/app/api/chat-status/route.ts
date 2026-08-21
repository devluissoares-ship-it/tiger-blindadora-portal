import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { text: "⚠️ Requisição inválida: O corpo da mensagem está vazio." },
        { status: 400 }
      );
    }

    const { pergunta, historico, nomeCliente, progresso, checklistEntrada, contexto } = body || {};

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "⚠️ Chave GROQ_API_KEY não configurada nas variáveis de ambiente." },
        { status: 500 }
      );
    }

    const clienteNome = nomeCliente || "Cliente";
    const veiculoNome = contexto?.veiculo || "veículo";
    const statusAtual = contexto?.status || "Desmontagem";
    const progressoAtual = progresso !== undefined ? progresso : 0;

    // Organiza os dados do checklist de entrada para a IA conseguir explicar perfeitamente
    let checklistInfo = "Nenhum detalhe extra informado.";
    if (checklistEntrada) {
      try {
        checklistInfo = typeof checklistEntrada === 'string' 
          ? checklistEntrada 
          : JSON.stringify(checklistEntrada, null, 2);
      } catch {
        checklistInfo = "Checklist padrão registrado na entrada.";
      }
    }

    const textoUsuario = pergunta || `Explique a etapa ${statusAtual} do veículo ${veiculoNome}.`;

    // Instrução mestre que garante flexibilidade para tirar dúvidas e explicar o checklist com precisão
    const systemInstruction = `Você é o consultor técnico especialista oficial da Tiger Blindadora.
CONTEXTO ATUAL DO VEÍCULO:
- Cliente: ${clienteNome}
- Veículo: ${veiculoNome}
- Etapa Atual: ${statusAtual} (${progressoAtual}% de conclusão)
- Dados do Checklist e Vistoria de Entrada: ${checklistInfo}

MATRIZ OFICIAL DE ETAPAS DA TIGER (Para sua referência cronológica):
1. Entrada
2. Desmontagem
3. Estrutura
4. Portas
5. Vidros
6. Acabamento
7. Testes
8. Finalização
9. Entrega
(As revisões periódicas ocorrem após a entrega: 6 meses, 10.000 km ou anual).

DIRETRIZES DE ATENDIMENTO E DIÁLOGO:
1. Seja flexível, inteligente e converse abertamente com o cliente. Se ele fizer uma pergunta específica sobre o carro, peças, prazos, tipos de blindagem ou sobre o checklist de entrada, responda com precisão técnica usando os dados fornecidos.
2. Chame sempre o cliente pelo nome de forma cordial e elegante.
3. Mantenha as respostas objetivas e em parágrafos fluidos ou listas simples (sem blocos gigantescos de texto).
4. PROIBIDO ABSOLUTAMENTE usar tabelas em Markdown (proibido usar barras verticais | ou traços de tabela |---|).
5. PROIBIDO usar excesso de hashtags (#) ou símbolos poluidores.
6. Sempre encerre a resposta cordialmente, colocando-se à disposição e direcionando para a equipe de atendimento humano caso o cliente precise de um suporte mais aprofundado.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemInstruction },
          ...(Array.isArray(historico) ? historico : []),
          { role: "user", content: textoUsuario }
        ],
        temperature: 0.3 // Um pouco mais flexível para permitir um diálogo natural, mantendo o rigor técnico
      })
    });

    if (response.status === 429) {
      return NextResponse.json(
        { text: "⚠️ Muitas requisições no momento. Aguarde alguns segundos." },
        { status: 429 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { text: `⚠️ Erro na comunicação com a IA: ${data?.error?.message || "Tente novamente."}` },
        { status: response.status }
      );
    }

    const respostaTexto = data?.choices?.[0]?.message?.content;

    if (!respostaTexto) {
      return NextResponse.json(
        { text: "⚠️ A IA não retornou um conteúdo válido." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: respostaTexto });

  } catch (error: any) {
    console.error("Erro na API de Chat:", error);
    return NextResponse.json(
      { text: `⚠️ Erro interno na central de comando.` },
      { status: 500 }
    );
  }
}