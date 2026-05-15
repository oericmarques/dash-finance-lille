export interface PlanoContas {
  id: string;
  movimento: "Entrada" | "Saída";
  lancamento: string;
  conta: string;
  tipo: string;
}

export type StatusPagamento = "pago" | "a_vencer" | "vencido";

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
  status: StatusPagamento;
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
  pago: number;
  aVencer: number;
  vencido: number;
  total: number;
}

export interface ResumoCategoria {
  categoria: string;
  valor: number;
  percentual: number;
}

export interface ResumoCliente {
  cliente: string;
  pago: number;
  pendente: number;
  vencido: number;
  qtdAberto: number;
}
