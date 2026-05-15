"use client";

import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
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
  return (
    <PageShell data={data} title="FLUXO DE CAIXA" headerColor="bg-slate-800" accentColor="#334155">
      {(filtradas) => {
        const entradas = soEntradas(filtradas);
        const saidas = soSaidas(filtradas);
        const totEnt = totalPorStatus(entradas);
        const totSai = totalPorStatus(saidas);
        const saldo = totEnt.total - totSai.total;
        const totalSaldoBanco = data.saldos.reduce((a, s) => a + s.saldo, 0);

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
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatusKpi
                icon={<TrendingDown size={20} className="text-red-600" />}
                value={formatBRL(totSai.total)}
                label="Despesas"
                iconBg="bg-red-50"
              />
              <StatusKpi
                icon={<TrendingUp size={20} className="text-green-600" />}
                value={formatBRL(totEnt.pago)}
                label="Receita"
                iconBg="bg-green-50"
              />
              <StatusKpi
                icon={<DollarSign size={20} className="text-cyan-600" />}
                value={formatBRL(totEnt.aVencer + totEnt.vencido)}
                label="A receber"
                iconBg="bg-cyan-50"
              />
              <StatusKpi
                icon={<Wallet size={20} className="text-slate-700" />}
                value={formatBRL(saldo)}
                label={`Saldo (banco: ${formatBRL(totalSaldoBanco)})`}
                iconBg="bg-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <StackedBarChart
                data={resumoEnt}
                title="Receitas por mes"
                colors={{ pago: "#16a34a", aVencer: "#3b82f6", vencido: "#dc2626" }}
                labels={{ pago: "Recebido", aVencer: "A Receber", vencido: "Inadimplente" }}
              />
              <StackedBarChart
                data={resumoSai}
                title="Despesas por mes"
                colors={{ pago: "#16a34a", aVencer: "#3b82f6", vencido: "#dc2626" }}
                labels={{ pago: "Pago", aVencer: "A Vencer", vencido: "Vencido" }}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <DonutChart
                title="Fluxo de caixa"
                data={[
                  { name: "Receitas", value: totEnt.total, color: "#16a34a" },
                  { name: "Despesas", value: totSai.total, color: "#dc2626" },
                ]}
              />
              <DonutChart
                title="Categorias de despesa"
                data={catSaida.slice(0, 6).map((c, i) => ({
                  name: c.categoria,
                  value: c.valor,
                  color: ["#0891b2", "#7c3aed", "#ea580c", "#ec4899", "#d97706", "#64748b"][i],
                }))}
              />
            </div>

            <StackedBarChart
              data={saldoMensal}
              title="Saldo mensal"
              colors={{ pago: "#0891b2", aVencer: "#94a3b8", vencido: "#dc2626" }}
              labels={{ pago: "Saldo", aVencer: "", vencido: "" }}
            />
          </div>
        );
      }}
    </PageShell>
  );
}
