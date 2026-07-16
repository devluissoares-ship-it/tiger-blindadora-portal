// src/services/clientActions.ts

/**
 * Processa a leitura de um arquivo localmente antes do envio.
 * Mantive como "Simulado" conforme seu nome original, mas agora com tipagem rigorosa.
 */
export interface UploadResult {
  success: boolean;
  dataUrl: string;
  fileName: string;
  error?: string;
}

export const processarUploadSimulado = async (file: File): Promise<UploadResult> => {
  try {
    // Validação básica de arquivo
    if (!file) throw new Error("Nenhum arquivo fornecido.");

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error("Falha ao converter arquivo para string."));
        }
      };
      
      reader.onerror = () => reject(new Error("Erro ao ler o arquivo no navegador."));
      reader.readAsDataURL(file);
    });

    return { 
      success: true, 
      dataUrl, 
      fileName: file.name 
    };

  } catch (error: any) {
    console.error("Falha técnica no processamento do arquivo:", error);
    
    return { 
      success: false, 
      dataUrl: "", 
      fileName: file.name,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    };
  }
};