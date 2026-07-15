// src/services/clientActions.ts

export const processarUploadSimulado = async (file: File): Promise<{ success: boolean; dataUrl: string; fileName: string; error?: string }> => {
  // 1. Removi o Audio daqui. Não se mistura interface (som) com lógica de dados (service).
  // Se quiser som, chame a função de som no componente, não no serviço.

  try {
    // 2. Simplificado: FileReader convertido para Promise sem travas desnecessárias
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Erro ao ler o arquivo"));
      reader.readAsDataURL(file);
    });

    return { 
      success: true, 
      dataUrl, 
      fileName: file.name 
    };
  } catch (error: any) {
    console.error("Erro no processamento:", error);
    return { 
      success: false, 
      dataUrl: "", 
      fileName: file.name,
      error: error.message 
    };
  }
};