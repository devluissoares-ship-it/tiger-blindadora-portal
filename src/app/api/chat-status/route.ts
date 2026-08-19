import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pergunta, historico } = body; // O painel admin envia 'historico'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Use o modelo novo aqui também
        messages: [
          { role: "system", content: "Você é o assistente técnico da Tiger Blindadora." },
          ...(historico || []), // Mantém o histórico que o painel envia
          { role: "user", content: pergunta }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ text: "Erro no Admin AI" }, { status: 400 });
  }
}