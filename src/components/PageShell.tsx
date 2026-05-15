"use client";

import { useState, useMemo, type ReactNode } from "react";
import type { DashboardData, Movimentacao } from "@/lib/types";
import { extrairAnos, filtrarPorAno, filtrarPorMeses, formatDateTimeBR } from "@/lib/analytics";
import { MonthFilter } from "@/components/MonthFilter";
import { RefreshButton } from "@/components/RefreshButton";

const MES_KEYS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function getMesAtual(): string {
  const now = new Date();
  const idx = now.getMonth();
  return MES_KEYS[idx];
}

function getAnoAtual(): string {
  return new Date().getFullYear().toString();
}

interface PageShellProps {
  data: DashboardData;
  title: string;
  headerColor: string;
  accentColor?: string;
  children: (filtradas: Movimentacao[], ano: string) => ReactNode;
}

export function PageShell({ data, title, headerColor, accentColor, children }: PageShellProps) {
  const anos = extrairAnos(data.movimentacoes);
  const anoDefault = anos.includes(getAnoAtual()) ? getAnoAtual() : anos[0] || "2026";
  const [ano, setAno] = useState(anoDefault);
  const [meses, setMeses] = useState<string[]>([getMesAtual()]);

  const filtradas = useMemo(() => {
    const porAno = filtrarPorAno(data.movimentacoes, ano);
    if (meses.length === 0) return porAno;
    return filtrarPorMeses(porAno, meses);
  }, [data.movimentacoes, ano, meses]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`${headerColor} px-6 py-3.5 flex items-center justify-between`}>
        <h1 className="text-base font-bold text-white tracking-tight uppercase">
          {title} <span className="font-normal opacity-70">{ano}</span>
        </h1>
        <RefreshButton />
      </header>

      <div className="border-b border-slate-200 bg-white px-6 py-2.5">
        <MonthFilter
          anos={anos}
          anoSelecionado={ano}
          mesesSelecionados={meses}
          onAnoChange={(a) => { setAno(a); setMeses([]); }}
          onMesesChange={setMeses}
          accentColor={accentColor}
        />
      </div>

      <div className="flex-1 p-5">
        {children(filtradas, ano)}
      </div>

      <footer className="px-6 py-2.5 text-center text-[11px] text-slate-400 border-t border-slate-100">
        Atualizado: {formatDateTimeBR(data.lastUpdated)} · Lille Consulting
      </footer>
    </div>
  );
}
