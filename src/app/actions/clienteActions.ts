"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Cliente } from "@/types/cliente";

/**
 * Função profissional para salvar/criar cliente.
 * Garantimos o mapeamento explícito para evitar erros de coluna inexistente.
 */
export async function criarNovoCliente(data: Cliente) {
  try {
    // Mapeamento explícito: enviamos apenas o que o banco de dados conhece.
    // Isso evita o erro de "column does not exist".
    const payload = {
      nome: data.nome,
      telefone: data.telefone,
      veiculo: data.veiculo,
      senha: data.senha,
      status: data.status,
      progresso: Number(data.progresso),
      etapa_atual: Number(data.etapa_atual),
      ano_modelo: data.ano_modelo,
      placa: data.placa,
      chassi: data.chassi,
      nivel_blindagem: data.nivel_blindagem,
      tipo_revisao: data.tipo_revisao,
      data_revisao: data.data_revisao,
      hora_revisao: data.hora_revisao,
      historico_fotos: data.historico_fotos || [],
      historico_eventos: data.historico_eventos || []
    };

    const { data: novo, error } = await supabase
      .from("clientes")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("Erro detalhado do Supabase:", error);
      throw new Error(error.message);
    }

    revalidatePath("/admin/clientes");
    
    return { success: true, data: novo };
  } catch (error: any) {
    console.error("Erro na Server Action [criarNovoCliente]:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Adicionei a função de atualização que estava faltando e gerando erro no seu AdminDashboard
 */
export async function atualizarCliente(id: string, data: Partial<Cliente>) {
  try {
    const { error } = await supabase
      .from("clientes")
      .update(data)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/clientes");
    return { success: true };
  } catch (error: any) {
    console.error("Erro na Server Action [atualizarCliente]:", error);
    return { success: false, error: error.message };
  }
}