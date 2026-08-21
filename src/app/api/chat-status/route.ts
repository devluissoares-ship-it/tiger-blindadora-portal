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

    const { pergunta, historico, nomeCliente, progresso, checklistEntrada, contexto } = body || {};

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
    const progressoAtual = progresso !== undefined ? progresso : 0;

    // Converte o checklist em texto legível caso ele exista no payload
    let checklistInfo = "";
    if (checklistEntrada) {
      try {
        checklistInfo = typeof checklistEntrada === 'string' 
          ? checklistEntrada 
          : JSON.stringify(checklistEntrada, null, 2);
      } catch {
        checklistInfo = "Checklist registrado no sistema.";
      }
    }

    const textoFinal = pergunta || `O veículo ${veiculoNome} está na etapa "${statusAtual}" (${progressoAtual}% concluído). Explique de forma muito curta, elegante e direta o que ocorre nesta etapa, siga estritamente a ordem oficial e, se houver perguntas sobre o checklist de entrada, utilize os dados informados.`;

    // Instrução mestre idêntica à ordem do ProcessSteps.tsx do seu frontend
    const systemInstruction = `Você é o assistente técnico oficial da Tiger Blindadora. 
LISTA OFICIAL DE ETAPAS DO SISTEMA (Siga esta ordem sequencial exata, NUNca pule ou altere):
1. Entrada
2. Desmontagem
3. Estrutura
4. Portas
5. Vidros
6. Acabamento
7. Testes
8. Finalização
9. Entrega

DADOS DE CHECKLIST DE ENTRADA DISPONÍVEIS:
${checklistInfo || "Nenhum checklist detalhado no momento."}

REGRAS DE FORMATAÇÃO E CONDUTA:
- Fale estritamente sobre a etapa atual informada (${statusAtual}). Aponte corretamente qual é a próxima etapa sequencial com base na lista oficial acima.
- Se o usuário perguntar sobre o checklist de entrada, cite os dados informados acima de forma limpa.
- Seja cordial, elegante e chame o cliente pelo nome. Mantenha a resposta curta e direta ao ponto.
- PROIBIDO ABSOLUTAMENTE usar tabelas em Markdown (proibido usar barras verticais | ou traços |---|).
- PROIBIDO usar excesso de hashtags (#) ou símbolos poluidores.
- Termine sempre direcionando o cliente para a equipe de atendimento caso precise de mais suporte.`;

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
        temperature: 0.1
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