import Papa from "papaparse";
import type {
  PlanoContas,
  Movimentacao,
  SaldoBanco,
  DashboardData,
} from "./types";

const SPREADSHEET_ID = "1476Ok5dUg6XZgwBiL2Om1I3WHzxSkVq6LEtabyMOy_w";

function sheetUrl(sheetName: string): string {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

function parseBRL(value: string): number {
  if (!value) return 0;
  const cleaned = value
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseDate(value: string): string {
  if (!value) return "";
  const parts = value.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return value;
}

async function fetchCSV(sheetName: string): Promise<string[][]> {
  const res = await fetch(sheetUrl(sheetName), { next: { revalidate: 86400 } });
  const text = await res.text();
  const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
  return parsed.data;
}

async function fetchPlanoContas(): Promise<PlanoContas[]> {
  const rows = await fetchCSV("Plano_Contas");
  if (rows.length < 2) return [];
  return rows.slice(1).map((row) => ({
    id: row[0] || "",
    movimento: (row[1] || "") as "Entrada" | "Saída",
    lancamento: row[2] || "",
    conta: row[3] || "",
    tipo: row[4] || "",
  }));
}

async function fetchMovimentacoes(
  plano: PlanoContas[]
): Promise<Movimentacao[]> {
  const rows = await fetchCSV("fMovimentacoes");
  if (rows.length < 2) return [];

  const planoMap = new Map(plano.map((p) => [p.id, p]));

  return rows
    .slice(1)
    .filter((row) => row[0] && row[5])
    .map((row) => {
      const planoItem = planoMap.get(row[0]);
      return {
        planoContasId: row[0] || "",
        data: parseDate(row[1] || ""),
        cliente: row[2] || "",
        uf: row[3] || "",
        descricao: row[4] || "",
        valorRecebido: parseBRL(row[5]),
        dataPgto: parseDate(row[6] || ""),
        notaFiscal: row[7] || "",
        categoria: row[8] || "",
        mes: row[9] || "",
        movimento: planoItem?.movimento || "Entrada",
      };
    });
}

async function fetchSaldos(): Promise<SaldoBanco[]> {
  const rows = await fetchCSV("Saldo Banco");
  if (rows.length < 2) return [];
  return rows
    .slice(1)
    .filter((row) => row[0])
    .map((row) => ({
      banco: row[0] || "",
      saldo: parseBRL(row[1]),
      ultimaAtualizacao: row[3] || "",
    }));
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const planoContas = await fetchPlanoContas();
  const [movimentacoes, saldos] = await Promise.all([
    fetchMovimentacoes(planoContas),
    fetchSaldos(),
  ]);

  return {
    movimentacoes,
    saldos,
    planoContas,
    lastUpdated: new Date().toISOString(),
  };
}
