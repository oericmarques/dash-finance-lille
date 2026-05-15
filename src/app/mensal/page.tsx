import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { fetchDashboardData } from "@/lib/sheets";
import {
  calcularResumoMensal,
  formatBRL,
  mesParaLabel,
  mesParaSlug,
  formatDateTimeBR,
} from "@/lib/analytics";
import { RefreshButton } from "@/components/RefreshButton";

export const revalidate = 86400;

export default async function MensalPage() {
  const data = await fetchDashboardData();
  const resumo = calcularResumoMensal(data.movimentacoes).reverse();

  return (
    <div className="flex flex-col gap-6 p-6 pt-16 lg:pt-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark">Visao Mensal</h1>
          <p className="text-sm text-muted">Clique em um mes para ver detalhes</p>
        </div>
        <RefreshButton />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumo.map((mes) => {
          const positivo = mes.resultado >= 0;
          return (
            <Link
              key={mes.mes}
              href={`/mensal/${mesParaSlug(mes.mes)}`}
              className="group rounded-2xl border border-card-border bg-white p-5 shadow-sm transition-all hover:border-accent/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-dark">{mesParaLabel(mes.mes)}</h3>
                <div
                  className={`rounded-full p-1.5 ${positivo ? "bg-positive-light text-positive" : "bg-negative-light text-negative"}`}
                >
                  {positivo ? <TrendingUp size={16} /> : <ArrowDownRight size={16} />}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight size={14} className="text-positive" />
                    <span className="text-sm text-muted">Entradas</span>
                  </div>
                  <span className="text-sm font-semibold text-positive tabular-nums">
                    {formatBRL(mes.entradas)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight size={14} className="text-negative" />
                    <span className="text-sm text-muted">Saidas</span>
                  </div>
                  <span className="text-sm font-semibold text-negative tabular-nums">
                    {formatBRL(mes.saidas)}
                  </span>
                </div>
                <div className="border-t border-card-border pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-dark">Resultado</span>
                    <span
                      className={`text-base font-bold tabular-nums ${positivo ? "text-positive" : "text-negative"}`}
                    >
                      {formatBRL(mes.resultado)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-center text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Ver detalhes do mes
              </p>
            </Link>
          );
        })}
      </div>

      <footer className="rounded-xl bg-dark px-6 py-4 text-center text-xs text-white/50">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} · Lille Consulting
      </footer>
    </div>
  );
}
