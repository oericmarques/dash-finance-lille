"use client";

import { CheckCircle, Clock, AlertTriangle, Percent } from "lucide-react";
import type { DashboardData } from "@/lib/types";
import {
  soEntradas,
  totalPorStatus,
  resumoMensalPorStatus,
  resumoPorCliente,
  resumoPorConta,
  calcularResumoCategorias,
  formatBRL,
} from "@/lib/analytics";
import { PageShell } from "@/components/PageShell";
import { StatusKpi } from "@/components/StatusKpi";
import { StackedBarChart } from "@/components/StackedBarChart";
import { DonutChart } from "@/components/DonutChart";
import { ClienteTable } from "@/components/ClienteTable";
import { RankingList } from "@/components/RankingList";
import { ContaDetailTable } from "@/components/ContaDetailTable";

export function ContasReceberClient({ data }: { data: DashboardData }) {
  return (
    <PageShell data={data} title="CONTAS A RECEBER" headerColor="bg-blue-700" accentColor="#1d4ed8">
      {(filtradas) => {
        const entradas = soEntradas(filtradas);
        const tot = totalPorStatus(entradas);
        const pctInadimplente =
          tot.total > 0 ? ((tot.vencido / tot.total) * 100).toFixed(1) : "0";

        const resumoMensal = resumoMensalPorStatus(entradas);
        const clientes = resumoPorCliente(entradas);
        const categorias = calcularResumoCategorias(entradas);
        const contas = resumoPorConta(entradas, data.planoContas);

        const inadimplentes = clientes
          .filter((c) => c.vencido > 0)
          .sort((a, b) => b.vencido - a.vencido)
          .map((c) => ({ nome: c.cliente, valor: c.vencido }));

        return (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatusKpi
                icon={<CheckCircle size={20} className="text-green-600" />}
                value={formatBRL(tot.pago)}
                label="Recebido"
                iconBg="bg-green-50"
              />
              <StatusKpi
                icon={<Clock size={20} className="text-blue-600" />}
                value={formatBRL(tot.aVencer)}
                label="A Receber"
                iconBg="bg-blue-50"
              />
              <StatusKpi
                icon={<AlertTriangle size={20} className="text-red-600" />}
                value={formatBRL(tot.vencido)}
                label="Inadimplentes"
                iconBg="bg-red-50"
              />
              <StatusKpi
                icon={<Percent size={20} className="text-amber-600" />}
                value={`${pctInadimplente}%`}
                label="% Inadimplencia"
                iconBg="bg-amber-50"
              />
            </div>

            <ContaDetailTable
              data={contas}
              title="Detalhamento por conta"
              columns={{ col1: "Recebido", col2: "A Receber", col3: "Inadimplente" }}
              accentColor="#1d4ed8"
            />

            <StackedBarChart
              data={resumoMensal}
              title="Receitas por mes"
              colors={{ pago: "#16a34a", aVencer: "#3b82f6", vencido: "#dc2626" }}
              labels={{ pago: "Recebido", aVencer: "A Receber", vencido: "Inadimplente" }}
            />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <DonutChart
                title="Status dos recebimentos"
                data={[
                  { name: "Recebido", value: tot.pago, color: "#16a34a" },
                  { name: "A Receber", value: tot.aVencer, color: "#3b82f6" },
                  { name: "Inadimplente", value: tot.vencido, color: "#dc2626" },
                ]}
              />
              <DonutChart
                title="Categorias de receita"
                data={categorias.slice(0, 6).map((c, i) => ({
                  name: c.categoria,
                  value: c.valor,
                  color: ["#3b82f6", "#0891b2", "#7c3aed", "#16a34a", "#d97706", "#64748b"][i],
                }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <ClienteTable
                data={clientes}
                title="Clientes"
                columns={{ col1: "Recebido", col2: "A Receber", col3: "Inadimplente" }}
              />
              <RankingList
                data={inadimplentes}
                title="Maiores inadimplentes"
                color="#dc2626"
              />
            </div>
          </div>
        );
      }}
    </PageShell>
  );
}
