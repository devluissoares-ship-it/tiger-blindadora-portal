export interface Cliente {
  id: string;
  senha: string;
  nome: string;
  telefone: string;
  veiculo: string;
  modelo: string;         // Adicionado para alinhar com seu form de edição
  anoModelo: string;      // Adicionado para alinhar com seu form de edição
  placa: string;          // Adicionado para alinhar com seu form de edição
  chassi: string;         // Adicionado para alinhar com seu form de edição
  nivelBlindagem: string; // Adicionado para alinhar com seu form de edição
  status: string;
  progresso: number;
  etapaAtual: number;
  tipoRevisao: string;    // Renomeado para alinhar com o seu formulário
  dataRevisao: string;    // Formato YYYY-MM-DD
  horaRevisao: string;    // Formato HH:MM
  historicoFotos: { descricao: string; url?: string }[];
  historicoEventos: { data: string; titulo: string; descricao: string }[];
}

export const clientePadrao: Cliente = {
  id: "",
  senha: "",
  nome: "",
  telefone: "",
  veiculo: "",
  modelo: "",
  anoModelo: "",
  placa: "",
  chassi: "",
  nivelBlindagem: "III-A",
  status: "Entrada",
  progresso: 0,
  etapaAtual: 1,
  tipoRevisao: "Blindagem",
  dataRevisao: new Date().toISOString().split('T')[0],
  horaRevisao: "09:00",
  historicoFotos: [],
  historicoEventos: []
};