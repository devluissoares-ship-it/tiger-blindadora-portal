"use server";

import { supabase } from '@/lib/supabase';
import { Cliente } from '@/types/cliente';

/**
 * Cria um novo registro de cliente no Supabase
 * Removemos campos extras para evitar erro de "column does not exist"
 */
export const criarNovoCliente = async (novoCliente: Cliente) => {
  // Garantimos que enviamos apenas os campos que existem na sua tabela
  const { data, error } = await supabase
    .from('clientes')
    .insert([{
      id: novoCliente.id,
      nome: novoCliente.nome,
      veiculo: novoCliente.veiculo,
      telefone: novoCliente.telefone,
      senha: novoCliente.senha,
      status: novoCliente.status || "Entrada",
      progresso: novoCliente.progresso || 0
    }])
    .select();

  if (error) {
    console.error("Erro ao inserir no Supabase:", error);
    throw new Error(error.message);
  }
  return data;
};

/**
 * Atualiza um cliente existente
 * Removemos o ID e campos não existentes para evitar conflitos
 */
export const atualizarCliente = async (id: string, dados: Cliente) => {
  // Filtra apenas as colunas que você tem no banco
  const dadosParaAtualizar = {
    nome: dados.nome,
    veiculo: dados.veiculo,
    telefone: dados.telefone,
    senha: dados.senha,
    status: dados.status,
    progresso: dados.progresso
  };

  const { data, error } = await supabase
    .from('clientes')
    .update(dadosParaAtualizar)
    .eq('id', id)
    .select();

  if (error) {
    console.error("Erro ao atualizar no Supabase:", error);
    throw new Error(error.message);
  }
  return data;
};

/**
 * Busca um cliente específico pelo ID
 */
export const getClienteById = async (id: string): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Erro ao buscar cliente por ID:", error);
    return null;
  }
  return data as Cliente;
};