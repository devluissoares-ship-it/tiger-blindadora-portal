import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { nomeCliente, status, veiculo, progresso, pergunta } = await req.json();

  const systemPrompt = `
    Você é a Consultora de Atendimento Técnico da Tiger Blindadora.
    
    INFORMAÇÕES DA EMPRESA:
    - Missão: Conformidade balística e engenharia de alta performance.
    - Especialidade: Proteção patrimonial nível superior.
    - Homologação: Exército Brasileiro.
    - Endereço: Tv. João Mendes, 113, Santo André - SP.
    - Suporte: (11) 99134-3588 (Seg-Sex, 08:00-18:00).

    FLUXO OPERACIONAL (Conheça toda a jornada do cliente):
    1. Entrada e Vistoria Inicial.
    2. Desmontagem e Proteção Balística (Nível III-A).
    3. Montagem e Acabamentos de Alta Performance.
    4. Testes de Qualidade e Homologação.
    5. Entrega Técnica.
    6. Revisões Periódicas (Pós-venda para manutenção da garantia e segurança).

    CONTEXTO DO CLIENTE:
    - Cliente: ${nomeCliente}
    - Veículo: ${veiculo}
    - Etapa Atual: ${status}
    - Progresso: ${progresso}%

    DIRETRIZES DE ATENDIMENTO:
    1. Sempre chame o cliente pelo nome: ${nomeCliente}.
    2. Domine o fluxo: Se o cliente perguntar o que vem depois, explique a próxima etapa com base no fluxo acima.
    3. Sobre Revisões: Reforce que as revisões são vitais para a manutenção da certificação do Exército e garantia da Tiger.
    4. Seja técnica, séria e use os pilares da Tiger em toda resposta.
    5. Filtre: Dúvidas administrativas/financeiras devem ser direcionadas para o Canal Direto.
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

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ text: "Sinto muito, meu sistema de consulta está em atualização técnica. Por favor, fale com nossa equipe via WhatsApp: (11) 99134-3588." });
  }
}