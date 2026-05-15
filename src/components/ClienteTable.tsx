"use client";

import type { ResumoCliente } from "@/lib/types";
import { formatBRL } from "@/lib/analytics";

interface ClienteTableProps {
  data: ResumoCliente[];
  title: string;
  columns: {
    col1: string;
    col2: string;
    col3: string;
  };
}

export function ClienteTable({ data, title, columns }: ClienteTableProps) {
  const top = data.slice(0, 12);
  const totais = data.reduce(
    (acc, c) => ({
      pago: acc.pago + c.pago,
      pendente: acc.pendente + c.pendente,
      vencido: acc.vencido + c.vencido,
      qtdAberto: acc.qtdAberto + c.qtdAberto,
    }),
    { pago: 0, pendente: 0, vencido: 0, qtdAberto: 0 }
  );

  return (
    <div className="rounded-xl bg-white border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border-light">
        <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border-light">
              <th className="px-4 py-2.5 text-left font-semibold text-text-muted uppercase text-[10px] tracking-wider">Nome</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-muted uppercase text-[10px] tracking-wider">{columns.col1}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-muted uppercase text-[10px] tracking-wider">{columns.col2}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-muted uppercase text-[10px] tracking-wider">{columns.col3}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-muted uppercase text-[10px] tracking-wider">Qtd</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {top.map((c) => (
              <tr key={c.cliente} className="hover:bg-bg transition-colors">
                <td className="px-4 py-2 font-medium text-text max-w-[180px] truncate">{c.cliente}</td>
                <td className="px-4 py-2 text-right tabular-nums text-text-secondary">{formatBRL(c.pago)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-text-secondary">{formatBRL(c.pendente)}</td>
                <td className="px-4 py-2 text-right tabular-nums font-medium text-negative">
                  {c.vencido > 0 ? formatBRL(c.vencido) : "-"}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-text-muted">{c.qtdAberto || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-bg font-semibold">
              <td className="px-4 py-2.5 text-text">Total</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-text">{formatBRL(totais.pago)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-text">{formatBRL(totais.pendente)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-negative">{formatBRL(totais.vencido)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-text">{totais.qtdAberto}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
