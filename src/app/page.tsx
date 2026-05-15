import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { fetchDashboardData } from "@/lib/sheets";
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

export const revalidate = 86400;

export default async function Home() {
  const data = await fetchDashboardData();

  const resumoMensal = calcularResumoMensal(data.movimentacoes);
  const categoriasEntrada = calcularResumoCategorias(data.movimentacoes, "Entrada");
  const categoriasSaida = calcularResumoCategorias(data.movimentacoes, "Saída");

  const mesAtual = resumoMensal.at(-1);
  const totalSaldo = data.saldos.reduce((acc, s) => acc + s.saldo, 0);

  const totalEntradas = data.movimentacoes
    .filter((m) => m.movimento === "Entrada")
    .reduce((acc, m) => acc + m.valorRecebido, 0);
  const totalSaidas = data.movimentacoes
    .filter((m) => m.movimento === "Saída")
    .reduce((acc, m) => acc + m.valorRecebido, 0);

  return (
    <div className="flex flex-col gap-6 p-6 pt-16 lg:pt-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark">Dashboard</h1>
          <p className="text-sm text-muted">Visao geral do fluxo de caixa</p>
        </div>
        <RefreshButton />
      </header>

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
            title={`Entradas ${mesAtual?.mes || ""}`}
            value={formatBRL(mesAtual?.entradas || 0)}
            icon={<TrendingUp size={20} />}
            trend="positive"
            subtitle={`Total geral: ${formatBRL(totalEntradas)}`}
            iconBg="bg-positive-light text-positive"
          />
        </div>
        <div className="animate-fade-in animate-fade-in-delay-2">
          <KpiCard
            title={`Saidas ${mesAtual?.mes || ""}`}
            value={formatBRL(mesAtual?.saidas || 0)}
            icon={<TrendingDown size={20} />}
            trend="negative"
            subtitle={`Total geral: ${formatBRL(totalSaidas)}`}
            iconBg="bg-negative-light text-negative"
          />
        </div>
        <div className="animate-fade-in animate-fade-in-delay-3">
          <KpiCard
            title={`Resultado ${mesAtual?.mes || ""}`}
            value={formatBRL(mesAtual?.resultado || 0)}
            icon={<DollarSign size={20} />}
            trend={(mesAtual?.resultado || 0) >= 0 ? "positive" : "negative"}
            subtitle="Entradas - Saidas do mes"
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
        <TabelaMovimentacoes movimentacoes={data.movimentacoes} />
      </section>

      <footer className="rounded-xl bg-dark px-6 py-4 text-center text-xs text-white/50">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} ·
        Dados atualizados automaticamente 1x ao dia · Lille Consulting
      </footer>
    </div>
  );
}
