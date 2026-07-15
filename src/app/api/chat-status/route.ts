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

    // Sanitização e formatação eficiente
    const cliente = nomeCliente || "Cliente";
    const veiculoNome = veiculo || "Veículo não especificado";
    const statusAtual = status || "Em processamento";
    const blindagem = nivelBlindagem || "Nível não informado";
    const revisao = `${tipoRevisao || "Revisão"} em ${dataRevisao || "data a definir"}`;
    
    // Prompt enxuto para a IA processar mais rápido
    const systemPrompt = `
      Você é a IA da Tiger Blindadora.
      Dados: Cliente:${cliente}|Carro:${veiculoNome}|Status:${statusAtual}|Nível:${blindagem}|Revisão:${revisao}.
      Diretriz: ${isUserAdmin ? "Gerente Técnico (Direto e técnico)." : "Consultor de Luxo (Polido e seguro)."}
      Regra: Máximo 3 frases. Profissionalismo Tiger. NÃO ALUCINE.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: pergunta || `Status atual: ${statusAtual}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Reduzi para 0.1 para maior precisão e rapidez
      max_tokens: 150   // Reduzi tokens: resposta mais curta = resposta mais rápida
    });

    return NextResponse.json({ 
      text: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error("Erro na API Tiger Tech:", error);
    return NextResponse.json(
      { error: "Falha na resposta do Agente Tiger" }, 
      { status: 500 }
    );
  }
}