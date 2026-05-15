import { Building2, Landmark, PiggyBank, CreditCard } from "lucide-react";
import type { SaldoBanco } from "@/lib/types";
import { formatBRL } from "@/lib/analytics";

interface SaldosBancoProps {
  saldos: SaldoBanco[];
}

const iconMap: Record<string, typeof Building2> = {
  "BANCO C6": CreditCard,
  "BANCO CONTA GLOBAL": Building2,
  "ASAAS": Landmark,
  "INVESTIMENTO": PiggyBank,
};

const colorMap: Record<string, string> = {
  "BANCO C6": "bg-accent-light text-accent",
  "BANCO CONTA GLOBAL": "bg-purple-light text-purple",
  "ASAAS": "bg-warning-light text-warning",
  "INVESTIMENTO": "bg-positive-light text-positive",
};

export function SaldosBanco({ saldos }: SaldosBancoProps) {
  const total = saldos.reduce((acc, s) => acc + s.saldo, 0);

  return (
    <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-dark">Saldos Bancarios</h2>
        <p className="text-xs text-muted">{saldos.length} contas</p>
      </div>
      <div className="space-y-3">
        {saldos.map((s) => {
          const Icon = iconMap[s.banco] || Building2;
          const color = colorMap[s.banco] || "bg-accent-light text-accent";
          return (
            <div
              key={s.banco}
              className="flex items-center gap-3 rounded-xl border border-card-border bg-background p-3.5"
            >
              <div className={`rounded-lg p-2 ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-dark">{s.banco}</p>
                {s.ultimaAtualizacao && (
                  <p className="text-xs text-muted">Atualizado: {s.ultimaAtualizacao}</p>
                )}
              </div>
              <span
                className={`text-sm font-bold tabular-nums ${s.saldo > 0 ? "text-positive" : "text-negative"}`}
              >
                {formatBRL(s.saldo)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl bg-dark p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/70">Total Consolidado</span>
          <span className="text-xl font-bold text-white">{formatBRL(total)}</span>
        </div>
      </div>
    </div>
  );
}
