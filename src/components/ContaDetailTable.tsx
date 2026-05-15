"use client";

import { formatBRL } from "@/lib/analytics";

interface ContaRow {
  id: string;
  descricao: string;
  tipo: string;
  pago: number;
  aVencer: number;
  vencido: number;
  total: number;
}

interface ContaDetailTableProps {
  data: ContaRow[];
  title: string;
  columns: {
    col1: string;
    col2: string;
    col3: string;
  };
  accentColor: string;
}

export function ContaDetailTable({ data, title, columns, accentColor }: ContaDetailTableProps) {
  const totais = data.reduce(
    (acc, c) => ({
      pago: acc.pago + c.pago,
      aVencer: acc.aVencer + c.aVencer,
      vencido: acc.vencido + c.vencido,
      total: acc.total + c.total,
    }),
    { pago: 0, aVencer: 0, vencido: 0, total: 0 }
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-y border-slate-100">
              <th className="px-4 py-2 text-left font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Conta</th>
              <th className="px-4 py-2 text-left font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Tipo</th>
              <th className="px-4 py-2 text-right font-semibold text-slate-400 uppercase text-[10px] tracking-wider">{columns.col1}</th>
              <th className="px-4 py-2 text-right font-semibold text-slate-400 uppercase text-[10px] tracking-wider">{columns.col2}</th>
              <th className="px-4 py-2 text-right font-semibold text-slate-400 uppercase text-[10px] tracking-wider">{columns.col3}</th>
              <th className="px-4 py-2 text-right font-semibold text-slate-400 uppercase text-[10px] tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-2.5 font-medium text-slate-700">{c.descricao}</td>
                <td className="px-4 py-2.5">
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                    style={{ backgroundColor: accentColor, opacity: 0.8 }}
                  >
                    {c.tipo}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-green-700 font-medium">
                  {c.pago > 0 ? formatBRL(c.pago) : "-"}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                  {c.aVencer > 0 ? formatBRL(c.aVencer) : "-"}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-red-600 font-medium">
                  {c.vencido > 0 ? formatBRL(c.vencido) : "-"}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums font-bold text-slate-800">
                  {formatBRL(c.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50/50 font-semibold">
              <td className="px-4 py-2.5 text-slate-700" colSpan={2}>Total</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-green-700">{formatBRL(totais.pago)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">{formatBRL(totais.aVencer)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-red-600">{formatBRL(totais.vencido)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums font-bold text-slate-800">{formatBRL(totais.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
