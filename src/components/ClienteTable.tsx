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
    <div className="card-static overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-bg/50">
              <th className="px-6 py-2.5 text-left font-semibold text-text-3 uppercase text-[10px] tracking-wider">Nome</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-3 uppercase text-[10px] tracking-wider">{columns.col1}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-3 uppercase text-[10px] tracking-wider">{columns.col2}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-3 uppercase text-[10px] tracking-wider">{columns.col3}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-text-3 uppercase text-[10px] tracking-wider">Qtd</th>
            </tr>
          </thead>
          <tbody>
            {top.map((c, i) => (
              <tr key={c.cliente} className={i % 2 === 0 ? "" : "bg-bg/30"}>
                <td className="px-6 py-2.5 font-medium text-text max-w-[180px] truncate">{c.cliente}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-text-2">{formatBRL(c.pago)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-text-2">{formatBRL(c.pendente)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums font-semibold text-red">
                  {c.vencido > 0 ? formatBRL(c.vencido) : "-"}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-text-3">{c.qtdAberto || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-bg/60 font-bold">
              <td className="px-6 py-3 text-text">Total</td>
              <td className="px-4 py-3 text-right tabular-nums text-text">{formatBRL(totais.pago)}</td>
              <td className="px-4 py-3 text-right tabular-nums text-text">{formatBRL(totais.pendente)}</td>
              <td className="px-4 py-3 text-right tabular-nums text-red">{formatBRL(totais.vencido)}</td>
              <td className="px-4 py-3 text-right tabular-nums text-text">{totais.qtdAberto}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
