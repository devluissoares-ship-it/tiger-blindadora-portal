import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase"; // Importa o cliente blindado

// GET: Busca todos os clientes
export async function GET() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clientes: data });
}

// POST: Salva um novo cliente
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from('clientes')
      .insert([body]);

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}