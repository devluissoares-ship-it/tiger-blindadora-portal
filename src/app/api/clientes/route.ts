import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// Força a rota a sempre buscar dados atualizados
export const dynamic = 'force-dynamic';

// GET: Busca todos os clientes
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

// POST: Salva um novo cliente
export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
    }

    if (!body?.nome?.trim()) {
      return NextResponse.json({ error: "O nome do cliente é obrigatório." }, { status: 400 });
    }

    const payload = {
      nome: body.nome.trim(),
      veiculo: body.veiculo || body.modelo || "Veículo",
      status: body.status || "Entrada",
      progresso: Math.min(Math.max(Number(body.progresso) || 0, 0), 100),
      etapa_atual: Number(body.etapa_atual) || 1,
      nivel_blindagem: body.nivel_blindagem || "III-A",
      checklist_entrada: body.checklist_entrada || {
        lataria: false, vidros_e_parabrisa: false, interior_e_bancos: false,
        painel_e_km: false, acessorios_e_pertences: false, observacoes: ""
      },
      fotos_entrada: Array.isArray(body.fotos_entrada) ? body.fotos_entrada : [],
      historico_fotos: Array.isArray(body.historico_fotos) ? body.historico_fotos : [],
      historico_eventos: Array.isArray(body.historico_eventos) ? body.historico_eventos : [],
      tipo_revisao: body.tipo_revisao || null,
      data_revisao: body.data_revisao || null,
      hora_revisao: body.hora_revisao || null,
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([payload])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, cliente: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API Clientes POST:", error);
    return NextResponse.json({ error: error?.message || "Erro ao cadastrar." }, { status: 500 });
  }
}

// PUT: Atualiza cliente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id) return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });

    const { id, created_at, ...dadosAtualizacao } = body;

    // Sanitização de valores numéricos
    if (dadosAtualizacao.progresso !== undefined) {
      dadosAtualizacao.progresso = Math.min(Math.max(Number(dadosAtualizacao.progresso), 0), 100);
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(dadosAtualizacao)
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, cliente: data[0] }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API Clientes PUT:", error);
    return NextResponse.json({ error: error?.message || "Erro ao atualizar." }, { status: 500 });
  }
}

// DELETE: Remove cliente
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });

    const { error } = await supabase.from('clientes').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Removido com sucesso." }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API Clientes DELETE:", error);
    return NextResponse.json({ error: error?.message || "Erro ao excluir." }, { status: 500 });
  }
}