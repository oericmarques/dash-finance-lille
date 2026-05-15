import { fetchDashboardData } from "@/lib/sheets";
import { ContasReceberClient } from "./ContasReceberClient";

export const revalidate = 86400;

export default async function ContasReceber() {
  const data = await fetchDashboardData();
  return <ContasReceberClient data={data} />;
}
