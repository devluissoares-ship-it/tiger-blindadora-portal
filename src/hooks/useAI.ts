"use client";
import { useState } from "react";

// Definimos uma interface para garantir que o contexto tenha os dados necessários
interface AIContext {
  status: string;
  veiculo: string;
  nivelBlindagem?: string;
  tipoRevisao?: string;
  dataRevisao?: string;
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Consulta a API de IA da Tiger Blindadora.
   * @param pergunta A dúvida do usuário ou admin
   * @param contexto Dados técnicos do cliente/veículo
   */
  const askAI = async (pergunta: string, contexto: AIContext) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta,
          // Enviamos o contexto completo, garantindo que a IA tenha a visão técnica
          veiculo: contexto.veiculo,
          nivelBlindagem: contexto.nivelBlindagem || "Não informado",
          statusProjeto: contexto.status,
          agendamentoRevisao: contexto.tipoRevisao || "Nenhuma revisão agendada",
          dataRevisao: contexto.dataRevisao || "N/A"
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na comunicação: ${response.statusText}`);
      }

      const data = await response.json();
      return data.text || "Sem resposta da Tiger Tech.";
      
    } catch (error) {
      console.error("Erro na consulta IA:", error);
      // Retorno padronizado e profissional
      return "Prezado(a), estamos com uma instabilidade momentânea no nosso assistente técnico. Por favor, entre em contato diretamente com seu consultor na Tiger Blindadora.";
    } finally {
      setLoading(false);
    }
  };

  return { askAI, loading };
};