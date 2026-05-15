import { fetchDashboardData } from "@/lib/sheets";
import { FluxoCaixaClient } from "./FluxoCaixaClient";

export const revalidate = 86400;

export default async function Home() {
  const data = await fetchDashboardData();
  return <FluxoCaixaClient data={data} />;
}
