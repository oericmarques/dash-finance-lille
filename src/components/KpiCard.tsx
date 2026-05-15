import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export function KpiCard({ title, value, icon, trend, subtitle }: KpiCardProps) {
  const trendColors = {
    positive: "text-positive",
    negative: "text-negative",
    neutral: "text-muted",
  };

  return (
    <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{title}</span>
        <span className="text-muted">{icon}</span>
      </div>
      <p
        className={`mt-2 text-2xl font-bold tracking-tight ${trend ? trendColors[trend] : ""}`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-muted">{subtitle}</p>
      )}
    </div>
  );
}
