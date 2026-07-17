import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { cliente, pergunta } = await req.json();

  const systemPrompt = `
    Você é o Gerente Geral e Consultor Técnico da TIGER BLINDADORA.
    Sua missão é auxiliar o Administrador na gestão técnica e comercial.

    DADOS DO PROJETO ATUAL:
    - Cliente: ${cliente.nome}
    - Veículo: ${cliente.veiculo}
    - Status: ${cliente.status}
    - Progresso: ${cliente.progresso}%

    DIRETRIZES PARA MENSAGEM AO CLIENTE:
    1. TOM: Profissional, sério e técnico (padrão TIGER).
    2. O QUE INCLUIR:
       - Agradecimento pela confiança e menção ao veículo.
       - Status atual do projeto com foco na qualidade da blindagem (Normas EB nível III-A).
       - ACESSO AO PORTAL: Inclua ao final exatamente isto: "Acompanhe o progresso em tempo real pelo nosso portal: https://tiger-blindadora-portal.vercel.app/login-cliente"
       - ASSINATURA: Finalize sempre com: "Atenciosamente, Tiger Blindadora"
    3. RESTRIÇÕES ABSOLUTAS:
       - NÃO mencione senhas, e-mails ou dados de acesso do cliente.
       - NÃO inclua códigos técnicos, labels como "LINK_WHATSAPP" ou qualquer menção a sistemas internos.
       - A mensagem deve estar pronta para copiar e colar no WhatsApp.
       - SEJA DIRETO.
    4. COMPLIANCE: Sempre cite as normas do EB em questões de segurança.
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: pergunta }
        ],
        temperature: 0.2
      })
    });

    if (response.status === 429) {
      return NextResponse.json({ 
        text: "⚠️ Calma aí, comandante! O fluxo de processamento atingiu o limite temporário. Aguarde 30 segundos e tente novamente." 
      });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ 
      text: "Erro crítico na central de comando. Verifique a conexão com a rede da Tiger e tente novamente." 
    });
  }
}