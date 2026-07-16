"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { Cliente } from "@/types/cliente";

/**
 * Função para criar novo cliente com mapeamento explícito
 */
export async function criarNovoCliente(data: Cliente) {
  try {
    const payload = {
      nome: data.nome,
      telefone: data.telefone,
      veiculo: data.veiculo,
      modelo: data.modelo || "",
      senha: data.senha || "",
      status: data.status || "Entrada",
      progresso: Number(data.progresso || 0),
      etapa_atual: Number(data.etapa_atual || 1),
      ano_modelo: data.ano_modelo || "",
      placa: data.placa || "",
      chassi: data.chassi || "",
      nivel_blindagem: data.nivel_blindagem || "III-A",
      tipo_revisao: data.tipo_revisao || null,
      data_revisao: data.data_revisao || null,
      hora_revisao: data.hora_revisao || null,
      historico_fotos: data.historico_fotos || [],
      historico_eventos: data.historico_eventos || []
    };

    const { data: novo, error } = await supabase
      .from("clientes")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/clientes");
    return { success: true, data: novo };
  } catch (error: any) {
    console.error("Erro [criarNovoCliente]:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Função de atualização garantindo que apenas campos válidos sejam enviados
 */
export async function atualizarCliente(id: string, data: Partial<Cliente>) {
  try {
    // Mapeamento idêntico ao de criação para garantir compatibilidade com as colunas do banco
    const payload: any = {
      nome: data.nome,
      telefone: data.telefone,
      veiculo: data.veiculo,
      modelo: data.modelo,
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
      historico_fotos: data.historico_fotos,
      historico_eventos: data.historico_eventos
    };

    // Remove chaves undefined para não enviar campos vazios indevidamente para colunas obrigatórias
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const { error } = await supabase
      .from("clientes")
      .update(payload)
      .eq("id", id);

    if (error) throw error;

    // Dispara a revalidação de todas as rotas que dependem desses dados
    revalidatePath("/admin/clientes");
    revalidatePath(`/admin/clientes/${id}/editar`);
    revalidatePath(`/portal/${id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro [atualizarCliente]:", error);
    return { success: false, error: error.message };
  }
}