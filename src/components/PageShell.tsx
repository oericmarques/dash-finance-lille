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
  subtitle?: string;
  accentColor?: string;
  children: (filtradas: Movimentacao[], ano: string) => ReactNode;
}

export function PageShell({ data, title, subtitle, accentColor = "#0891b2", children }: PageShellProps) {
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
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-text tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-text-3 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-text-3 hidden sm:inline">
              {formatDateTimeBR(data.lastUpdated)}
            </span>
            <RefreshButton />
          </div>
        </div>

        <div className="card-static px-5 py-3 flex flex-wrap items-center gap-3">
          <MonthFilter
            anos={anos}
            anoSelecionado={ano}
            mesesSelecionados={meses}
            onAnoChange={(a) => { setAno(a); setMeses([]); setCategoria(""); }}
            onMesesChange={setMeses}
            accentColor={accentColor}
          />

          <div className="h-4 w-px bg-text-3/20 hidden sm:block" />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-[var(--radius-sm)] bg-bg px-3 py-1.5 text-[11px] text-text-2 outline-none border-none focus:ring-2 focus:ring-accent/20 transition-all"
          >
            <option value="">Todas categorias</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {categoria && (
            <button
              onClick={() => setCategoria("")}
              className="text-[10px] text-text-3 hover:text-text-2 transition-colors"
            >
              limpar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-8 py-6">
        {children(filtradas, ano)}
      </div>

      <footer className="px-8 py-3 text-center text-[10px] text-text-3">
        Lille Consulting · {formatDateTimeBR(data.lastUpdated)}
      </footer>
    </div>
  );
}
