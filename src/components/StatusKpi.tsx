import { type ReactNode } from "react";

interface StatusKpiProps {
  icon: ReactNode;
  value: string;
  label: string;
  iconBg: string;
}

export function StatusKpi({ icon, value, label, iconBg }: StatusKpiProps) {
  return (
    <div className="flex items-center gap-3.5 rounded-xl bg-white px-5 py-4 shadow-sm border border-slate-100">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold tracking-tight text-slate-900 truncate leading-tight">{value}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
