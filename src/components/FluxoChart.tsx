"use client";

import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ResumoMensal } from "@/lib/types";
import { formatBRL, mesParaSlug } from "@/lib/analytics";

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
  const entradas = payload.find((p) => p.dataKey === "entradas")?.value || 0;
  const saidas = payload.find((p) => p.dataKey === "saidas")?.value || 0;
  const resultado = entradas - saidas;

  return (
    <div className="rounded-xl border border-card-border bg-white p-4 shadow-xl">
      <p className="mb-2 text-sm font-bold text-dark">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.dataKey === "entradas" ? "Entradas" : "Saidas"}: {formatBRL(entry.value)}
        </p>
      ))}
      <div className="mt-2 border-t border-card-border pt-2">
        <p className={`text-sm font-semibold ${resultado >= 0 ? "text-positive" : "text-negative"}`}>
          Resultado: {formatBRL(resultado)}
        </p>
      </div>
      <p className="mt-1 text-xs text-muted">Clique para detalhes</p>
    </div>
  );
}

export function FluxoChart({ data }: FluxoChartProps) {
  const router = useRouter();
  const last12 = data.slice(-12);

  return (
    <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-dark">Fluxo de Caixa Mensal</h2>
        <p className="text-xs text-muted">Ultimos 12 meses - clique em uma barra para detalhes</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={last12}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            onClick={(state: Record<string, unknown>) => {
              const ap = state?.activePayload as Array<{ payload: { mes: string } }> | undefined;
              if (ap?.[0]?.payload) {
                router.push(`/mensal/${mesParaSlug(ap[0].payload.mes)}`);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value: string) => value === "entradas" ? "Entradas" : "Saidas"}
              wrapperStyle={{ fontSize: 13 }}
            />
            <Bar dataKey="entradas" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={36} />
            <Bar dataKey="saidas" fill="#dc2626" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
