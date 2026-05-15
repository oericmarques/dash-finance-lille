import type { Movimentacao, ResumoMensal, ResumoCategoria, ResumoCliente } from "./types";

// --- Filtro por ano ---

export function filtrarPorAno(movs: Movimentacao[], ano: string): Movimentacao[] {
  const sufixo = ano.slice(2);
  return movs.filter((m) => m.mes.endsWith(`.${sufixo}`));
}

export function filtrarPorMeses(movs: Movimentacao[], meses: string[]): Movimentacao[] {
  if (meses.length === 0) return movs;
  return movs.filter((m) => {
    const prefix = m.mes.split(".")[0];
    return meses.includes(prefix);
  });
}

// --- Separar entradas e saidas ---

export function soEntradas(movs: Movimentacao[]): Movimentacao[] {
  return movs.filter((m) => m.movimento === "Entrada");
}

export function soSaidas(movs: Movimentacao[]): Movimentacao[] {
  return movs.filter((m) => m.movimento === "Saída");
}

// --- Resumo mensal com 3 status ---

export function resumoMensalPorStatus(movs: Movimentacao[]): ResumoMensal[] {
  const mapa = new Map<string, { pago: number; aVencer: number; vencido: number }>();

  for (const m of movs) {
    if (!m.mes) continue;
    const atual = mapa.get(m.mes) || { pago: 0, aVencer: 0, vencido: 0 };
    if (m.status === "pago") atual.pago += m.valorRecebido;
    else if (m.status === "vencido") atual.vencido += m.valorRecebido;
    else atual.aVencer += m.valorRecebido;
    mapa.set(m.mes, atual);
  }

  return Array.from(mapa.entries())
    .map(([mes, v]) => ({
      mes,
      pago: r2(v.pago),
      aVencer: r2(v.aVencer),
      vencido: r2(v.vencido),
      total: r2(v.pago + v.aVencer + v.vencido),
    }))
    .sort((a, b) => mesParaOrdem(a.mes) - mesParaOrdem(b.mes));
}

// --- Resumo por categoria ---

export function calcularResumoCategorias(movs: Movimentacao[]): ResumoCategoria[] {
  const mapa = new Map<string, number>();
  let total = 0;

  for (const m of movs) {
    const cat = m.categoria || "Sem categoria";
    mapa.set(cat, (mapa.get(cat) || 0) + m.valorRecebido);
    total += m.valorRecebido;
  }

  return Array.from(mapa.entries())
    .map(([categoria, valor]) => ({
      categoria,
      valor: r2(valor),
      percentual: total > 0 ? r2((valor / total) * 100) : 0,
    }))
    .sort((a, b) => b.valor - a.valor);
}

// --- Resumo por cliente/fornecedor ---

export function resumoPorCliente(movs: Movimentacao[]): ResumoCliente[] {
  const mapa = new Map<string, { pago: number; pendente: number; vencido: number; qtdAberto: number }>();

  for (const m of movs) {
    const nome = m.cliente || "Sem nome";
    const atual = mapa.get(nome) || { pago: 0, pendente: 0, vencido: 0, qtdAberto: 0 };
    if (m.status === "pago") {
      atual.pago += m.valorRecebido;
    } else if (m.status === "vencido") {
      atual.vencido += m.valorRecebido;
      atual.qtdAberto++;
    } else {
      atual.pendente += m.valorRecebido;
      atual.qtdAberto++;
    }
    mapa.set(nome, atual);
  }

  return Array.from(mapa.entries())
    .map(([cliente, v]) => ({
      cliente,
      pago: r2(v.pago),
      pendente: r2(v.pendente),
      vencido: r2(v.vencido),
      qtdAberto: v.qtdAberto,
    }))
    .sort((a, b) => (b.pago + b.pendente + b.vencido) - (a.pago + a.pendente + a.vencido));
}

// --- Totais rápidos ---

export function totalPorStatus(movs: Movimentacao[]) {
  let pago = 0, aVencer = 0, vencido = 0;
  for (const m of movs) {
    if (m.status === "pago") pago += m.valorRecebido;
    else if (m.status === "vencido") vencido += m.valorRecebido;
    else aVencer += m.valorRecebido;
  }
  return { pago: r2(pago), aVencer: r2(aVencer), vencido: r2(vencido), total: r2(pago + aVencer + vencido) };
}

// --- Anos e meses disponíveis ---

export function extrairAnos(movs: Movimentacao[]): string[] {
  const anos = new Set<string>();
  for (const m of movs) {
    const match = m.mes.match(/\.(\d{2})$/);
    if (match) anos.add(`20${match[1]}`);
  }
  return Array.from(anos).sort().reverse();
}

export function extrairMesesDoAno(movs: Movimentacao[], ano: string): string[] {
  const sufixo = ano.slice(2);
  const ordemMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const presentes = new Set<string>();
  for (const m of movs) {
    if (m.mes.endsWith(`.${sufixo}`)) presentes.add(m.mes.split(".")[0]);
  }
  return ordemMeses.filter((m) => presentes.has(m));
}

// --- Formatação ---

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatNumero(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

export function formatDateBR(isoDate: string): string {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("pt-BR");
}

export function formatDateTimeBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mesLabel(mes: string): string {
  const nomes: Record<string, string> = {
    jan: "Jan", fev: "Fev", mar: "Mar", abr: "Abr",
    mai: "Mai", jun: "Jun", jul: "Jul", ago: "Ago",
    set: "Set", out: "Out", nov: "Nov", dez: "Dez",
  };
  const match = mes.match(/^([a-z]{3})\.(\d{2})$/);
  if (!match) return mes;
  return nomes[match[1]] || match[1];
}

export function mesLabelCompleto(mes: string): string {
  const nomes: Record<string, string> = {
    jan: "Janeiro", fev: "Fevereiro", mar: "Marco", abr: "Abril",
    mai: "Maio", jun: "Junho", jul: "Julho", ago: "Agosto",
    set: "Setembro", out: "Outubro", nov: "Novembro", dez: "Dezembro",
  };
  const match = mes.match(/^([a-z]{3})\.(\d{2})$/);
  if (!match) return mes;
  return `${nomes[match[1]] || match[1]} 20${match[2]}`;
}

// --- Internos ---

function mesParaOrdem(mes: string): number {
  const meses: Record<string, number> = {
    jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6,
    jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12,
  };
  const match = mes.match(/^([a-z]{3})\.(\d{2})$/);
  if (!match) return 0;
  return (parseInt(match[2]) * 100) + (meses[match[1]] || 0);
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
