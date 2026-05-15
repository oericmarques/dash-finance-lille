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
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-5 pb-4 space-y-2">
        {items.map((item, i) => (
          <div key={item.nome} className="flex items-center gap-3">
            <span className="w-5 text-[10px] font-bold text-slate-300 tabular-nums">{i + 1}</span>
            <span className="w-28 truncate text-xs text-slate-700">{item.nome}</span>
            <div className="flex-1 h-4 rounded-full bg-slate-50 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max((item.valor / maxVal) * 100, 3)}%`,
                  backgroundColor: color,
                  opacity: 1 - i * 0.06,
                }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-800 w-24 text-right tabular-nums">
              {formatBRL(item.valor)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">Sem dados</p>
        )}
      </div>
    </div>
  );
}
