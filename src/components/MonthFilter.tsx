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
    <div className="flex flex-wrap items-center gap-1.5">
      <select
        value={anoSelecionado}
        onChange={(e) => onAnoChange(e.target.value)}
        className="rounded-md border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-text outline-none focus:border-accent transition-colors"
      >
        {anos.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <div className="h-4 w-px bg-border hidden sm:block" />

      <button
        onClick={toggleTodos}
        className="rounded-md px-2 py-1 text-[11px] font-medium text-text-muted hover:text-text-secondary transition-colors"
      >
        {mesesSelecionados.length === 0 ? "Todos" : "Limpar"}
      </button>

      {MESES.map((m) => {
        const active = mesesSelecionados.length === 0 || mesesSelecionados.includes(m.key);
        return (
          <button
            key={m.key}
            onClick={() => toggleMes(m.key)}
            className="rounded-md px-2 py-1 text-[11px] font-medium transition-all"
            style={active ? {
              backgroundColor: accentColor,
              color: "#fff",
            } : {
              backgroundColor: "transparent",
              color: "#a3acb9",
            }}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
