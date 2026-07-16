import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { id, senha } = await req.json();

    if (!id || !senha) {
      return NextResponse.json(
        { success: false, message: "ID e senha são obrigatórios" }, 
        { status: 400 }
      );
    }

    // Consulta otimizada: busca apenas o que precisamos
    const { rows } = await sql`
      SELECT id FROM clientes 
      WHERE id = ${String(id)} AND senha = ${String(senha)}
      LIMIT 1
    `;

    if (rows.length > 0) {
      return NextResponse.json({ 
        success: true, 
        id: rows[0].id // Retornamos o ID para o front saber para onde mandar
      });
    }

    return NextResponse.json(
      { success: false, message: "Credenciais inválidas" }, 
      { status: 401 }
    );

  } catch (error) {
    console.error("Erro na rota de login:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor" }, 
      { status: 500 }
    );
  }
}