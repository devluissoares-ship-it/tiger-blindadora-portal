"use client";
import { useState } from "react";

interface AIContext {
  status: string;
  veiculo: string;
  nivelBlindagem?: string | null;
  tipoRevisao?: string | null;
  dataRevisao?: string | null;
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Hook de IA otimizado para o Dashboard Tiger.
   * Garante que o contexto enviado seja limpo e estruturado.
   */
  const askAI = async (pergunta: string, contexto: AIContext): Promise<string> => {
    if (!pergunta.trim()) return "Por favor, digite uma dúvida válida.";
    
    setLoading(true);
    try {
      const response = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta,
          // Limpamos o contexto para enviar apenas o que a IA precisa
          contexto: {
            veiculo: contexto.veiculo,
            blindagem: contexto.nivelBlindagem || "Não especificado",
            status: contexto.status,
            revisao: contexto.tipoRevisao || "Não agendada",
            data: contexto.dataRevisao || "N/A"
          }
        }),
      });

      if (!response.ok) throw new Error("Erro de conexão");

      const data = await response.json();
      return data.text || "A inteligência técnica da Tiger não retornou uma resposta no momento.";
      
    } catch (error) {
      console.error("Falha na consulta:", error);
      // Feedback amigável para manter o padrão profissional
      return "Prezado(a), o assistente técnico está temporariamente fora do ar. Nossa equipe humana já foi notificada para te atender!";
    } finally {
      setLoading(false);
    }
  };

  return { askAI, loading };
};