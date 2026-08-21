"use client";
import { useState } from "react";

interface AIContext {
  status: string;
  veiculo: string;
  nivelBlindagem?: string | null;
  tipoRevisao?: string | null;
  dataRevisao?: string | null;
  progresso?: number;
  nomeCliente?: string;
  checklistEntrada?: any;
  fotosEntrada?: any;
}

export const useAI = (endpoint: string = '/api/chat-status') => {
  const [loading, setLoading] = useState(false);

  /**
   * Hook de IA otimizado para o Dashboard Tiger.
   * Garante que o contexto enviado seja limpo e estruturado.
   */
  const askAI = async (pergunta?: string, contexto?: AIContext): Promise<string> => {
    const textoFinal = pergunta?.trim() || "Explique detalhadamente a etapa atual do veículo.";
    
    setLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta: textoFinal,
          nomeCliente: contexto?.nomeCliente,
          progresso: contexto?.progresso,
          checklistEntrada: contexto?.checklistEntrada,
          fotosEntrada: contexto?.fotosEntrada,
          // Mantém o mapeamento de contexto limpo
          contexto: {
            veiculo: contexto?.veiculo || "Não especificado",
            blindagem: contexto?.nivelBlindagem || "Não especificado",
            status: contexto?.status || "Não especificado",
            revisao: contexto?.tipoRevisao || "Não agendada",
            data: contexto?.dataRevisao || "N/A"
          }
        }),
      });

      if (!response.ok) throw new Error("Erro de conexão");

      const data = await response.json();
      return data.text || "A inteligência técnica da Tiger não retornou uma resposta no momento.";
      
    } catch (error) {
      console.error("Falha na consulta:", error);
      return "Prezado(a), o assistente técnico está temporariamente fora do ar. Nossa equipe humana já foi notificada para te atender!";
    } finally {
      setLoading(false);
    }
  };

  return { askAI, loading };
};