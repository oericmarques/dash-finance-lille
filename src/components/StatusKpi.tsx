import { type ReactNode } from "react";

interface StatusKpiProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconBg: string;
}

export function StatusKpi({ icon, value, label, iconBg }: StatusKpiProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm border border-slate-100">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold tracking-tight text-slate-900 truncate">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
