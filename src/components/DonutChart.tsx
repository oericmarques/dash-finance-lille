"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatBRL } from "@/lib/analytics";

interface DonutData {
  name: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutData[];
  title: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DonutData & { pct: string } }>;
}) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-lg">
      <p className="text-xs font-bold text-slate-800">{d.name}</p>
      <p className="text-xs text-slate-600">{formatBRL(d.value)}</p>
      <p className="text-[10px] text-slate-400">{d.pct}%</p>
    </div>
  );
}

export function DonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const enriched = data.map((d) => ({
    ...d,
    pct: total > 0 ? ((d.value / total) * 100).toFixed(1) : "0",
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex items-center gap-4 px-5 pb-4 pt-2">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={42}
                dataKey="value"
                paddingAngle={2}
                strokeWidth={0}
              >
                {enriched.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2.5">
          {enriched.map((d) => (
            <div key={d.name} className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-600 leading-none">{d.name}</span>
              <span className="text-xs font-semibold text-slate-800 tabular-nums">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
