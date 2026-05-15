"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { ResumoCategoria } from "@/lib/types";
import { formatBRL } from "@/lib/analytics";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#64748b",
  "#06b6d4",
  "#84cc16",
];

interface CategoriasChartProps {
  data: ResumoCategoria[];
  title: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ResumoCategoria }>;
}) {
  if (!active || !payload?.[0]) return null;
  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-card-border bg-card p-3 shadow-lg">
      <p className="text-sm font-semibold">{item.categoria}</p>
      <p className="text-sm">{formatBRL(item.valor)}</p>
      <p className="text-xs text-muted">{item.percentual}%</p>
    </div>
  );
}

export function CategoriasChart({ data, title }: CategoriasChartProps) {
  const top8 = data.slice(0, 8);

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top8}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              dataKey="valor"
              nameKey="categoria"
              paddingAngle={2}
            >
              {top8.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value: string) =>
                value.length > 18 ? `${value.slice(0, 18)}...` : value
              }
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
