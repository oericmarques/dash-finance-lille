"use client";

import { CheckCircle, Clock, AlertTriangle, Percent } from "lucide-react";
import type { DashboardData } from "@/lib/types";
import {
  soEntradas,
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

export function ContasReceberClient({ data }: { data: DashboardData }) {
  return (
    <PageShell data={data} title="Contas a Receber" subtitle="Entradas e recebimentos" accentColor="#3b82f6">
      {(filtradas) => {
        const entradas = soEntradas(filtradas);
        const tot = totalPorStatus(entradas);
        const pctInadimplente =
          tot.total > 0 ? ((tot.vencido / tot.total) * 100).toFixed(1) : "0";

        const resumoMensal = resumoMensalPorStatus(entradas);
        const clientes = resumoPorCliente(entradas);
        const categorias = calcularResumoCategorias(entradas);

        const inadimplentes = clientes
          .filter((c) => c.vencido > 0)
          .sort((a, b) => b.vencido - a.vencido)
          .map((c) => ({ nome: c.cliente, valor: c.vencido }));

        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatusKpi
                icon={<CheckCircle size={20} className="text-positive" />}
                value={formatBRL(tot.pago)}
                label="Recebido"
                iconBg="bg-positive-soft"
              />
              <StatusKpi
                icon={<Clock size={20} className="text-info" />}
                value={formatBRL(tot.aVencer)}
                label="A Receber"
                iconBg="bg-info-soft"
              />
              <StatusKpi
                icon={<AlertTriangle size={20} className="text-negative" />}
                value={formatBRL(tot.vencido)}
                label="Inadimplentes"
                iconBg="bg-negative-soft"
              />
              <StatusKpi
                icon={<Percent size={20} className="text-warning" />}
                value={`${pctInadimplente}%`}
                label="% Inadimplencia"
                iconBg="bg-warning-soft"
              />
            </div>

            <StackedBarChart
              data={resumoMensal}
              title="Receitas por mes"
              colors={{ pago: "#10b981", aVencer: "#3b82f6", vencido: "#ef4444" }}
              labels={{ pago: "Recebido", aVencer: "A Receber", vencido: "Inadimplente" }}
            />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <DonutChart
                title="Status dos recebimentos"
                data={[
                  { name: "Recebido", value: tot.pago, color: "#10b981" },
                  { name: "A Receber", value: tot.aVencer, color: "#3b82f6" },
                  { name: "Inadimplente", value: tot.vencido, color: "#ef4444" },
                ]}
              />
              <DonutChart
                title="Categorias"
                data={categorias.slice(0, 6).map((c, i) => ({
                  name: c.categoria,
                  value: c.valor,
                  color: ["#3b82f6", "#0891b2", "#8b5cf6", "#10b981", "#f59e0b", "#64748b"][i],
                }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ClienteTable
                data={clientes}
                title="Clientes"
                columns={{ col1: "Recebido", col2: "A Receber", col3: "Inadimplente" }}
              />
              <RankingList
                data={inadimplentes}
                title="Maiores inadimplentes"
                color="#ef4444"
              />
            </div>

            <MovimentacaoList
              data={entradas}
              title="Todas as receitas"
              statusLabels={{ pago: "Recebido", a_vencer: "A Receber", vencido: "Inadimplente" }}
              statusColors={{ pago: "#10b981", a_vencer: "#3b82f6", vencido: "#ef4444" }}
            />
          </div>
        );
      }}
    </PageShell>
  );
}
