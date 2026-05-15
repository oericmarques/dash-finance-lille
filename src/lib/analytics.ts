import type { Movimentacao, ResumoMensal, ResumoCategoria } from "./types";

export function calcularResumoMensal(movs: Movimentacao[]): ResumoMensal[] {
  const mapa = new Map<string, { entradas: number; saidas: number }>();

  for (const mov of movs) {
    const chave = mov.mes;
    if (!chave) continue;
    const atual = mapa.get(chave) || { entradas: 0, saidas: 0 };
    if (mov.movimento === "Entrada") {
      atual.entradas += mov.valorRecebido;
    } else {
      atual.saidas += mov.valorRecebido;
    }
    mapa.set(chave, atual);
  }

  return Array.from(mapa.entries())
    .map(([mes, vals]) => ({
      mes,
      entradas: Math.round(vals.entradas * 100) / 100,
      saidas: Math.round(vals.saidas * 100) / 100,
      resultado:
        Math.round((vals.entradas - vals.saidas) * 100) / 100,
    }))
    .sort((a, b) => mesParaOrdem(a.mes) - mesParaOrdem(b.mes));
}

function mesParaOrdem(mes: string): number {
  const meses: Record<string, number> = {
    jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6,
    jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12,
  };
  const match = mes.match(/^([a-z]{3})\.(\d{2})$/);
  if (!match) return 0;
  const [, nomeMes, ano] = match;
  return (parseInt(ano) * 100) + (meses[nomeMes] || 0);
}

export function calcularResumoCategorias(
  movs: Movimentacao[],
  tipo: "Entrada" | "Saída"
): ResumoCategoria[] {
  const mapa = new Map<string, number>();
  let total = 0;

  for (const mov of movs) {
    if (mov.movimento !== tipo) continue;
    const cat = mov.categoria || "Sem categoria";
    mapa.set(cat, (mapa.get(cat) || 0) + mov.valorRecebido);
    total += mov.valorRecebido;
  }

  return Array.from(mapa.entries())
    .map(([categoria, valor]) => ({
      categoria,
      valor: Math.round(valor * 100) / 100,
      percentual: total > 0 ? Math.round((valor / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.valor - a.valor);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
