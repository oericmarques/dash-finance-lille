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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-800 px-5 py-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-4 py-2.5 text-left font-semibold text-slate-500">Nome</th>
              <th className="px-4 py-2.5 text-right font-semibold text-slate-500">{columns.col1}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-slate-500">{columns.col2}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-slate-500">{columns.col3}</th>
              <th className="px-4 py-2.5 text-right font-semibold text-slate-500">Qtd Aberto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {top.map((c) => (
              <tr key={c.cliente} className="hover:bg-slate-50/50">
                <td className="px-4 py-2 font-medium text-slate-700 max-w-[180px] truncate">{c.cliente}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatBRL(c.pago)}</td>
                <td className="px-4 py-2 text-right tabular-nums">{formatBRL(c.pendente)}</td>
                <td className="px-4 py-2 text-right tabular-nums text-red-600 font-medium">
                  {c.vencido > 0 ? formatBRL(c.vencido) : "-"}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{c.qtdAberto || "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
              <td className="px-4 py-2.5">Total</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{formatBRL(totais.pago)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{formatBRL(totais.pendente)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-red-600">{formatBRL(totais.vencido)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{totais.qtdAberto}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
