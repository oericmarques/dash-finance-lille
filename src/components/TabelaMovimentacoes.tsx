"use client";

import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Search } from "lucide-react";
import type { Movimentacao } from "@/lib/types";
import { formatBRL, formatDateBR } from "@/lib/analytics";

interface TabelaMovimentacoesProps {
  movimentacoes: Movimentacao[];
}

export function TabelaMovimentacoes({ movimentacoes }: TabelaMovimentacoesProps) {
  const [filtro, setFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"todos" | "Entrada" | "Saída">("todos");
  const [pagina, setPagina] = useState(0);
  const porPagina = 20;

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
    <div className="rounded-xl border border-card-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-card-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Movimentacoes</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPagina(0);
              }}
              className="rounded-lg border border-card-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <select
            value={tipoFiltro}
            onChange={(e) => {
              setTipoFiltro(e.target.value as typeof tipoFiltro);
              setPagina(0);
            }}
            className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
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
            <tr className="border-b border-card-border bg-background text-left">
              <th className="px-5 py-3 font-medium text-muted">Tipo</th>
              <th className="px-5 py-3 font-medium text-muted">Data</th>
              <th className="px-5 py-3 font-medium text-muted">Cliente</th>
              <th className="px-5 py-3 font-medium text-muted">Descricao</th>
              <th className="px-5 py-3 font-medium text-muted">Categoria</th>
              <th className="px-5 py-3 text-right font-medium text-muted">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {paginados.map((m, i) => (
              <tr
                key={`${m.data}-${m.descricao}-${i}`}
                className="border-b border-card-border last:border-0 hover:bg-background/50"
              >
                <td className="px-5 py-3">
                  {m.movimento === "Entrada" ? (
                    <ArrowUpCircle size={18} className="text-positive" />
                  ) : (
                    <ArrowDownCircle size={18} className="text-negative" />
                  )}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {formatDateBR(m.data)}
                </td>
                <td className="px-5 py-3">{m.cliente}</td>
                <td className="max-w-[250px] truncate px-5 py-3">
                  {m.descricao}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
                    {m.categoria}
                  </span>
                </td>
                <td
                  className={`px-5 py-3 text-right font-medium ${
                    m.movimento === "Entrada"
                      ? "text-positive"
                      : "text-negative"
                  }`}
                >
                  {m.movimento === "Saída" ? "- " : ""}
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
            {filtrados.length} registros
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPagina(Math.max(0, pagina - 1))}
              disabled={pagina === 0}
              className="rounded-lg px-3 py-1 text-sm hover:bg-background disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm text-muted">
              {pagina + 1} / {totalPaginas}
            </span>
            <button
              onClick={() =>
                setPagina(Math.min(totalPaginas - 1, pagina + 1))
              }
              disabled={pagina >= totalPaginas - 1}
              className="rounded-lg px-3 py-1 text-sm hover:bg-background disabled:opacity-40"
            >
              Proximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
