"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { Movimentacao } from "@/lib/types";
import { formatBRL, formatDateBR } from "@/lib/analytics";

interface MovimentacaoListProps {
  data: Movimentacao[];
  title: string;
  statusLabels: { pago: string; a_vencer: string; vencido: string };
  statusColors: { pago: string; a_vencer: string; vencido: string };
}

const STATUS_DOT: Record<string, string> = {
  pago: "bg-positive",
  a_vencer: "bg-info",
  vencido: "bg-negative",
};

export function MovimentacaoList({ data, title, statusLabels, statusColors }: MovimentacaoListProps) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(0);
  const POR_PAGINA = 20;

  const filtradas = useMemo(() => {
    if (!busca.trim()) return data;
    const termo = busca.toLowerCase();
    return data.filter(
      (m) =>
        m.cliente.toLowerCase().includes(termo) ||
        m.descricao.toLowerCase().includes(termo) ||
        m.categoria.toLowerCase().includes(termo) ||
        m.notaFiscal.toLowerCase().includes(termo)
    );
  }, [data, busca]);

  const totalPaginas = Math.ceil(filtradas.length / POR_PAGINA);
  const paginadas = filtradas.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);

  const totalGeral = filtradas.reduce((a, m) => a + m.valorRecebido, 0);

  return (
    <div className="rounded-xl bg-white border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
          <span className="text-[10px] text-text-muted">
            {filtradas.length} registro{filtradas.length !== 1 ? "s" : ""} · {formatBRL(totalGeral)}
          </span>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(0); }}
            placeholder="Buscar cliente, descricao, NF..."
            className="rounded-md border border-border bg-bg pl-8 pr-3 py-1.5 text-[11px] text-text outline-none focus:border-accent w-56 transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-light">
              <th className="px-4 py-2 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Status</th>
              <th className="px-4 py-2 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Vencimento</th>
              <th className="px-4 py-2 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Cliente / Fornecedor</th>
              <th className="px-4 py-2 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Descricao</th>
              <th className="px-4 py-2 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Categoria</th>
              <th className="px-4 py-2 text-right font-semibold text-text-muted uppercase text-[10px] tracking-wider">Valor</th>
              <th className="px-4 py-2 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Pgto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {paginadas.map((m, i) => (
              <tr key={`${m.planoContasId}-${m.data}-${i}`} className="hover:bg-bg transition-colors">
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[m.status]}`} />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: statusColors[m.status] }}
                    >
                      {statusLabels[m.status]}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-2 text-text-secondary tabular-nums">{formatDateBR(m.data)}</td>
                <td className="px-4 py-2 font-medium text-text max-w-[160px] truncate">{m.cliente}</td>
                <td className="px-4 py-2 text-text-secondary max-w-[200px] truncate">{m.descricao}</td>
                <td className="px-4 py-2 text-text-muted">{m.categoria}</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium text-text">{formatBRL(m.valorRecebido)}</td>
                <td className="px-4 py-2 text-text-muted tabular-nums">{formatDateBR(m.dataPgto)}</td>
              </tr>
            ))}
            {paginadas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="px-5 py-3 border-t border-border-light flex items-center justify-between">
          <span className="text-[10px] text-text-muted">
            {pagina * POR_PAGINA + 1}-{Math.min((pagina + 1) * POR_PAGINA, filtradas.length)} de {filtradas.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0}
              className="rounded-md px-2.5 py-1 text-[10px] font-medium text-text-secondary hover:bg-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
              disabled={pagina >= totalPaginas - 1}
              className="rounded-md px-2.5 py-1 text-[10px] font-medium text-text-secondary hover:bg-bg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Proximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
