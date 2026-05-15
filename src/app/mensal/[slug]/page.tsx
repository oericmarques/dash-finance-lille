import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Hash,
} from "lucide-react";
import { fetchDashboardData } from "@/lib/sheets";
import {
  calcularResumoCategorias,
  formatBRL,
  mesParaLabel,
  slugParaMes,
  formatDateTimeBR,
} from "@/lib/analytics";
import { KpiCard } from "@/components/KpiCard";
import { CategoriasChart } from "@/components/CategoriasChart";
import { TabelaMovimentacoes } from "@/components/TabelaMovimentacoes";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MesDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const mes = slugParaMes(slug);
  const data = await fetchDashboardData();

  const movsMes = data.movimentacoes.filter((m) => m.mes === mes);
  const entradas = movsMes.filter((m) => m.movimento === "Entrada");
  const saidas = movsMes.filter((m) => m.movimento === "Saída");
  const totalEntradas = entradas.reduce((acc, m) => acc + m.valorRecebido, 0);
  const totalSaidas = saidas.reduce((acc, m) => acc + m.valorRecebido, 0);
  const resultado = totalEntradas - totalSaidas;

  const categoriasEntrada = calcularResumoCategorias(movsMes, "Entrada");
  const categoriasSaida = calcularResumoCategorias(movsMes, "Saída");

  return (
    <div className="flex flex-col gap-6 p-6 pt-16 lg:pt-6">
      <header>
        <Link
          href="/mensal"
          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Voltar para visao mensal
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-dark">
          {mesParaLabel(mes)}
        </h1>
        <p className="text-sm text-muted">
          {movsMes.length} movimentacoes neste mes
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Entradas"
          value={formatBRL(totalEntradas)}
          icon={<TrendingUp size={20} />}
          trend="positive"
          subtitle={`${entradas.length} lancamentos`}
          iconBg="bg-positive-light text-positive"
        />
        <KpiCard
          title="Saidas"
          value={formatBRL(totalSaidas)}
          icon={<TrendingDown size={20} />}
          trend="negative"
          subtitle={`${saidas.length} lancamentos`}
          iconBg="bg-negative-light text-negative"
        />
        <KpiCard
          title="Resultado"
          value={formatBRL(resultado)}
          icon={<DollarSign size={20} />}
          trend={resultado >= 0 ? "positive" : "negative"}
          subtitle={resultado >= 0 ? "Mes positivo" : "Mes negativo"}
          iconBg="bg-purple-light text-purple"
        />
        <KpiCard
          title="Total Movimentacoes"
          value={String(movsMes.length)}
          icon={<Hash size={20} />}
          trend="neutral"
          subtitle={`${entradas.length} entradas, ${saidas.length} saidas`}
          iconBg="bg-accent-light text-accent"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoriasChart data={categoriasEntrada} title="Categorias de Entrada" />
        <CategoriasChart data={categoriasSaida} title="Categorias de Saida" />
      </section>

      <section>
        <TabelaMovimentacoes movimentacoes={movsMes} />
      </section>

      <footer className="rounded-xl bg-dark px-6 py-4 text-center text-xs text-white/50">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} · Lille Consulting
      </footer>
    </div>
  );
}
