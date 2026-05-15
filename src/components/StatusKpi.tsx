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
    <div className="card px-6 py-5 flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-text-3 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-text tracking-tight truncate leading-none">{value}</p>
        {trend && <p className="text-[10px] text-text-3 mt-1">{trend}</p>}
      </div>
    </div>
  );
}
