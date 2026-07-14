// src/services/clientActions.ts
// Este arquivo é um utilitário de lógica para o navegador.
// Responsável por processar o upload de imagens e converter para Base64.

export const processarUploadSimulado = async (file: File): Promise<{ success: boolean; dataUrl: string; fileName: string; error?: string }> => {
  try {
    // Simula o tempo de rede para passar uma sensação de processamento real
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Converte o arquivo de imagem para uma string Base64 (DataURL)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error("Falha ao converter arquivo para Base64"));
        }
      };
      
      reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
      reader.readAsDataURL(file);
    });

    return { 
      success: true, 
      dataUrl, 
      fileName: file.name 
    };
  } catch (error: any) {
    console.error("Erro no processamento do upload:", error);
    return { 
      success: false, 
      dataUrl: "", 
      fileName: file.name,
      error: error.message 
    };
  }
};