"use client";

const MESES = [
  { key: "jan", label: "Jan" },
  { key: "fev", label: "Fev" },
  { key: "mar", label: "Mar" },
  { key: "abr", label: "Abr" },
  { key: "mai", label: "Mai" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "ago", label: "Ago" },
  { key: "set", label: "Set" },
  { key: "out", label: "Out" },
  { key: "nov", label: "Nov" },
  { key: "dez", label: "Dez" },
];

interface MonthFilterProps {
  anos: string[];
  anoSelecionado: string;
  mesesSelecionados: string[];
  onAnoChange: (ano: string) => void;
  onMesesChange: (meses: string[]) => void;
  accentColor?: string;
}

export function MonthFilter({
  anos,
  anoSelecionado,
  mesesSelecionados,
  onAnoChange,
  onMesesChange,
  accentColor = "#0891b2",
}: MonthFilterProps) {
  function toggleMes(key: string) {
    if (mesesSelecionados.includes(key)) {
      onMesesChange(mesesSelecionados.filter((m) => m !== key));
    } else {
      onMesesChange([...mesesSelecionados, key]);
    }
  }

  function toggleTodos() {
    onMesesChange(mesesSelecionados.length === 0 ? MESES.map((m) => m.key) : []);
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      <select
        value={anoSelecionado}
        onChange={(e) => onAnoChange(e.target.value)}
        className="rounded-[var(--radius-sm)] bg-bg px-3 py-1.5 text-[11px] font-bold text-text outline-none border-none focus:ring-2 focus:ring-accent/20 transition-all"
      >
        {anos.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <button
        onClick={toggleTodos}
        className="rounded-full px-3 py-1 text-[11px] font-medium text-text-3 hover:text-text-2 hover:bg-bg transition-all"
      >
        {mesesSelecionados.length === 0 ? "Todos" : "Limpar"}
      </button>

      {MESES.map((m) => {
        const active = mesesSelecionados.length === 0 || mesesSelecionados.includes(m.key);
        return (
          <button
            key={m.key}
            onClick={() => toggleMes(m.key)}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-all"
            style={active ? {
              backgroundColor: accentColor,
              color: "#fff",
              boxShadow: `0 2px 8px ${accentColor}40`,
            } : {
              backgroundColor: "transparent",
              color: "#8898aa",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
