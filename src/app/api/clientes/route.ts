import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

// GET: Busca todos os clientes (Ordenados pelo mais recente)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false }); // Sempre bom ordenar no admin

    if (error) throw error;
    return NextResponse.json({ clientes: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao buscar clientes" }, { status: 500 });
  }
}

// POST: Salva um novo cliente com validação básica
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação mínima de segurança antes de ir pro banco
    if (!body.nome || !body.id) {
      return NextResponse.json({ error: "Dados incompletos: nome e ID são obrigatórios" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('clientes')
      .insert([body])
      .select(); // Retorna o dado inserido para confirmar

    if (error) throw error;
    
    return NextResponse.json({ success: true, cliente: data }, { status: 201 });
  } catch (error: any) {
    console.error("Erro na API Clientes POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}