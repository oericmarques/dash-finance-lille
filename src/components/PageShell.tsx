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
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
            <div>
              <h1 className="text-lg font-bold text-text tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] text-text-muted">
              {formatDateTimeBR(data.lastUpdated)}
            </span>
            <RefreshButton />
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-border px-6 py-2">
        <div className="flex flex-wrap items-center gap-3">
          <MonthFilter
            anos={anos}
            anoSelecionado={ano}
            mesesSelecionados={meses}
            onAnoChange={(a) => { setAno(a); setMeses([]); setCategoria(""); }}
            onMesesChange={setMeses}
            accentColor={accentColor}
          />

          <div className="h-4 w-px bg-border hidden sm:block" />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="rounded-md border border-border bg-white px-2.5 py-1 text-[11px] text-text-secondary outline-none focus:border-accent transition-colors"
          >
            <option value="">Todas categorias</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {categoria && (
            <button
              onClick={() => setCategoria("")}
              className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
            >
              limpar
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 p-6">
        {children(filtradas, ano)}
      </div>

      <footer className="px-6 py-2 text-center text-[10px] text-text-muted border-t border-border-light">
        Lille Consulting · Dados atualizados em {formatDateTimeBR(data.lastUpdated)}
      </footer>
    </div>
  );
}
