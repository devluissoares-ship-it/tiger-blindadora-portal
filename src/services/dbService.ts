import { supabase } from '@/lib/supabase';

/**
 * Como estamos usando Supabase (Banco de Dados em Nuvem), 
 * o localStorage não é mais necessário. 
 * Estas funções são agora wrappers que garantem a comunicação com o Banco.
 */

export const getClienteById = async (id: string) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Erro ao buscar cliente no Supabase:", error);
    return null;
  }
  return data;
};

/**
 * Esta função agora atua como um ponte para o seu useDB, 
 * mantendo a consistência do sistema.
 */
export const updateClienteLocal = async (id: string, updatedData: any) => {
  const { error } = await supabase
    .from('clientes')
    .update(updatedData)
    .eq('id', id);

  if (error) {
    console.error("Erro ao atualizar no Supabase:", error);
    return false;
  }
  return true;
};