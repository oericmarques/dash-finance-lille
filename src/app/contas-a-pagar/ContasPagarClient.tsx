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

export function ContasPagarClient({ data }: { data: DashboardData }) {
  return (
    <PageShell data={data} title="CONTAS A PAGAR" headerColor="bg-orange-600" accentColor="#ea580c">
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
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatusKpi
                icon={<CheckCircle size={20} className="text-green-600" />}
                value={formatBRL(tot.pago)}
                label="Pago"
                iconBg="bg-green-50"
              />
              <StatusKpi
                icon={<Clock size={20} className="text-orange-600" />}
                value={formatBRL(tot.aVencer)}
                label="A Vencer"
                iconBg="bg-orange-50"
              />
              <StatusKpi
                icon={<AlertTriangle size={20} className="text-red-600" />}
                value={formatBRL(tot.vencido)}
                label="Vencidos"
                iconBg="bg-red-50"
              />
              <StatusKpi
                icon={<Percent size={20} className="text-amber-600" />}
                value={`${pctVencido}%`}
                label="% Vencido"
                iconBg="bg-amber-50"
              />
            </div>

            <StackedBarChart
              data={resumoMensal}
              title="Despesas por mes"
              colors={{ pago: "#16a34a", aVencer: "#f97316", vencido: "#dc2626" }}
              labels={{ pago: "Pago", aVencer: "A Vencer", vencido: "Vencido" }}
            />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <DonutChart
                title="Status dos pagamentos"
                data={[
                  { name: "Pago", value: tot.pago, color: "#16a34a" },
                  { name: "A Vencer", value: tot.aVencer, color: "#f97316" },
                  { name: "Vencido", value: tot.vencido, color: "#dc2626" },
                ]}
              />
              <DonutChart
                title="Categorias de despesa"
                data={categorias.slice(0, 6).map((c, i) => ({
                  name: c.categoria,
                  value: c.valor,
                  color: ["#f97316", "#0891b2", "#7c3aed", "#ea580c", "#d97706", "#64748b"][i],
                }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <ClienteTable
                data={fornecedores}
                title="Fornecedores"
                columns={{
                  col1: "Pago",
                  col2: "A Vencer",
                  col3: "Vencido",
                }}
              />
              <RankingList
                data={maioresCredores}
                title="Maiores credores (pendente)"
                color="#f97316"
              />
            </div>
          </div>
        );
      }}
    </PageShell>
  );
}
