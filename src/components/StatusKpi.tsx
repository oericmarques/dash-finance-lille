import { type ReactNode } from "react";

interface StatusKpiProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconBg: string;
  trend?: string;
}

export function StatusKpi({ icon, value, label, iconBg, trend }: StatusKpiProps) {
  return (
    <div className="rounded-xl bg-white border border-border px-5 py-4 flex items-center gap-4 transition-shadow hover:shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-text-secondary mb-0.5">{label}</p>
        <p className="text-xl font-bold text-text tracking-tight truncate leading-tight">{value}</p>
        {trend && <p className="text-[10px] text-text-muted mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
