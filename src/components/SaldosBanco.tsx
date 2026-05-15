import { Building2 } from "lucide-react";
import type { SaldoBanco } from "@/lib/types";
import { formatBRL } from "@/lib/analytics";

interface SaldosBancoProps {
  saldos: SaldoBanco[];
}

export function SaldosBanco({ saldos }: SaldosBancoProps) {
  const total = saldos.reduce((acc, s) => acc + s.saldo, 0);

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">Saldos Bancarios</h2>
      <div className="space-y-3">
        {saldos.map((s) => (
          <div
            key={s.banco}
            className="flex items-center justify-between rounded-lg bg-background px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-muted" />
              <span className="text-sm font-medium">{s.banco}</span>
            </div>
            <span
              className={`text-sm font-bold ${s.saldo > 0 ? "text-positive" : "text-negative"}`}
            >
              {formatBRL(s.saldo)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-card-border px-4 pt-3">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-base font-bold text-accent">
            {formatBRL(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
