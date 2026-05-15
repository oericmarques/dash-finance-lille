"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import type { DashboardData } from "@/lib/types";
import {
  calcularResumoMensal,
  calcularResumoCategorias,
  formatBRL,
  formatDateTimeBR,
} from "@/lib/analytics";
import { KpiCard } from "@/components/KpiCard";
import { FluxoChart } from "@/components/FluxoChart";
import { CategoriasChart } from "@/components/CategoriasChart";
import { SaldosBanco } from "@/components/SaldosBanco";
import { TabelaMovimentacoes } from "@/components/TabelaMovimentacoes";
import { RefreshButton } from "@/components/RefreshButton";
import { FilterBar, aplicarFiltros, type Filtros } from "@/components/FilterBar";

interface DashboardClientProps {
  data: DashboardData;
}

function detectarAnoAtual(data: DashboardData): string {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear().toString();
  const sufixo = anoAtual.slice(2);
  const temDadosAnoAtual = data.movimentacoes.some((m) => m.mes.endsWith(`.${sufixo}`));
  if (temDadosAnoAtual) return anoAtual;

  const anos = new Set<string>();
  for (const m of data.movimentacoes) {
    const match = m.mes.match(/\.(\d{2})$/);
    if (match) anos.add(`20${match[1]}`);
  }
  const sorted = Array.from(anos).sort().reverse();
  return sorted[0] || anoAtual;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const anoInicial = detectarAnoAtual(data);

  const [filtros, setFiltros] = useState<Filtros>({
    ano: anoInicial,
    mes: "todos",
    categoria: "todos",
    tipo: "todos",
    status: "todos",
  });

  const movsFiltradas = useMemo(
    () => aplicarFiltros(data.movimentacoes, filtros),
    [data.movimentacoes, filtros]
  );

  const resumoMensal = useMemo(
    () => calcularResumoMensal(movsFiltradas),
    [movsFiltradas]
  );

  const categoriasEntrada = useMemo(
    () => calcularResumoCategorias(movsFiltradas, "Entrada"),
    [movsFiltradas]
  );

  const categoriasSaida = useMemo(
    () => calcularResumoCategorias(movsFiltradas, "Saída"),
    [movsFiltradas]
  );

  const totalEntradas = movsFiltradas
    .filter((m) => m.movimento === "Entrada")
    .reduce((acc, m) => acc + m.valorRecebido, 0);

  const totalSaidas = movsFiltradas
    .filter((m) => m.movimento === "Saída")
    .reduce((acc, m) => acc + m.valorRecebido, 0);

  const resultado = totalEntradas - totalSaidas;
  const totalSaldo = data.saldos.reduce((acc, s) => acc + s.saldo, 0);

  const periodoLabel = filtros.mes !== "todos"
    ? filtros.mes
    : filtros.ano;

  return (
    <div className="flex flex-col gap-6 p-6 pt-16 lg:pt-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark">Dashboard</h1>
          <p className="text-sm text-muted">
            Visao geral do fluxo de caixa
            {movsFiltradas.length > 0 && ` · ${movsFiltradas.length} movimentacoes`}
          </p>
        </div>
        <RefreshButton />
      </header>

      <FilterBar
        filtros={filtros}
        onChange={setFiltros}
        movimentacoes={data.movimentacoes}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in">
          <KpiCard
            title="Saldo em Contas"
            value={formatBRL(totalSaldo)}
            icon={<Wallet size={20} />}
            trend="neutral"
            subtitle={`${data.saldos.length} contas ativas`}
            iconBg="bg-accent-light text-accent"
          />
        </div>
        <div className="animate-fade-in animate-fade-in-delay-1">
          <KpiCard
            title={`Entradas ${periodoLabel}`}
            value={formatBRL(totalEntradas)}
            icon={<TrendingUp size={20} />}
            trend="positive"
            subtitle={`${movsFiltradas.filter((m) => m.movimento === "Entrada").length} lancamentos`}
            iconBg="bg-positive-light text-positive"
          />
        </div>
        <div className="animate-fade-in animate-fade-in-delay-2">
          <KpiCard
            title={`Saidas ${periodoLabel}`}
            value={formatBRL(totalSaidas)}
            icon={<TrendingDown size={20} />}
            trend="negative"
            subtitle={`${movsFiltradas.filter((m) => m.movimento === "Saída").length} lancamentos`}
            iconBg="bg-negative-light text-negative"
          />
        </div>
        <div className="animate-fade-in animate-fade-in-delay-3">
          <KpiCard
            title={`Resultado ${periodoLabel}`}
            value={formatBRL(resultado)}
            icon={<DollarSign size={20} />}
            trend={resultado >= 0 ? "positive" : "negative"}
            subtitle="Entradas - Saidas"
            iconBg="bg-purple-light text-purple"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FluxoChart data={resumoMensal} />
        </div>
        <SaldosBanco saldos={data.saldos} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoriasChart data={categoriasEntrada} title="Categorias de Entrada" />
        <CategoriasChart data={categoriasSaida} title="Categorias de Saida" />
      </section>

      <section>
        <TabelaMovimentacoes movimentacoes={movsFiltradas} />
      </section>

      <footer className="rounded-xl bg-dark px-6 py-4 text-center text-xs text-white/50">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} ·
        Dados atualizados automaticamente 1x ao dia · Lille Consulting
      </footer>
    </div>
  );
}
