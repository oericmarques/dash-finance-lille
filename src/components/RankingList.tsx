import { formatBRL } from "@/lib/analytics";

interface RankingItem {
  nome: string;
  valor: number;
}

interface RankingListProps {
  data: RankingItem[];
  title: string;
  color: string;
  maxItems?: number;
}

export function RankingList({ data, title, color, maxItems = 8 }: RankingListProps) {
  const items = data.slice(0, maxItems);
  const maxVal = items[0]?.valor || 1;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-800 px-5 py-3 rounded-t-2xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4 space-y-2.5">
        {items.map((item) => (
          <div key={item.nome} className="flex items-center gap-3">
            <span className="w-28 truncate text-xs text-slate-600">{item.nome}</span>
            <div className="flex-1 h-5 rounded bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded"
                style={{
                  width: `${Math.max((item.valor / maxVal) * 100, 2)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-900 w-20 text-right tabular-nums">
              {formatBRL(item.valor)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">Sem dados</p>
        )}
      </div>
    </div>
  );
}
