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
    <div className="card-static overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xs font-bold text-text-3 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-6 pb-5 space-y-2.5">
        {items.map((item, i) => (
          <div key={item.nome} className="flex items-center gap-3">
            <span className="w-4 text-[10px] font-bold text-text-3 tabular-nums text-right">{i + 1}</span>
            <span className="w-28 truncate text-[11px] font-medium text-text">{item.nome}</span>
            <div className="flex-1 h-4 rounded-full bg-bg overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max((item.valor / maxVal) * 100, 3)}%`,
                  backgroundColor: color,
                  opacity: 1 - i * 0.06,
                }}
              />
            </div>
            <span className="text-[11px] font-bold text-text w-24 text-right tabular-nums">
              {formatBRL(item.valor)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-text-3 text-center py-8">Sem dados</p>
        )}
      </div>
    </div>
  );
}
