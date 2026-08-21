import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { text: "⚠️ Requisição inválida: O corpo da mensagem está vazio ou em formato incorreto." },
        { status: 400 }
      );
    }

    const { pergunta, historico, nomeCliente, status, veiculo, progresso } = body || {};

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "⚠️ Chave GROQ_API_KEY não configurada nas variáveis de ambiente." },
        { status: 500 }
      );
    }

    // Monta a instrução de forma inteligente com base no que o usuário fez
    let textoFinal = pergunta;
    if (!textoFinal) {
      // Se clicou em "Explicar Etapa Atual", gera o prompt automático do status atual
      textoFinal = `Explique de forma clara, profissional e acolhedora para o cliente ${nomeCliente || "Cliente"} o que está acontecendo na etapa atual do veículo ${veiculo || "veículo"}. O carro está na fase "${status || "Em andamento"}" com ${progresso || 0}% de conclusão do processo na Tiger Blindadora.`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "Você é o assistente técnico oficial da Tiger Blindadora, especializado em engenharia de alta performance e conformidade balística. Seja cordial, técnico e direto ao ponto." },
          ...(Array.isArray(historico) ? historico : []),
          { role: "user", content: textoFinal }
        ],
        temperature: 0.3
      })
    });

    if (response.status === 429) {
      return NextResponse.json(
        { text: "⚠️ O limite temporário de requisições foi atingido. Aguarde alguns segundos e tente novamente." },
        { status: 429 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { text: `⚠️ Erro na API Groq (${response.status}): ${data?.error?.message || "Falha ao processar a resposta."}` },
        { status: response.status }
      );
    }

    const respostaTexto = data?.choices?.[0]?.message?.content;

    if (!respostaTexto) {
      return NextResponse.json(
        { text: "⚠️ A IA não retornou um conteúdo válido. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: respostaTexto });

  } catch (error: any) {
    console.error("Erro na API de Chat:", error);
    return NextResponse.json(
      { text: `⚠️ Erro interno na central de comando: ${error?.message || "Erro desconhecido."}` },
      { status: 500 }
    );
  }
}