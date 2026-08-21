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
    const statusAtual = contexto?.status || "Desmontagem";
    const progressoAtual = progresso || 20;

    const textoFinal = pergunta || `Explique de forma curta, elegante e precisa para o cliente ${clienteNome} a etapa atual "${statusAtual}" do veículo ${veiculoNome} (${progressoAtual}% concluído). Diga o que está sendo feito agora e qual é estritamente a PRÓXIMA etapa do processo de acordo com a ordem oficial da Tiger.`;

    // Instrução mestre atualizada com o fluxo cronológico exato e separado
    const systemInstruction = `Você é o assistente técnico oficial da Tiger Blindadora. 
FLUXO OFICIAL E CRONOLÓGICO DA BLINDAGEM (Siga esta ordem rigorosamente, NUNCA pule ou misture etapas):
1. Vistoria e Checklist de Entrada
2. Desmontagem (retirada de painéis, acabamentos e preparação)
3. Estrutura (aplicação e reforço de aços balísticos e mantas nas colunas e chassi)
4. Portas (blindagem, reforço de dobradiças e ajustes estruturais das portas)
5. Vidros (instalação dos vidros balísticos certificados)
6. Acabamento (recolocação de painéis internos, forros e chicotes elétricos)
7. Testes (testes de infiltração, funcionamento e conformidade balística)
8. Finalização e Entrega (revisão final, limpeza técnica e entrega ao cliente)
9. Revisões Pós-Entrega (Manutenções periódicas: 6 meses, 10.000 km ou anual)

REGRAS DE FORMATAÇÃO OBRIGATÓRIAS:
- Seja cordial e chame o cliente pelo nome.
- NUNCA utilize tabelas em Markdown (proibido usar barras verticais |).
- NUNCA use hashtags (#) em excesso ou símbolos poluidores.
- Seja objetivo, técnico e elegante. Explique o que está acontecendo na etapa atual e aponte corretamente a PRÓXIMA fase de acordo com a lista oficial acima.
- Termine direcionando para o atendimento humano se ele precisar de mais suporte.`;

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
        temperature: 0.2
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