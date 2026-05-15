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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Lille Finance
          </h1>
          <p className="text-sm text-muted">
            Fluxo de caixa em tempo real
          </p>
        </div>
        <RefreshButton />
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Saldo em Contas"
          value={formatBRL(totalSaldo)}
          icon={<Wallet size={20} />}
          trend="neutral"
          subtitle={`${data.saldos.length} contas ativas`}
        />
        <KpiCard
          title={`Entradas ${mesAtual?.mes || ""}`}
          value={formatBRL(mesAtual?.entradas || 0)}
          icon={<TrendingUp size={20} />}
          trend="positive"
          subtitle={`Total geral: ${formatBRL(totalEntradas)}`}
        />
        <KpiCard
          title={`Saidas ${mesAtual?.mes || ""}`}
          value={formatBRL(mesAtual?.saidas || 0)}
          icon={<TrendingDown size={20} />}
          trend="negative"
          subtitle={`Total geral: ${formatBRL(totalSaidas)}`}
        />
        <KpiCard
          title={`Resultado ${mesAtual?.mes || ""}`}
          value={formatBRL(mesAtual?.resultado || 0)}
          icon={<DollarSign size={20} />}
          trend={
            (mesAtual?.resultado || 0) >= 0 ? "positive" : "negative"
          }
          subtitle="Entradas - Saidas do mes"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FluxoChart data={resumoMensal} />
        </div>
        <SaldosBanco saldos={data.saldos} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoriasChart
          data={categoriasEntrada}
          title="Categorias de Entrada"
        />
        <CategoriasChart
          data={categoriasSaida}
          title="Categorias de Saida"
        />
      </section>

      <section>
        <TabelaMovimentacoes movimentacoes={data.movimentacoes} />
      </section>

      <footer className="border-t border-card-border py-4 text-center text-xs text-muted">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} ·
        Dados atualizados automaticamente 1x ao dia · Lille Consulting
      </footer>
    </div>
  );
}
