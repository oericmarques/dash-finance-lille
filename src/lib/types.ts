export interface PlanoContas {
  id: string;
  movimento: "Entrada" | "Saída";
  lancamento: string;
  conta: string;
  tipo: string;
}

export interface Movimentacao {
  planoContasId: string;
  data: string;
  cliente: string;
  uf: string;
  descricao: string;
  valorRecebido: number;
  dataPgto: string;
  notaFiscal: string;
  categoria: string;
  mes: string;
  movimento: "Entrada" | "Saída";
  status: "realizado" | "pendente";
}

export interface SaldoBanco {
  banco: string;
  saldo: number;
  ultimaAtualizacao: string;
}

export interface DashboardData {
  movimentacoes: Movimentacao[];
  saldos: SaldoBanco[];
  planoContas: PlanoContas[];
  lastUpdated: string;
}

export interface ResumoMensal {
  mes: string;
  entradas: number;
  saidas: number;
  resultado: number;
}

export interface ResumoCategoria {
  categoria: string;
  valor: number;
  percentual: number;
}
