"use client";

import { CheckCircle, Clock, AlertTriangle, Percent } from "lucide-react";
import type { DashboardData } from "@/lib/types";
import {
  soSaidas,
  totalPorStatus,
  resumoMensalPorStatus,
  resumoPorCliente,
  calcularResumoCategorias,
  formatBRL,
} from "@/lib/analytics";
import { PageShell } from "@/components/PageShell";
import { StatusKpi } from "@/components/StatusKpi";
import { StackedBarChart } from "@/components/StackedBarChart";
import { DonutChart } from "@/components/DonutChart";
import { ClienteTable } from "@/components/ClienteTable";
import { RankingList } from "@/components/RankingList";
import { MovimentacaoList } from "@/components/MovimentacaoList";

export function ContasPagarClient({ data }: { data: DashboardData }) {
  return (
    <PageShell data={data} title="Contas a Pagar" subtitle="Saidas e pagamentos" accentColor="#f59e0b">
      {(filtradas) => {
        const saidas = soSaidas(filtradas);
        const tot = totalPorStatus(saidas);
        const pctVencido =
          tot.total > 0 ? ((tot.vencido / tot.total) * 100).toFixed(1) : "0";

        const resumoMensal = resumoMensalPorStatus(saidas);
        const fornecedores = resumoPorCliente(saidas);
        const categorias = calcularResumoCategorias(saidas);

        const maioresCredores = fornecedores
          .filter((c) => c.pendente + c.vencido > 0)
          .sort((a, b) => (b.pendente + b.vencido) - (a.pendente + a.vencido))
          .map((c) => ({ nome: c.cliente, valor: c.pendente + c.vencido }));

        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatusKpi
                icon={<CheckCircle size={20} className="text-positive" />}
                value={formatBRL(tot.pago)}
                label="Pago"
                iconBg="bg-positive-soft"
              />
              <StatusKpi
                icon={<Clock size={20} className="text-warning" />}
                value={formatBRL(tot.aVencer)}
                label="A Vencer"
                iconBg="bg-warning-soft"
              />
              <StatusKpi
                icon={<AlertTriangle size={20} className="text-negative" />}
                value={formatBRL(tot.vencido)}
                label="Vencidos"
                iconBg="bg-negative-soft"
              />
              <StatusKpi
                icon={<Percent size={20} className="text-warning" />}
                value={`${pctVencido}%`}
                label="% Vencido"
                iconBg="bg-warning-soft"
              />
            </div>

            <StackedBarChart
              data={resumoMensal}
              title="Despesas por mes"
              colors={{ pago: "#10b981", aVencer: "#f59e0b", vencido: "#ef4444" }}
              labels={{ pago: "Pago", aVencer: "A Vencer", vencido: "Vencido" }}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <DonutChart
                title="Status dos pagamentos"
                data={[
                  { name: "Pago", value: tot.pago, color: "#10b981" },
                  { name: "A Vencer", value: tot.aVencer, color: "#f59e0b" },
                  { name: "Vencido", value: tot.vencido, color: "#ef4444" },
                ]}
              />
              <DonutChart
                title="Categorias"
                data={categorias.slice(0, 6).map((c, i) => ({
                  name: c.categoria,
                  value: c.valor,
                  color: ["#f59e0b", "#0891b2", "#8b5cf6", "#ef4444", "#14b8a6", "#64748b"][i],
                }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ClienteTable
                data={fornecedores}
                title="Fornecedores"
                columns={{ col1: "Pago", col2: "A Vencer", col3: "Vencido" }}
              />
              <RankingList
                data={maioresCredores}
                title="Maiores credores"
                color="#f59e0b"
              />
            </div>

            <MovimentacaoList
              data={saidas}
              title="Todas as despesas"
              statusLabels={{ pago: "Pago", a_vencer: "A Vencer", vencido: "Vencido" }}
              statusColors={{ pago: "#10b981", a_vencer: "#f59e0b", vencido: "#ef4444" }}
            />
          </div>
        );
      }}
    </PageShell>
  );
}
