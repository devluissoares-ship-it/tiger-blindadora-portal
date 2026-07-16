import { supabase } from "@/lib/supabase";
import { HistoricoFoto } from "@/types/cliente";

/**
 * Serviço responsável pelo upload de imagens no Supabase Storage.
 * Mantém a lógica centralizada para evitar duplicação no componente de tela.
 */
export async function uploadImagemCliente(
  clienteId: string,
  file: File,
  etapa: string
): Promise<HistoricoFoto> {
  // 1. Extrai a extensão e gera um caminho único (Pasta do Cliente + ID Único)
  const extensao = file.name.split(".").pop() || "jpg";
  const nomeArquivo = `${clienteId}/${Date.now()}-${crypto.randomUUID()}.${extensao}`;

  // 2. Upload para o bucket "imagens"
  const { error: uploadError } = await supabase.storage
    .from("imagens")
    .upload(nomeArquivo, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro ao subir imagem para o storage: ${uploadError.message}`);
  }

  // 3. Obtém a URL pública de forma segura
  const { data } = supabase.storage
    .from("imagens")
    .getPublicUrl(nomeArquivo);

  // 4. Retorna o objeto seguindo exatamente a interface HistoricoFoto
  return {
    url: data.publicUrl,
    titulo: etapa,
    descricao: `Foto adicionada na etapa: ${etapa} em ${new Date().toLocaleDateString()}`,
  };
}