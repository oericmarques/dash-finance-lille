"use client";

import { useState, useMemo, type ReactNode } from "react";
import type { DashboardData, Movimentacao } from "@/lib/types";
import {
  extrairAnos,
  extrairCategorias,
  filtrarPorAno,
  filtrarPorMeses,
  filtrarPorCategoria,
  formatDateTimeBR,
} from "@/lib/analytics";
import { MonthFilter } from "@/components/MonthFilter";
import { RefreshButton } from "@/components/RefreshButton";

const MES_KEYS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function getMesAtual(): string {
  return MES_KEYS[new Date().getMonth()];
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
  const [categoria, setCategoria] = useState("");

  const porAnoMes = useMemo(() => {
    const porAno = filtrarPorAno(data.movimentacoes, ano);
    if (meses.length === 0) return porAno;
    return filtrarPorMeses(porAno, meses);
  }, [data.movimentacoes, ano, meses]);

  const categorias = useMemo(() => extrairCategorias(porAnoMes), [porAnoMes]);

  const filtradas = useMemo(() => {
    return filtrarPorCategoria(porAnoMes, categoria);
  }, [porAnoMes, categoria]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`${headerColor} px-6 py-3.5 flex items-center justify-between`}>
        <h1 className="text-base font-bold text-white tracking-tight uppercase">
          {title} <span className="font-normal opacity-70">{ano}</span>
        </h1>
        <RefreshButton />
      </header>

      <div className="border-b border-slate-200 bg-white px-6 py-2.5 flex flex-wrap items-center gap-3">
        <MonthFilter
          anos={anos}
          anoSelecionado={ano}
          mesesSelecionados={meses}
          onAnoChange={(a) => { setAno(a); setMeses([]); setCategoria(""); }}
          onMesesChange={setMeses}
          accentColor={accentColor}
        />

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 outline-none focus:border-slate-400"
        >
          <option value="">Todas categorias</option>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {categoria && (
          <button
            onClick={() => setCategoria("")}
            className="text-[10px] text-slate-400 hover:text-slate-600"
          >
            limpar
          </button>
        )}
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
