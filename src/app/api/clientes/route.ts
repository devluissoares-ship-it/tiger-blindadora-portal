import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// Força a rota a sempre buscar dados atualizados, sem cache estático no Next.js
export const dynamic = 'force-dynamic';

// GET: Busca todos os clientes (Ordenados pelo mais recente)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ clientes: data || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API Clientes GET:", error);
    return NextResponse.json({ 
      error: error?.message || "Erro interno ao buscar clientes." 
    }, { status: 500 });
  }
}

// POST: Salva um novo cliente com validação e suporte completo aos campos
export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ 
        error: "Corpo da requisição inválido ou JSON malformatado." 
      }, { status: 400 });
    }

    // Validação mínima de segurança
    if (!body?.nome || typeof body.nome !== 'string' || !body.nome.trim()) {
      return NextResponse.json({ 
        error: "Dados incompletos: o nome do cliente é obrigatório." 
      }, { status: 400 });
    }

    // Estruturação do checklist padrão com fallback defensivo
    const checklistPadrao = {
      lataria: false,
      vidros_e_parabrisa: false,
      interior_e_bancos: false,
      painel_e_km: false,
      acessorios_e_pertences: false,
      observacoes: ""
    };

    const checklistEntrada = body.checklist_entrada
      ? { ...checklistPadrao, ...body.checklist_entrada }
      : checklistPadrao;

    // Montagem do payload estruturado
    const payload = {
      ...body,
      nome: body.nome.trim(),
      veiculo: body.veiculo || body.modelo || "Veículo",
      status: body.status || "Entrada",
      progresso: Math.min(Math.max(Number(body.progresso) || 0, 0), 100),
      etapa_atual: Number(body.etapa_atual) || 1,
      nivel_blindagem: body.nivel_blindagem || "III-A",
      checklist_entrada: checklistEntrada,
      fotos_entrada: Array.isArray(body.fotos_entrada) ? body.fotos_entrada : [],
      historico_fotos: Array.isArray(body.historico_fotos) ? body.historico_fotos : [],
      historico_eventos: Array.isArray(body.historico_eventos) ? body.historico_eventos : [],
      tipo_revisao: body.tipo_revisao || null,
      data_revisao: body.data_revisao || null,
      hora_revisao: body.hora_revisao || null,
    };

    // Limpeza de campos auto-gerados para evitar conflitos no Supabase
    if (!payload.id) delete payload.id;
    if (!payload.created_at) delete payload.created_at;

    const { data, error } = await supabase
      .from('clientes')
      .insert([payload])
      .select();

    if (error) throw error;

    const clienteCriado = data && data.length > 0 ? data[0] : null;

    return NextResponse.json({ success: true, cliente: clienteCriado }, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API Clientes POST:", error);
    return NextResponse.json({ 
      error: error?.message || "Erro interno ao cadastrar cliente." 
    }, { status: 500 });
  }
}

// PUT: Atualiza os dados de um cliente existente
export async function PUT(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ 
        error: "Corpo da requisição inválido ou JSON malformatado." 
      }, { status: 400 });
    }

    if (!body?.id) {
      return NextResponse.json({ 
        error: "ID do cliente é obrigatório para atualização." 
      }, { status: 400 });
    }

    const { id, created_at, ...dadosAtualizacao } = body;

    // Ajuste defensivo dos valores numéricos se enviados
    if (dadosAtualizacao.progresso !== undefined) {
      dadosAtualizacao.progresso = Math.min(Math.max(Number(dadosAtualizacao.progresso) || 0, 0), 100);
    }
    if (dadosAtualizacao.etapa_atual !== undefined) {
      dadosAtualizacao.etapa_atual = Number(dadosAtualizacao.etapa_atual) || 1;
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(dadosAtualizacao)
      .eq('id', id)
      .select();

    if (error) throw error;

    const clienteAtualizado = data && data.length > 0 ? data[0] : null;

    return NextResponse.json({ success: true, cliente: clienteAtualizado }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API Clientes PUT:", error);
    return NextResponse.json({ 
      error: error?.message || "Erro interno ao atualizar cliente." 
    }, { status: 500 });
  }
}

// DELETE: Remove um cliente pelo ID recebido via query param
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: "ID do cliente é obrigatório para exclusão." 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Cliente removido com sucesso." }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API Clientes DELETE:", error);
    return NextResponse.json({ 
      error: error?.message || "Erro interno ao excluir cliente." 
    }, { status: 500 });
  }
}