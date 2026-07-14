import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET: Busca todos os clientes do banco SQL
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM clientes`;
    return NextResponse.json({ clientes: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}

// POST: Salva um novo cliente no banco SQL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await sql`
      INSERT INTO clientes (id, nome, veiculo, telefone, senha, status)
      VALUES (${body.id}, ${body.nome}, ${body.veiculo}, ${body.telefone}, ${body.senha}, ${body.status})
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}