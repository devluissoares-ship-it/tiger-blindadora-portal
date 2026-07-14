import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// 1. Definindo a interface AQUI para garantir que seja resolvida
export interface Cliente {
  id: string;
  senha: string;
  nome: string;
  telefone: string;
  veiculo: string;
  modelo: string;
  anoModelo: string;
  placa: string;
  chassi: string;
  status: string;
  progresso: number;
  etapaAtual: number;
  nivelBlindagem: string;
  tipoRevisao: string;
  revisao: string;
  dataRevisao: string;
  horaRevisao: string;
  historicoFotos: any[];
  historicoEventos: any[];
}

export function useDB() {
  const [data, setData] = useState<{ clientes: Cliente[] }>({ clientes: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data: clientes, error } = await supabase.from('clientes').select('*');
      if (error) throw error;

      const clientesFormatados: Cliente[] = clientes?.map((c: any) => ({
        id: c.id,
        senha: c.senha,
        nome: c.nome,
        telefone: c.telefone,
        veiculo: c.veiculo,
        modelo: c.modelo,
        anoModelo: c.ano_modelo,
        placa: c.placa,
        chassi: c.chassi,
        status: c.status,
        progresso: c.progresso,
        etapaAtual: c.etapa_atual || 1,
        nivelBlindagem: c.nivel_blindagem,
        tipoRevisao: c.tipo_revisao,
        revisao: c.tipo_revisao || "---",
        dataRevisao: c.data_revisao,
        horaRevisao: c.hora_revisao,
        historicoFotos: c.historico_fotos || [],
        historicoEventos: c.historico_eventos || []
      })) || [];

      setData({ clientes: clientesFormatados });
    } catch (error) {
      console.error("Erro ao buscar:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Busca inicial
    fetchData();

    // Configuração do canal com proteção contra sobrecarga de rede
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'clientes' }, 
        () => {
          // A proteção: só dispara uma nova busca se não estivermos carregando
          if (!loading) {
            fetchData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, loading]);

  const updateCliente = async (id: string, dados: any) => {
    try {
      const payload = {
        nome: dados.nome,
        telefone: dados.telefone,
        veiculo: dados.veiculo,
        modelo: dados.modelo,
        ano_modelo: dados.anoModelo,
        placa: dados.placa,
        chassi: dados.chassi,
        senha: dados.senha,
        nivel_blindagem: dados.nivelBlindagem,
        status: dados.status,
        progresso: Number(dados.progresso || 0),
        etapa_atual: Number(dados.etapaAtual || 1),
        tipo_revisao: dados.tipoRevisao,
        data_revisao: dados.dataRevisao,
        hora_revisao: dados.horaRevisao,
        historico_fotos: dados.historicoFotos || []
      };

      setData(prev => ({
        ...prev,
        clientes: prev.clientes.map(c => c.id === id ? { ...c, ...dados } : c)
      }));

      const { error } = await supabase.from('clientes').update(payload).eq('id', id);
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Erro crítico no update:", error);
      fetchData();
      return { success: false, error };
    }
  };

  const addCliente = async (cliente: any) => {
    const { error } = await supabase.from('clientes').insert([cliente]);
    if (error) return { success: false, error };
    await fetchData();
    return { success: true };
  };

  return { data, loading, refresh: fetchData, updateCliente, addCliente };
}