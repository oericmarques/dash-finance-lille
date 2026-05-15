"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRefresh() {
    setLoading(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-card-border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-background disabled:opacity-50"
    >
      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
      {loading ? "Atualizando..." : "Atualizar agora"}
    </button>
  );
}
