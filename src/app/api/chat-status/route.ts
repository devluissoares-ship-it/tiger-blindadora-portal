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

    const { pergunta, historico, nomeCliente, progresso, contexto } = body || {};

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "⚠️ Chave GROQ_API_KEY não configurada nas variáveis de ambiente." },
        { status: 500 }
      );
    }

    const clienteNome = nomeCliente || "Cliente";
    const veiculoNome = contexto?.veiculo || "veículo";
    const statusAtual = contexto?.status || "Andamento";
    const progressoAtual = progresso || 0;

    // Define o prompt enviado para a IA
    const textoFinal = pergunta || `Explique de forma curta e educada para o cliente ${clienteNome} a etapa atual "${statusAtual}" do veículo ${veiculoNome} (${progressoAtual}% concluído).`;

    const systemInstruction = `Você é o assistente técnico oficial da Tiger Blindadora. 
REGRAS OBRIGATÓRIAS:
1. Seja sempre cordial e chame o cliente pelo nome.
2. NUNCA utilize tabelas em Markdown (proibido usar '|' ou linhas divisórias).
3. Seja direto ao ponto: dê uma resposta limpa, resumida e elegante, evitando blocos de texto gigantescos.
4. Explique a etapa ou o checklist de entrada de forma fluida usando parágrafos curtos.`;

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
          { role: "user", content: textoFinal }
        ],
        temperature: 0.3
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