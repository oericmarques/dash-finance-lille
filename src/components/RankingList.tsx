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
    <div className="rounded-xl bg-white border border-border">
      <div className="px-5 py-4 border-b border-border-light">
        <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-5 py-3 space-y-2">
        {items.map((item, i) => (
          <div key={item.nome} className="flex items-center gap-2.5">
            <span className="w-4 text-[10px] font-semibold text-text-muted tabular-nums text-right">{i + 1}</span>
            <span className="w-28 truncate text-[11px] text-text">{item.nome}</span>
            <div className="flex-1 h-3.5 rounded-full bg-border-light overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((item.valor / maxVal) * 100, 3)}%`,
                  backgroundColor: color,
                  opacity: 1 - i * 0.05,
                }}
              />
            </div>
            <span className="text-[11px] font-semibold text-text w-24 text-right tabular-nums">
              {formatBRL(item.valor)}
            </span>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-[11px] text-text-muted text-center py-6">Sem dados</p>
        )}
      </div>
    </div>
  );
}
