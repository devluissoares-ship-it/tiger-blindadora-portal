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
    const statusAtual = contexto?.status || "Em andamento";
    const progressoAtual = progresso || 0;

    const textoFinal = pergunta || `Explique de forma muito resumida, elegante e direta para o cliente ${clienteNome} a etapa atual "${statusAtual}" do veículo ${veiculoNome} (${progressoAtual}% concluído).`;

    const systemInstruction = `Você é o assistente técnico oficial da Tiger Blindadora. 
REGRAS OBRIGATÓRIAS DE FORMATAÇÃO E ESTILO:
1. Seja sempre cordial, elegante e chame o cliente pelo nome logo no início.
2. PROIBIDO ABSOLUTAMENTE usar tabelas em Markdown (como linhas com barras verticais | ou traços |---|).
3. PROIBIDO usar símbolos excessivos como hashtags (#) ou excesso de asteriscos. Mantenha a tipografia limpa.
4. Seja conciso e direto ao ponto: dê uma resposta curta, focada em engenharia balística, sem blocos de texto gigantescos ou listas intermináveis.
5. Termine sempre direcionando o cliente para a nossa equipe de atendimento caso ele precise de mais detalhes.`;

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