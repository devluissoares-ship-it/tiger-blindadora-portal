import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      pergunta,
      nomeCliente, 
      veiculo, 
      status, 
      nivelBlindagem, 
      tipoRevisao, 
      dataRevisao,
      isUserAdmin 
    } = body;

    // Sanitização para evitar erros de leitura na template literal
    const context = {
      cliente: nomeCliente || "Cliente",
      veiculo: veiculo || "Veículo não especificado",
      status: status || "Em processamento",
      blindagem: nivelBlindagem || "Nível não informado",
      revisao: `${tipoRevisao || "Revisão"} em ${dataRevisao || "data a definir"}`
    };

    const systemPrompt = `
      Você é o Agente Especialista da Tiger Blindadora.
      
      CONTEXTO TÉCNICO:
      - Data atual: 13/07/2026.
      - Cliente: ${context.cliente} | Veículo: ${context.veiculo} | Blindagem: ${context.blindagem}
      - Status do Projeto: ${context.status}
      - Revisão Agendada: ${context.revisao}
      
      DIRETRIZES:
      1. NÃO ALUCINE: Se não souber, peça para o consultor técnico entrar em contato.
      2. TONE: 
         - Se isUserAdmin é ${isUserAdmin ? "verdadeiro" : "falso"}, responda como ${isUserAdmin ? "Gerente Técnico Operacional (direto/técnico)" : "Consultor de Luxo (polido/seguro)"}.
      3. FORMATO: Máximo de 3 frases curtas. Profissionalismo Tiger Blindadora.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: pergunta || `Explique o status atual: ${context.status}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // Mantido baixo para precisão
      max_tokens: 300   // Limite para garantir rapidez na resposta
    });

    return NextResponse.json({ 
      text: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error("Erro na API Tiger Tech:", error);
    return NextResponse.json(
      { error: "Falha na resposta da IA Tiger" }, 
      { status: 500 }
    );
  }
}