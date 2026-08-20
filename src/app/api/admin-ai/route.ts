import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Parsing seguro do corpo da requisição
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { text: "⚠️ Requisição inválida: O corpo da mensagem está vazio ou em formato incorreto." },
        { status: 400 }
      );
    }

    const { cliente, pergunta, historico } = body || {};

    // 2. Validação da chave de API da Groq
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: "⚠️ Chave GROQ_API_KEY não configurada nas variáveis de ambiente da Vercel." },
        { status: 500 }
      );
    }

    // 3. Montagem do contexto do checklist com proteção para valores nulos/indefinidos
    const statusAtual = cliente?.status || "Em andamento";
    
    let contextoChecklist = "";
    if (cliente?.checklist_entrada) {
      const chk = cliente.checklist_entrada;
      const obs = typeof chk.observacoes === 'string' ? chk.observacoes.trim() : "";
      
      contextoChecklist = `
CHECKLIST DE VISTORIA DE ENTRADA (REGISTRO TÉCNICO):
- Status por setor inspecionado:
  • Lataria: ${chk.lataria ? 'Inspecionado e OK' : (obs ? 'Inspecionado com apontamento/observação registrada' : 'Não verificado')}
  • Vidros e Para-brisa: ${chk.vidros_e_parabrisa ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Interior e Bancos: ${chk.interior_e_bancos ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Painel e Quilometragem: ${chk.painel_e_km ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Acessórios e Pertences: ${chk.acessorios_e_pertences ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
  • Observações Técnicas Registradas: ${obs || "Nenhuma observação extra registrada."}
- Quantidade de fotos de vistoria de entrada anexadas: ${Array.isArray(cliente.fotos_entrada) ? cliente.fotos_entrada.length : 0} fotos.
- DIRETRIZ DE LEITURA DO CHECKLIST PARA O ADMIN: Se houver observações descritas (ex: risco, detalhe na lataria), nunca trate o item como "não verificado". Explique que o item foi inspecionado, que há um registro transparente para o cliente e que as fotos servem de apoio visual preventivo.
`;
    }

    const veiculoNome = cliente?.veiculo || cliente?.modelo || "Veículo";
    const nomeCliente = cliente?.nome || "Cliente";
    const progressoAtual = cliente?.progresso ?? 0;

    // 4. System Prompt refinado
    const systemPrompt = `Você é o Gerente Geral e Consultor Técnico Oficial da TIGER BLINDADORA.
Sua missão é auxiliar o Administrador na gestão técnica e comercial, redigindo mensagens prontas, profissionais e humanizadas para envio via WhatsApp aos clientes.

INFORMAÇÕES DA EMPRESA:
- Missão: Conformidade balística e engenharia de alta performance.
- Especialidade: Proteção patrimonial nível superior.
- Homologação: Exército Brasileiro (EB).
- Endereço: Tv. João Mendes, 113, Santo André - SP.

FLUXO OPERACIONAL COMPLETO DA TIGER:
1. Entrada e Vistoria Inicial (Checklist e fotos de recebimento)
2. Desmontagem (Retirada técnica de acabamentos)
3. Estrutura (Aplicação de aço balístico e mantas)
4. Portas (Reforço em dobradiças e vidros balísticos)
5. Vidros (Instalação de vidros balísticos homologados)
6. Acabamento (Remontagem interna padrão original)
7. Testes (Testes de infiltração, elétricos e dinâmicos)
8. Finalização (Limpeza técnica e checagem de qualidade)
9. Entrega Técnica (Apresentação do veículo blindado)
10. Revisões Periódicas (Pós-venda obrigatório aos 6 meses, 10.000km e Anual)

DADOS DO PROJETO ATUAL:
- Cliente: ${nomeCliente}
- Veículo: ${veiculoNome}
- Status Atual: ${statusAtual}
- Progresso Atual: ${progressoAtual}%
${contextoChecklist}

DIRETRIZES RÍGIDAS PARA A MENSAGEM AO CLIENTE:
1. TOM: Profissional, sério, transparente e técnico (padrão TIGER).
2. CONTEÚDO OBRIGATÓRIO:
   - Agradecimento pela confiança e citação correta do veículo (${veiculoNome}).
   - Status atual do projeto com foco na qualidade da blindagem (Normas EB nível III-A).
   - Se o projeto estiver na fase de ENTRADA, mencione com transparência que a vistoria inicial foi realizada, cite as observações do checklist (se houver, de forma polida) e recomende que o cliente verifique as fotos no portal.
   - Se o projeto já passou da entrada, foque exclusivamente no progresso atual e na nova fase, IGNORANDO qualquer menção ao checklist inicial.
   - LINK DO PORTAL (obrigatório ao final): "Acompanhe o progresso em tempo real pelo nosso portal: https://tiger-blindadora-portal.vercel.app/login-cliente"
   - ASSINATURA (obrigatória ao final): "Atenciosamente, Tiger Blindadora"
3. RESTRIÇÕES ABSOLUTAS:
   - NÃO mencione senhas, e-mails ou credenciais de acesso.
   - NÃO inclua códigos, marcações Markdown extras desnecessárias ou labels como "LINK_WHATSAPP".
   - A mensagem deve vir 100% pronta para copiar e colar no WhatsApp.
   - Seja direto, objetivo e profissional.
4. COMPLIANCE: Sempre cite o rigor de normas do Exército Brasileiro (EB) para homologação balística.`;

    // 5. Chamada para a API Groq com o modelo atualizado (openai/gpt-oss-120b) + suporte a histórico + system prompt
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(historico) ? historico : []),
          { role: "user", content: pergunta || "Gere uma atualização profissional do status atual para envio via WhatsApp." }
        ],
        temperature: 0.2
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
        { text: `⚠️ Erro na API Groq (${response.status}): ${data?.error?.message || "Falha ao processar a resposta da IA."}` },
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
    console.error("Erro na rota admin-ai:", error);
    return NextResponse.json(
      { text: `⚠️ Erro interno na central de comando: ${error?.message || "Erro desconhecido."}` },
      { status: 500 }
    );
  }
}