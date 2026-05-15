"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ResumoMensal } from "@/lib/types";
import { formatBRL } from "@/lib/analytics";

interface FluxoChartProps {
  data: ResumoMensal[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-card-border bg-card p-3 shadow-lg">
      <p className="mb-1 text-sm font-semibold">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.dataKey === "entradas" ? "Entradas" : "Saidas"}:{" "}
          {formatBRL(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function FluxoChart({ data }: FluxoChartProps) {
  const last12 = data.slice(-12);

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        Fluxo de Caixa Mensal
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last12} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) =>
                `${(v / 1000).toFixed(0)}k`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value: string) =>
                value === "entradas" ? "Entradas" : "Saidas"
              }
            />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar
              dataKey="entradas"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="saidas"
              fill="#dc2626"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
