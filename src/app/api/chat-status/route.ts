import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { text: "Sinto muito, não consegui processar os dados da sua requisição. Verifique as informações enviadas e tente novamente." },
        { status: 400 }
      );
    }

    const { 
      nomeCliente = "Cliente", 
      status = "Em andamento", 
      veiculo = "Veículo", 
      progresso = 0, 
      pergunta = "", 
      checklistEntrada = null, 
      fotosEntrada = [] 
    } = body || {};

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: `Sinto muito, ${nomeCliente}, a API da Groq não foi configurada corretamente nas variáveis de ambiente.` },
        { status: 500 }
      );
    }

    let contextoChecklistCliente = "";
    if (checklistEntrada) {
      const obs = typeof checklistEntrada.observacoes === 'string' ? checklistEntrada.observacoes.trim() : "";
      const qtdFotos = Array.isArray(fotosEntrada) ? fotosEntrada.length : 0;
      
      contextoChecklistCliente = `
INFORMAÇÕES DA VISTORIA DE ENTRADA E CHECKLIST:
- O veículo passou pela vistoria inicial com os seguintes status por setor:
  • Lataria: ${checklistEntrada.lataria ? 'Inspecionado e OK' : (obs ? 'Inspecionado com apontamento/observação registrada' : 'Não verificado')}
  • Vidros e Para-brisa: ${checklistEntrada.vidros_e_parabrisa ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Interior e Bancos: ${checklistEntrada.interior_e_bancos ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Painel e Quilometragem: ${checklistEntrada.painel_e_km ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Acessórios e Pertences: ${checklistEntrada.acessorios_e_pertences ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Observações Técnicas Registradas pela Equipe: ${obs || "Nenhuma observação extra registrada."}
- Total de fotos da vistoria de entrada anexadas para conferência visual do cliente: ${qtdFotos} fotos.
`;
    }

    const systemPrompt = `Você é a Consultora de Atendimento Técnico Oficial da Tiger Blindadora. Sua comunicação é impecável, acolhedora, extremamente profissional e voltada à engenharia de alta performance.
- Homologação: Exército Brasileiro.
- Endereço: Tv. João Mendes, 113, Santo André - SP.
- Suporte Oficial: (11) 99134-3588 (Seg-Sex, 08:00-18:00).

CONTEXTO ATUAL DO CLIENTE:
- Cliente: ${nomeCliente}
- Veículo: ${veiculo}
- Etapa Atual do Projeto: ${status}
- Progresso Atual: ${progresso}%
${contextoChecklistCliente}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: pergunta || "Olá, gostaria de saber sobre o status do meu veículo." }
        ],
        temperature: 0.3
      })
    });

    if (response.status === 429) {
      return NextResponse.json(
        { text: `Sinto muito, ${nomeCliente}, nosso sistema de atendimento está com um volume elevado no momento. Tente novamente em instantes.` },
        { status: 429 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { text: `Sinto muito, ${nomeCliente}, não consegui conectar à nossa central. Motivo: ${data?.error?.message || "Erro de resposta da API."}` },
        { status: response.status }
      );
    }

    const respostaTexto = data?.choices?.[0]?.message?.content;

    if (!respostaTexto) {
      return NextResponse.json(
        { text: `Sinto muito, ${nomeCliente}, não recebemos uma resposta válida do assistente.` },
        { status: 500 }
      );
    }

    return NextResponse.json({ text: respostaTexto });

  } catch (error: any) {
    console.error("Erro no processamento da rota:", error);
    return NextResponse.json(
      { text: `Sinto muito, meu sistema de consulta técnica está passando por uma atualização. Fale com nossa equipe via WhatsApp: (11) 99134-3588.` },
      { status: 500 }
    );
  }
}