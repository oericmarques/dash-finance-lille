import { fetchDashboardData } from "@/lib/sheets";
import { ContasPagarClient } from "./ContasPagarClient";

export const revalidate = 86400;

export default async function ContasPagar() {
  const data = await fetchDashboardData();
  return <ContasPagarClient data={data} />;
}
