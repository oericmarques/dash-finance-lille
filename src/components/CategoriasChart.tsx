"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ResumoCategoria } from "@/lib/types";
import { formatBRL } from "@/lib/analytics";

const COLORS = [
  "#0891b2", "#059669", "#ea580c", "#7c3aed",
  "#ec4899", "#0284c7", "#d97706", "#64748b",
  "#0d9488", "#65a30d",
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
    <div className="rounded-xl border border-card-border bg-white p-3 shadow-xl">
      <p className="text-sm font-bold text-dark">{item.categoria}</p>
      <p className="text-sm text-accent">{formatBRL(item.valor)}</p>
      <p className="text-xs text-muted">{item.percentual}% do total</p>
    </div>
  );
}

export function CategoriasChart({ data, title }: CategoriasChartProps) {
  const top8 = data.slice(0, 8);
  const total = data.reduce((acc, d) => acc + d.valor, 0);

  return (
    <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark">{title}</h2>
        <p className="text-xs text-muted">Total: {formatBRL(total)}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-52 w-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={top8}
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={50}
                dataKey="valor"
                nameKey="categoria"
                paddingAngle={3}
                strokeWidth={0}
              >
                {top8.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden">
          {top8.map((cat, i) => (
            <div key={cat.categoria} className="flex items-center gap-2.5">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="truncate text-xs text-muted">{cat.categoria}</span>
              <span className="ml-auto shrink-0 text-xs font-semibold text-dark">
                {cat.percentual}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
