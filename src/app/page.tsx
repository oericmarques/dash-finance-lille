import { fetchDashboardData } from "@/lib/sheets";
import { DashboardClient } from "@/components/DashboardClient";

export const revalidate = 86400;

export default async function Home() {
  const data = await fetchDashboardData();
  return <DashboardClient data={data} />;
}
