export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  veiculo: string; // Nome comercial (ex: Porsche Cayenne)
  senha?: string; // Campo adicionado para autenticação do cliente
  
  // Campos do Veículo (Técnicos)
  modelo?: string;
  anoModelo?: string;
  placa?: string;
  chassi?: string;
  
  // Gestão de Processo
  status: string;
  progresso: number;
  etapaAtual: number;
  
  // Pós-Venda
  proximaRevisao?: string; // Formato: YYYY-MM-DD
  tipoRevisao?: string;
  dataRevisao?: string; // Incluído para manter consistência com o Dashboard
  
  // Histórico
  historicoFotos: { titulo: string; url?: string }[];
  historicoEventos: { data: string; titulo: string; descricao: string }[];
}

export const clientePadrao: Cliente = {
  id: "",
  nome: "",
  telefone: "",
  veiculo: "",
  senha: "",
  
  // Inicialização dos campos de veículo
  modelo: "",
  anoModelo: "",
  placa: "",
  chassi: "",
  
  status: "Entrada",
  progresso: 0,
  etapaAtual: 1,
  
  // Pós-Venda
  proximaRevisao: "",
  tipoRevisao: "",
  dataRevisao: "",
  
  // Inicialização de arrays vazios para evitar erros de undefined
  historicoFotos: [],
  historicoEventos: []
};