"use client";

import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { Movimentacao } from "@/lib/types";
import { formatBRL, formatDateBR } from "@/lib/analytics";

interface TabelaMovimentacoesProps {
  movimentacoes: Movimentacao[];
  compact?: boolean;
}

export function TabelaMovimentacoes({
  movimentacoes,
  compact = false,
}: TabelaMovimentacoesProps) {
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "Entrada" | "Saída">("todos");
  const [pagina, setPagina] = useState(0);
  const porPagina = compact ? 10 : 20;

  const sorted = [...movimentacoes].sort(
    (a, b) => (b.data || "").localeCompare(a.data || "")
  );

  const filtrados = sorted.filter((m) => {
    const matchTexto =
      !filtro ||
      m.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      m.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
      m.categoria.toLowerCase().includes(filtro.toLowerCase());
    const matchTipo = tipoFiltro === "todos" || m.movimento === tipoFiltro;
    return matchTexto && matchTipo;
  });

  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const paginados = filtrados.slice(
    pagina * porPagina,
    (pagina + 1) * porPagina
  );

  return (
    <div className="rounded-2xl border border-card-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Movimentacoes</h2>
          <p className="text-xs text-muted">{filtrados.length} registros</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Buscar cliente, descricao..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPagina(0);
              }}
              className="w-56 rounded-xl border border-card-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-light"
            />
          </div>
          <select
            value={tipoFiltro}
            onChange={(e) => {
              setTipoFiltro(e.target.value as typeof tipoFiltro);
              setPagina(0);
            }}
            className="rounded-xl border border-card-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent-light"
          >
            <option value="todos">Todos</option>
            <option value="Entrada">Entradas</option>
            <option value="Saída">Saidas</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-card-border bg-background/50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Tipo</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Data</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Cliente</th>
              {!compact && (
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Descricao</th>
              )}
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Categoria</th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {paginados.map((m, i) => (
              <tr
                key={`${m.data}-${m.descricao}-${i}`}
                className="transition-colors hover:bg-background/50"
              >
                <td className="px-5 py-3.5">
                  {m.movimento === "Entrada" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-positive-light">
                      <ArrowUpCircle size={15} className="text-positive" />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-negative-light">
                      <ArrowDownCircle size={15} className="text-negative" />
                    </div>
                  )}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-muted">
                  {formatDateBR(m.data)}
                </td>
                <td className="px-5 py-3.5 font-medium">{m.cliente}</td>
                {!compact && (
                  <td className="max-w-[220px] truncate px-5 py-3.5 text-muted">
                    {m.descricao}
                  </td>
                )}
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-accent">
                    {m.categoria}
                  </span>
                </td>
                <td
                  className={`px-5 py-3.5 text-right font-semibold tabular-nums ${
                    m.movimento === "Entrada" ? "text-positive" : "text-negative"
                  }`}
                >
                  {m.movimento === "Saída" ? "- " : "+ "}
                  {formatBRL(m.valorRecebido)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between border-t border-card-border px-5 py-3">
          <span className="text-xs text-muted">
            Mostrando {pagina * porPagina + 1}-
            {Math.min((pagina + 1) * porPagina, filtrados.length)} de{" "}
            {filtrados.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPagina(Math.max(0, pagina - 1))}
              disabled={pagina === 0}
              className="rounded-lg p-1.5 hover:bg-background disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
              const start = Math.max(0, Math.min(pagina - 2, totalPaginas - 5));
              const pg = start + i;
              if (pg >= totalPaginas) return null;
              return (
                <button
                  key={pg}
                  onClick={() => setPagina(pg)}
                  className={`h-8 w-8 rounded-lg text-sm ${
                    pg === pagina
                      ? "bg-accent text-white"
                      : "hover:bg-background"
                  }`}
                >
                  {pg + 1}
                </button>
              );
            })}
            <button
              onClick={() => setPagina(Math.min(totalPaginas - 1, pagina + 1))}
              disabled={pagina >= totalPaginas - 1}
              className="rounded-lg p-1.5 hover:bg-background disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
