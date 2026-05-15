import { Building2, Landmark, PiggyBank, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { fetchDashboardData } from "@/lib/sheets";
import {
  formatBRL,
  formatDateTimeBR,
} from "@/lib/analytics";
import type { Movimentacao } from "@/lib/types";
import { RefreshButton } from "@/components/RefreshButton";

export const revalidate = 86400;

const iconMap: Record<string, typeof Building2> = {
  "BANCO C6": CreditCard,
  "BANCO CONTA GLOBAL": Building2,
  "ASAAS": Landmark,
  "INVESTIMENTO": PiggyBank,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  "BANCO C6": { bg: "bg-accent-light", text: "text-accent", border: "border-accent/20" },
  "BANCO CONTA GLOBAL": { bg: "bg-purple-light", text: "text-purple", border: "border-purple/20" },
  "ASAAS": { bg: "bg-warning-light", text: "text-warning", border: "border-warning/20" },
  "INVESTIMENTO": { bg: "bg-positive-light", text: "text-positive", border: "border-positive/20" },
};

function getUltimasMovimentacoes(movs: Movimentacao[], limite: number): Movimentacao[] {
  return [...movs]
    .sort((a, b) => (b.data || "").localeCompare(a.data || ""))
    .slice(0, limite);
}

export default async function ContasPage() {
  const data = await fetchDashboardData();
  const total = data.saldos.reduce((acc, s) => acc + s.saldo, 0);

  const entradasRecentes = getUltimasMovimentacoes(
    data.movimentacoes.filter((m) => m.movimento === "Entrada"),
    5
  );
  const saidasRecentes = getUltimasMovimentacoes(
    data.movimentacoes.filter((m) => m.movimento === "Saída"),
    5
  );

  return (
    <div className="flex flex-col gap-6 p-6 pt-16 lg:pt-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-dark">Contas Bancarias</h1>
          <p className="text-sm text-muted">Posicao consolidada e ultimas movimentacoes</p>
        </div>
        <RefreshButton />
      </header>

      <div className="rounded-2xl bg-dark p-6">
        <p className="text-sm text-white/50">Saldo Total Consolidado</p>
        <p className="mt-2 text-4xl font-bold text-white">{formatBRL(total)}</p>
        <p className="mt-1 text-sm text-white/40">{data.saldos.length} contas ativas</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.saldos.map((s) => {
          const Icon = iconMap[s.banco] || Building2;
          const colors = colorMap[s.banco] || { bg: "bg-accent-light", text: "text-accent", border: "border-accent/20" };
          const pct = total > 0 ? Math.round((s.saldo / total) * 100) : 0;

          return (
            <div
              key={s.banco}
              className={`rounded-2xl border ${colors.border} bg-white p-5 shadow-sm`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-3 ${colors.bg} ${colors.text}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-dark">{s.banco}</h3>
                  {s.ultimaAtualizacao && (
                    <p className="text-xs text-muted">Atualizado: {s.ultimaAtualizacao}</p>
                  )}
                </div>
                <span className={`text-xl font-bold ${s.saldo > 0 ? "text-positive" : "text-negative"}`}>
                  {formatBRL(s.saldo)}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                  <span>Participacao</span>
                  <span className="font-semibold text-dark">{pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-background">
                  <div
                    className={`h-2 rounded-full ${colors.bg.replace("-light", "")}`}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: colors.text.includes("accent") ? "#0891b2"
                        : colors.text.includes("purple") ? "#7c3aed"
                        : colors.text.includes("warning") ? "#ea580c"
                        : "#059669",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-card-border bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-dark">Ultimas Entradas</h3>
          <div className="space-y-3">
            {entradasRecentes.map((m, i) => (
              <div key={`e-${i}`} className="flex items-center gap-3 rounded-xl bg-background p-3">
                <TrendingUp size={16} className="text-positive" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.cliente}</p>
                  <p className="text-xs text-muted truncate">{m.descricao}</p>
                </div>
                <span className="text-sm font-bold text-positive tabular-nums">
                  +{formatBRL(m.valorRecebido)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-card-border bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-dark">Ultimas Saidas</h3>
          <div className="space-y-3">
            {saidasRecentes.map((m, i) => (
              <div key={`s-${i}`} className="flex items-center gap-3 rounded-xl bg-background p-3">
                <TrendingDown size={16} className="text-negative" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.cliente || m.descricao}</p>
                  <p className="text-xs text-muted truncate">{m.categoria}</p>
                </div>
                <span className="text-sm font-bold text-negative tabular-nums">
                  -{formatBRL(m.valorRecebido)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="rounded-xl bg-dark px-6 py-4 text-center text-xs text-white/50">
        Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} · Lille Consulting
      </footer>
    </div>
  );
}
