"use client";

import { TrendingUp, TrendingDown, Wallet, Landmark } from "lucide-react";
import type { DashboardData } from "@/lib/types";
import {
  soEntradas,
  soSaidas,
  totalPorStatus,
  resumoMensalPorStatus,
  calcularResumoCategorias,
  formatBRL,
} from "@/lib/analytics";
import { PageShell } from "@/components/PageShell";
import { StatusKpi } from "@/components/StatusKpi";
import { StackedBarChart } from "@/components/StackedBarChart";
import { DonutChart } from "@/components/DonutChart";

export function FluxoCaixaClient({ data }: { data: DashboardData }) {
  const totalSaldoBanco = data.saldos.reduce((a, s) => a + s.saldo, 0);

  return (
    <PageShell data={data} title="Fluxo de Caixa" subtitle="Visao geral financeira" accentColor="#0891b2">
      {(filtradas) => {
        const entradas = soEntradas(filtradas);
        const saidas = soSaidas(filtradas);
        const totEnt = totalPorStatus(entradas);
        const totSai = totalPorStatus(saidas);
        const saldo = totEnt.total - totSai.total;

        const resumoEnt = resumoMensalPorStatus(entradas);
        const resumoSai = resumoMensalPorStatus(saidas);

        const mesesAll = new Set([...resumoEnt.map((r) => r.mes), ...resumoSai.map((r) => r.mes)]);
        const saldoMensal = Array.from(mesesAll)
          .sort()
          .map((mes) => {
            const e = resumoEnt.find((r) => r.mes === mes);
            const s = resumoSai.find((r) => r.mes === mes);
            return {
              mes,
              pago: (e?.total || 0) - (s?.total || 0),
              aVencer: 0,
              vencido: 0,
              total: (e?.total || 0) - (s?.total || 0),
            };
          });

        const catSaida = calcularResumoCategorias(saidas);

        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatusKpi
                icon={<TrendingUp size={22} className="text-green" />}
                value={formatBRL(totEnt.total)}
                label="Receitas"
                iconBg="bg-green/10"
              />
              <StatusKpi
                icon={<TrendingDown size={22} className="text-red" />}
                value={formatBRL(totSai.total)}
                label="Despesas"
                iconBg="bg-red/10"
              />
              <StatusKpi
                icon={<Wallet size={22} className="text-accent" />}
                value={formatBRL(saldo)}
                label="Resultado"
                iconBg="bg-accent/10"
              />
              <StatusKpi
                icon={<Landmark size={22} className="text-purple" />}
                value={formatBRL(totalSaldoBanco)}
                label="Saldo em conta"
                iconBg="bg-purple/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <StackedBarChart
                data={resumoEnt}
                title="Receitas por mes"
                colors={{ pago: "#10b981", aVencer: "#3b82f6", vencido: "#ef4444" }}
                labels={{ pago: "Recebido", aVencer: "A Receber", vencido: "Inadimplente" }}
              />
              <StackedBarChart
                data={resumoSai}
                title="Despesas por mes"
                colors={{ pago: "#10b981", aVencer: "#f59e0b", vencido: "#ef4444" }}
                labels={{ pago: "Pago", aVencer: "A Vencer", vencido: "Vencido" }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <DonutChart
                title="Receitas vs Despesas"
                data={[
                  { name: "Receitas", value: totEnt.total, color: "#10b981" },
                  { name: "Despesas", value: totSai.total, color: "#ef4444" },
                ]}
              />
              <DonutChart
                title="Categorias de despesa"
                data={catSaida.slice(0, 6).map((c, i) => ({
                  name: c.categoria,
                  value: c.valor,
                  color: ["#0891b2", "#8b5cf6", "#f59e0b", "#ec4899", "#14b8a6", "#64748b"][i],
                }))}
              />
            </div>

            <StackedBarChart
              data={saldoMensal}
              title="Saldo mensal"
              colors={{ pago: "#0891b2", aVencer: "#94a3b8", vencido: "#ef4444" }}
              labels={{ pago: "Saldo", aVencer: "", vencido: "" }}
            />

            <div className="card-static overflow-hidden">
              <div className="px-6 pt-5 pb-2">
                <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">Saldo bancario</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
                {data.saldos.map((s) => (
                  <div key={s.banco} className="px-6 py-4">
                    <p className="text-[10px] font-medium text-text-3 uppercase tracking-wider mb-1.5">{s.banco}</p>
                    <p className="text-lg font-extrabold text-text tabular-nums">{formatBRL(s.saldo)}</p>
                  </div>
                ))}
              </div>
              <div className="mx-6 mb-5 mt-2 rounded-2xl bg-bg px-6 py-4 flex items-center justify-between">
                <span className="text-xs font-bold text-text-2">Total consolidado</span>
                <span className="text-2xl font-extrabold text-text tabular-nums">{formatBRL(totalSaldoBanco)}</span>
              </div>
            </div>
          </div>
        );
      }}
    </PageShell>
  );
}
