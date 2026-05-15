import { fetchDashboardData } from "@/lib/sheets";
import { formatDateTimeBR } from "@/lib/analytics";
import { TabelaMovimentacoes } from "@/components/TabelaMovimentacoes";
import { RefreshButton } from "@/components/RefreshButton";

export const revalidate = 86400;

export default async function MovimentacoesPage() {
  const data = await fetchDashboardData();

  return (
    <div className="flex flex-col gap-6 p-6 pt-16 lg:pt-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark">Movimentacoes</h1>
          <p className="text-sm text-muted">
            Todas as movimentacoes financeiras ({data.movimentacoes.length} registros)
          </p>
        </div>
        <RefreshButton />
      </header>

      <TabelaMovimentacoes movimentacoes={data.movimentacoes} />

      <footer className="rounded-xl bg-dark px-6 py-4 text-center text-xs text-white/50">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} · Lille Consulting
      </footer>
    </div>
  );
}
