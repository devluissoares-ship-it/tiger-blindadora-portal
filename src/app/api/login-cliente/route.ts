import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id, senha } = await req.json();
  
  const { rows } = await sql`
    SELECT id, nome FROM clientes WHERE id = ${id} AND senha = ${senha}
  `;

  if (rows.length > 0) {
    return NextResponse.json({ success: true, cliente: rows[0] });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}