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
    <div className="card-static px-4 py-3" style={{ boxShadow: "var(--shadow-lg)" }}>
      <p className="mb-1.5 text-xs font-bold text-text">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-[11px]" style={{ color: entry.color }}>
          {entry.name}: {formatBRL(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function StackedBarChart({ data, title, colors, labels }: StackedBarChartProps) {
  const chartData = data.map((d) => ({ ...d, mesLabel: mesLabel(d.mes) }));

  return (
    <div className="card-static overflow-hidden">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-4 pb-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f7" vertical={false} />
            <XAxis
              dataKey="mesLabel"
              tick={{ fontSize: 10, fill: "#8898aa" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#8898aa" }}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
              iconType="circle"
              iconSize={7}
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
