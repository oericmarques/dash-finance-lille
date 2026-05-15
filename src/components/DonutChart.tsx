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
    <div className="card-static px-4 py-3" style={{ boxShadow: "var(--shadow-lg)" }}>
      <p className="text-xs font-bold text-text">{d.name}</p>
      <p className="text-[11px] text-text-2">{formatBRL(d.value)} ({d.pct}%)</p>
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
    <div className="card-static overflow-hidden">
      <div className="px-6 pt-5 pb-2">
        <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex items-center gap-6 px-6 pb-5 pt-2">
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
                paddingAngle={3}
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
        <div className="flex flex-col gap-3">
          {enriched.map((d) => (
            <div key={d.name} className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <div>
                <span className="text-[11px] text-text-2 block leading-none">{d.name}</span>
                <span className="text-xs font-bold text-text tabular-nums">{d.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
