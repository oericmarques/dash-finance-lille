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
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <p className="mb-1.5 text-sm font-bold text-slate-900">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatBRL(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function StackedBarChart({ data, title, colors, labels }: StackedBarChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    mesLabel: mesLabel(d.mes),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-800 px-5 py-3 rounded-t-2xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="mesLabel" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="pago" name={labels.pago} fill={colors.pago} stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="aVencer" name={labels.aVencer} fill={colors.aVencer} stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="vencido" name={labels.vencido} fill={colors.vencido} stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
