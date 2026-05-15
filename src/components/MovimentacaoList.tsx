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
    <div className="card-static overflow-hidden">
      <div className="px-6 pt-5 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">{title}</h3>
          <p className="text-[10px] text-text-3 mt-0.5">
            {filtradas.length} registro{filtradas.length !== 1 ? "s" : ""} · {formatBRL(totalGeral)}
          </p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(0); }}
            placeholder="Buscar cliente, descricao, NF..."
            className="rounded-full bg-bg pl-9 pr-4 py-2 text-[11px] text-text outline-none border-none focus:ring-2 focus:ring-accent/20 w-60 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-bg/50">
              <th className="px-6 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Status</th>
              <th className="px-4 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Vencimento</th>
              <th className="px-4 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Cliente</th>
              <th className="px-4 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Descricao</th>
              <th className="px-4 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Categoria</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-3 uppercase text-[10px] tracking-wider">Valor</th>
              <th className="px-4 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Pgto</th>
            </tr>
          </thead>
          <tbody>
            {paginadas.map((m, i) => (
              <tr key={`${m.planoContasId}-${m.data}-${i}`} className={i % 2 === 0 ? "" : "bg-bg/30"}>
                <td className="px-6 py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: statusColors[m.status] }}
                    />
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: statusColors[m.status] }}
                    >
                      {statusLabels[m.status]}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-2.5 text-text-2 tabular-nums">{formatDateBR(m.data)}</td>
                <td className="px-4 py-2.5 font-medium text-text max-w-[160px] truncate">{m.cliente}</td>
                <td className="px-4 py-2.5 text-text-2 max-w-[200px] truncate">{m.descricao}</td>
                <td className="px-4 py-2.5 text-text-3">{m.categoria}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-text">{formatBRL(m.valorRecebido)}</td>
                <td className="px-4 py-2.5 text-text-3 tabular-nums">{formatDateBR(m.dataPgto)}</td>
              </tr>
            ))}
            {paginadas.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-text-3">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="px-6 py-3 flex items-center justify-between bg-bg/30">
          <span className="text-[10px] text-text-3">
            {pagina * POR_PAGINA + 1}-{Math.min((pagina + 1) * POR_PAGINA, filtradas.length)} de {filtradas.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPagina((p) => Math.max(0, p - 1))}
              disabled={pagina === 0}
              className="rounded-full px-3 py-1.5 text-[10px] font-semibold text-text-2 hover:bg-surface disabled:opacity-30 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))}
              disabled={pagina >= totalPaginas - 1}
              className="rounded-full px-3 py-1.5 text-[10px] font-semibold text-text-2 hover:bg-surface disabled:opacity-30 transition-all"
            >
              Proximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
