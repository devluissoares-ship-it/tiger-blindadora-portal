import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Parsing seguro do corpo da requisição para evitar quebras de JSON vazio
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { text: "⚠️ Requisição inválida: O corpo da mensagem está vazio ou em formato incorreto." },
        { status: 400 }
      );
    }

    const { pergunta, historico } = body || {};

    // 2. Validação da chave de API da Groq nas variáveis de ambiente
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "⚠️ Chave GROQ_API_KEY não configurada nas variáveis de ambiente." },
        { status: 500 }
      );
    }

    // 3. Validação se a pergunta foi enviada
    if (!pergunta) {
      return NextResponse.json(
        { text: "⚠️ O campo 'pergunta' é obrigatório." },
        { status: 400 }
      );
    }

    // 4. Chamada para a API da Groq com o modelo atualizado e suporte a histórico
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Você é o assistente técnico da Tiger Blindadora, especializado em engenharia de alta performance e conformidade balística." },
          ...(Array.isArray(historico) ? historico : []), // Garante que o histórico seja um array válido
          { role: "user", content: pergunta }
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
    console.error("Erro no Admin AI:", error);
    return NextResponse.json(
      { text: `⚠️ Erro interno na central de comando: ${error?.message || "Erro desconhecido."}` },
      { status: 500 }
    );
  }
}