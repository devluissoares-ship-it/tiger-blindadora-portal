import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// GET: Busca todos os clientes (Ordenados pelo mais recente)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false }); // Sempre ordenado no admin

    if (error) throw error;
    return NextResponse.json({ clientes: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao buscar clientes" }, { status: 500 });
  }
}

// POST: Salva um novo cliente com validação e suporte completo aos campos de checklist, fotos e revisões
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação mínima de segurança antes de ir para o banco
    if (!body.nome || !body.id) {
      return NextResponse.json({ error: "Dados incompletos: nome e ID são obrigatórios" }, { status: 400 });
    }

    // Montagem do payload estruturado para garantir integridade absoluta com o Supabase
    const payload = {
      ...body,
      status: body.status || "Entrada",
      progresso: Number(body.progresso || 0),
      etapa_atual: Number(body.etapa_atual || 1),
      nivel_blindagem: body.nivel_blindagem || "III-A",
      checklist_entrada: body.checklist_entrada || {
        lataria: false,
        vidros_e_parabrisa: false,
        interior_e_bancos: false,
        painel_e_km: false,
        acessorios_e_pertences: false,
        observacoes: ""
      },
      fotos_entrada: body.fotos_entrada || [],
      historico_fotos: body.historico_fotos || [],
      historico_eventos: body.historico_eventos || [],
      tipo_revisao: body.tipo_revisao || null,
      data_revisao: body.data_revisao || null,
      hora_revisao: body.hora_revisao || null,
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([payload])
      .select(); // Retorna o dado inserido para confirmar a persistência

    if (error) throw error;
    
    return NextResponse.json({ success: true, cliente: data }, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API Clientes POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}