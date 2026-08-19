import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { cliente, pergunta } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        text: "⚠️ Chave GROQ_API_KEY não configurada nas variáveis de ambiente da Vercel." 
      });
    }

    // Proteção com optional chaining para evitar estouro em propriedades nulas
    const isEntrada = cliente?.status === "Entrada" || cliente?.status === "Entrada e Vistoria Inicial";
    
    let contextoChecklist = "";
    if (cliente?.checklist_entrada) {
      const chk = cliente.checklist_entrada;
      const obs = chk.observacoes ? chk.observacoes.trim() : "";
      
      contextoChecklist = `
      CHECKLIST DE VISTORIA DE ENTRADA (REGISTRO TÉCNICO):
      - Status por setor inspecionado:
        • Lataria: ${chk.lataria ? 'Inspecionado e OK' : (obs ? 'Inspecionado com apontamento/observação registrada' : 'Não verificado')}
        • Vidros e Para-brisa: ${chk.vidros_e_parabrisa ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
        • Interior e Bancos: ${chk.interior_e_bancos ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
        • Painel e Quilometragem: ${chk.painel_e_km ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
        • Acessórios e Pertences: ${chk.acessorios_e_pertences ? 'Inspecionado e OK' : 'Inspecionado sem alterações'}
        • Observações Técnicas Registradas: ${obs || "Nenhuma observação extra registrada."}
      - Quantidade de fotos de vistoria de entrada anexadas: ${cliente.fotos_entrada?.length || 0} fotos.
      - DIRETRIZ DE LEITURA DO CHECKLIST PARA O ADMIN: Se houver observações descritas (ex: risco, detalhe na lataria), nunca trate o item como "não verificado". Explique que o item foi inspecionado, que há um registro transparente para o cliente e que as fotos servem de apoio visual preventivo.
      `;
    }

    const systemPrompt = `
      Você é o Gerente Geral e Consultor Técnico Oficial da TIGER BLINDADORA. 
      Sua missão é auxiliar o Administrador na gestão técnica e comercial, redigindo mensagens prontas, profissionais e humanizadas para envio via WhatsApp aos clientes.

      INFORMAÇÕES DA EMPRESA:
      - Missão: Conformidade balística e engenharia de alta performance.
      - Especialidade: Proteção patrimonial nível superior.
      - Homologação: Exército Brasileiro.
      - Endereço: Tv. João Mendes, 113, Santo André - SP.

      FLUXO OPERACIONAL COMPLETO DA TIGER (Domine para embasar as mensagens):
      1. Entrada e Vistoria Inicial (Checklist e fotos de recebimento).
      2. Desmontagem (Retirada técnica de acabamentos).
      3. Estrutura (Aplicação de aço balístico e mantas).
      4. Portas (Reforço em dobradiças e vidros balísticos).
      5. Vidros (Instalação de vidros balísticos homologados).
      6. Acabamento (Remontagem interna padrão original).
      7. Testes (Testes de infiltração, elétricos e dinâmicos).
      8. Finalização (Limpeza técnica e checagem de qualidade).
      9. Entrega Técnica (Apresentação do veículo blindado).
      10. Revisões Periódicas (Pós-venda obrigatório aos 6 meses, 10.000km e Anual para manutenção da garantia e certificação do Exército).

      DADOS DO PROJETO ATUAL:
      - Cliente: ${cliente?.nome || "Cliente"}
      - Veículo: ${cliente?.veiculo || cliente?.modelo || "Veículo"}
      - Status Atual: ${cliente?.status || "Em andamento"}
      - Progresso Atual: ${cliente?.progresso || 0}%
      ${contextoChecklist}

      DIRETRIZES RÍGIDAS PARA A MENSAGEM AO CLIENTE:
      1. TOM: Profissional, sério, transparente e técnico (padrão TIGER).
      2. O QUE INCLUIR NA MENSAGEM:
         - Agradecimento pela confiança e citação correta do veículo (${cliente?.veiculo || cliente?.modelo || "veículo"}).
         - Status atual do projeto com foco na qualidade da blindagem (Normas EB nível III-A).
         - Se o projeto estiver na **ENTRADA**, mencione com total transparência que a vistoria inicial foi realizada, cite as observações do checklist (se houver, como avarias mapeadas ou riscos) de forma polida e tranquilizadora, recomendando que o cliente olhe as fotos no portal.
         - Se o projeto já avançou da entrada, foque exclusivamente no progresso atual e na nova fase, IGNORANDO qualquer menção a checklist inicial ou vistoria de chegada.
         - ACESSO AO PORTAL: Inclua obrigatoriamente ao final da mensagem este link exato: "Acompanhe o progresso em tempo real pelo nosso portal: https://tiger-blindadora-portal.vercel.app/login-cliente"
         - ASSINATURA: Finalize sempre com: "Atenciosamente, Tiger Blindadora"
      3. RESTRIÇÕES ABSOLUTAS:
         - NÃO mencione senhas, e-mails ou dados de acesso do cliente na mensagem.
         - NÃO inclua códigos técnicos, labels como "LINK_WHATSAPP" ou menções a sistemas internos.
         - A mensagem gerada deve estar 100% pronta para o admin copiar e colar no WhatsApp.
         - SEJA DIRETO E OBJETIVO.
      4. COMPLIANCE: Sempre cite as normas do Exército Brasileiro (EB) em questões de rigidez balística.
    `;

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
          { role: "user", content: pergunta || "Gere uma atualização da fase atual." }
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

    if (!response.ok) {
      return NextResponse.json({ 
        text: `⚠️ Erro na Groq (${response.status}): ${data?.error?.message || "Falha ao processar requisição na API."}` 
      });
    }

    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ 
      text: `Erro na central de comando: ${error?.message || "Verifique os dados enviados e tente novamente."}` 
    });
  }
}