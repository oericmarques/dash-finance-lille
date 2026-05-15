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
    <div className="rounded-lg border border-border bg-white px-3 py-2 shadow-md">
      <p className="text-[11px] font-semibold text-text">{d.name}</p>
      <p className="text-[11px] text-text-secondary">{formatBRL(d.value)} ({d.pct}%)</p>
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
    <div className="rounded-xl bg-white border border-border">
      <div className="px-5 py-4 border-b border-border-light">
        <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex items-center gap-5 px-5 py-4">
        <div className="h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enriched}
                cx="50%"
                cy="50%"
                outerRadius={65}
                innerRadius={40}
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
            <div key={d.name} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-[11px] text-text-secondary leading-none">{d.name}</span>
              <span className="text-[11px] font-semibold text-text tabular-nums">{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
