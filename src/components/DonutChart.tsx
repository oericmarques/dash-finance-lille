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
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      <p className="text-sm font-bold">{d.name}</p>
      <p className="text-sm">{formatBRL(d.value)}</p>
      <p className="text-xs text-slate-500">{d.pct}%</p>
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
      <div className="border-b border-slate-100 bg-slate-800 px-5 py-3 rounded-t-2xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex items-center gap-4 p-4">
        <div className="h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={45}
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
        <div className="flex flex-col gap-2">
          {enriched.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-600">{d.name}</span>
              <span className="ml-auto text-xs font-bold text-slate-900">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
