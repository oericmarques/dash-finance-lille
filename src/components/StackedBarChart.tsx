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
} from "recharts";
import type { ResumoMensal } from "@/lib/types";
import { formatBRL, mesLabel } from "@/lib/analytics";

interface StackedBarChartProps {
  data: ResumoMensal[];
  title: string;
  colors: { pago: string; aVencer: string; vencido: string };
  labels: { pago: string; aVencer: string; vencido: string };
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string; name: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
      <p className="mb-1 text-xs font-bold text-slate-800">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatBRL(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function StackedBarChart({ data, title, colors, labels }: StackedBarChartProps) {
  const chartData = data.map((d) => ({ ...d, mesLabel: mesLabel(d.mes) }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-3 pb-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="mesLabel"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
            {labels.pago && (
              <Bar dataKey="pago" name={labels.pago} fill={colors.pago} stackId="a" radius={[0, 0, 0, 0]} />
            )}
            {labels.aVencer && (
              <Bar dataKey="aVencer" name={labels.aVencer} fill={colors.aVencer} stackId="a" radius={[0, 0, 0, 0]} />
            )}
            {labels.vencido && (
              <Bar dataKey="vencido" name={labels.vencido} fill={colors.vencido} stackId="a" radius={[3, 3, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
