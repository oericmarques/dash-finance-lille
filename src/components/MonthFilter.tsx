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
    if (mesesSelecionados.length === 0) {
      onMesesChange(MESES.map((m) => m.key));
    } else {
      onMesesChange([]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={anoSelecionado}
        onChange={(e) => onAnoChange(e.target.value)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
      >
        {anos.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <div className="h-5 w-px bg-slate-200 hidden sm:block" />

      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={toggleTodos}
          className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors text-slate-500 hover:bg-slate-100"
        >
          {mesesSelecionados.length === 0 ? "Todos" : "Limpar"}
        </button>
        {MESES.map((m) => {
          const active = mesesSelecionados.length === 0 || mesesSelecionados.includes(m.key);
          return (
            <button
              key={m.key}
              onClick={() => toggleMes(m.key)}
              className="rounded-md px-2.5 py-1 text-xs font-medium transition-all"
              style={{
                backgroundColor: active ? accentColor : "transparent",
                color: active ? "#fff" : "#94a3b8",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
