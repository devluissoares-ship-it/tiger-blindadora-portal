export interface HistoricoFoto {
  url: string;
  titulo: string;
  descricao: string;
}

export interface HistoricoEvento {
  data: string;
  titulo: string;
  descricao: string;
}

export interface Cliente {
  // Identificação
  id: string;
  senha?: string | null;
  nome: string;
  telefone: string;
  
  // Veículo
  veiculo: string;
  modelo?: string | null;
  ano_modelo?: string | null;
  placa?: string | null;
  chassi?: string | null;
  nivel_blindagem?: string | null;
  
  // Processo
  status: string;
  progresso: number;
  etapa_atual: number;
  
  // Revisão
  tipo_revisao?: string | null;
  data_revisao?: string | null;
  hora_revisao?: string | null;
  
  // --- ADICIONE ESTAS LINHAS ABAIXO ---
  data_revisao_6m?: string | null;
  data_revisao_10k?: string | null;
  data_revisao_anual?: string | null;
  // ------------------------------------
  
  // JSONB
  historico_fotos: HistoricoFoto[];
  historico_eventos: HistoricoEvento[];
}

export const criarClientePadrao = (): Cliente => ({
  id: "",
  senha: "",
  nome: "",
  telefone: "",
  veiculo: "",
  modelo: "",
  ano_modelo: "",
  placa: "",
  chassi: "",
  nivel_blindagem: "III-A",
  status: "Entrada",
  progresso: 0,
  etapa_atual: 1,
  tipo_revisao: "",
  data_revisao: "",
  hora_revisao: "",
  // Inicialize também as novas propriedades aqui
  data_revisao_6m: null,
  data_revisao_10k: null,
  data_revisao_anual: null,
  historico_fotos: [],
  historico_eventos: []
});