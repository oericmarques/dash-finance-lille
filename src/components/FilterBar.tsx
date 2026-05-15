"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { Movimentacao } from "@/lib/types";

export interface Filtros {
  ano: string;
  mes: string;
  categoria: string;
  tipo: "todos" | "Entrada" | "Saída";
  status: "todos" | "realizado" | "pendente";
}

interface FilterBarProps {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  movimentacoes: Movimentacao[];
}

function extrairAnos(movs: Movimentacao[]): string[] {
  const anos = new Set<string>();
  for (const m of movs) {
    const match = m.mes.match(/\.(\d{2})$/);
    if (match) anos.add(`20${match[1]}`);
  }
  return Array.from(anos).sort().reverse();
}

function extrairMeses(movs: Movimentacao[], ano: string): string[] {
  const sufixo = ano.slice(2);
  const mesesOrdem = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const mesesLabel: Record<string, string> = {
    jan: "Janeiro", fev: "Fevereiro", mar: "Marco", abr: "Abril",
    mai: "Maio", jun: "Junho", jul: "Julho", ago: "Agosto",
    set: "Setembro", out: "Outubro", nov: "Novembro", dez: "Dezembro",
  };

  const presentes = new Set<string>();
  for (const m of movs) {
    if (m.mes.endsWith(`.${sufixo}`)) {
      const prefix = m.mes.split(".")[0];
      presentes.add(prefix);
    }
  }

  return mesesOrdem
    .filter((m) => presentes.has(m))
    .map((m) => `${mesesLabel[m]}|${m}.${sufixo}`);
}

function extrairCategorias(movs: Movimentacao[]): string[] {
  const cats = new Set<string>();
  for (const m of movs) {
    if (m.categoria) cats.add(m.categoria);
  }
  return Array.from(cats).sort();
}

function contarFiltrosAtivos(f: Filtros): number {
  let n = 0;
  if (f.mes !== "todos") n++;
  if (f.categoria !== "todos") n++;
  if (f.tipo !== "todos") n++;
  if (f.status !== "todos") n++;
  return n;
}

export function FilterBar({ filtros, onChange, movimentacoes }: FilterBarProps) {
  const anos = extrairAnos(movimentacoes);
  const meses = extrairMeses(movimentacoes, filtros.ano);
  const categorias = extrairCategorias(movimentacoes);
  const ativos = contarFiltrosAtivos(filtros);

  function limparFiltros() {
    onChange({ ano: filtros.ano, mes: "todos", categoria: "todos", tipo: "todos", status: "todos" });
  }

  return (
    <div className="rounded-2xl border border-card-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-dark">
          <SlidersHorizontal size={16} className="text-accent" />
          Filtros
        </div>

        <select
          value={filtros.ano}
          onChange={(e) => onChange({ ...filtros, ano: e.target.value, mes: "todos" })}
          className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm font-medium outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
        >
          {anos.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select
          value={filtros.mes}
          onChange={(e) => onChange({ ...filtros, mes: e.target.value })}
          className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
        >
          <option value="todos">Todos os meses</option>
          {meses.map((m) => {
            const [label, value] = m.split("|");
            return <option key={value} value={value}>{label}</option>;
          })}
        </select>

        <select
          value={filtros.categoria}
          onChange={(e) => onChange({ ...filtros, categoria: e.target.value })}
          className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
        >
          <option value="todos">Todas categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filtros.tipo}
          onChange={(e) => onChange({ ...filtros, tipo: e.target.value as Filtros["tipo"] })}
          className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
        >
          <option value="todos">Entradas e Saidas</option>
          <option value="Entrada">Somente Entradas</option>
          <option value="Saída">Somente Saidas</option>
        </select>

        <select
          value={filtros.status}
          onChange={(e) => onChange({ ...filtros, status: e.target.value as Filtros["status"] })}
          className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
        >
          <option value="todos">Realizados e Pendentes</option>
          <option value="realizado">Somente Realizados</option>
          <option value="pendente">Somente Pendentes</option>
        </select>

        {ativos > 0 && (
          <button
            onClick={limparFiltros}
            className="flex items-center gap-1.5 rounded-xl bg-negative-light px-3 py-2 text-sm font-medium text-negative transition-colors hover:bg-negative-bg"
          >
            <X size={14} />
            Limpar ({ativos})
          </button>
        )}
      </div>
    </div>
  );
}

export function aplicarFiltros(movs: Movimentacao[], filtros: Filtros): Movimentacao[] {
  const sufixoAno = filtros.ano.slice(2);

  return movs.filter((m) => {
    if (!m.mes.endsWith(`.${sufixoAno}`)) return false;
    if (filtros.mes !== "todos" && m.mes !== filtros.mes) return false;
    if (filtros.categoria !== "todos" && m.categoria !== filtros.categoria) return false;
    if (filtros.tipo !== "todos" && m.movimento !== filtros.tipo) return false;
    if (filtros.status !== "todos" && m.status !== filtros.status) return false;
    return true;
  });
}
