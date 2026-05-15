import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: "positive" | "negative" | "neutral";
  subtitle?: string;
  iconBg?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  iconBg = "bg-accent-light text-accent",
}: KpiCardProps) {
  const trendColors = {
    positive: "text-positive",
    negative: "text-negative",
    neutral: "text-foreground",
  };

  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-muted">{title}</span>
        <div className={`rounded-xl p-2.5 ${iconBg}`}>{icon}</div>
      </div>
      <p
        className={`mt-3 text-2xl font-bold tracking-tight ${trend ? trendColors[trend] : ""}`}
      >
        {value}
      </p>
      {subtitle && (
        <p className="mt-1.5 text-xs text-muted">{subtitle}</p>
      )}
    </div>
  );
}
