"use client";

import { useState, useMemo, type ReactNode } from "react";
import type { DashboardData, Movimentacao } from "@/lib/types";
import { extrairAnos, filtrarPorAno, filtrarPorMeses, formatDateTimeBR } from "@/lib/analytics";
import { MonthFilter } from "@/components/MonthFilter";
import { RefreshButton } from "@/components/RefreshButton";

interface PageShellProps {
  data: DashboardData;
  title: string;
  headerColor: string;
  children: (filtradas: Movimentacao[], ano: string) => ReactNode;
}

export function PageShell({ data, title, headerColor, children }: PageShellProps) {
  const anos = extrairAnos(data.movimentacoes);
  const [ano, setAno] = useState(anos[0] || "2026");
  const [meses, setMeses] = useState<string[]>([]);

  const filtradas = useMemo(() => {
    const porAno = filtrarPorAno(data.movimentacoes, ano);
    if (meses.length === 0) return porAno;
    return filtrarPorMeses(porAno, meses);
  }, [data.movimentacoes, ano, meses]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-52 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-5">
        <MonthFilter
          anos={anos}
          anoSelecionado={ano}
          mesesSelecionados={meses}
          onAnoChange={(a) => { setAno(a); setMeses([]); }}
          onMesesChange={setMeses}
        />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className={`${headerColor} px-6 py-4 flex items-center justify-between`}>
          <h1 className="text-lg font-bold text-white tracking-tight">
            {title} {ano}
          </h1>
          <RefreshButton />
        </header>

        <div className="flex-1 p-5">
          {children(filtradas, ano)}
        </div>

        <footer className="px-6 py-3 text-center text-xs text-slate-400 border-t border-slate-200">
          Ultima atualizacao: {formatDateTimeBR(data.lastUpdated)} · Lille Consulting
        </footer>
      </div>
    </div>
  );
}
