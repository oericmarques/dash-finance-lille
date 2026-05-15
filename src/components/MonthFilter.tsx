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
  accentColor = "accent-cyan-500",
}: MonthFilterProps) {
  function toggleMes(key: string) {
    if (mesesSelecionados.includes(key)) {
      onMesesChange(mesesSelecionados.filter((m) => m !== key));
    } else {
      onMesesChange([...mesesSelecionados, key]);
    }
  }

  function toggleTodos() {
    if (mesesSelecionados.length === 12) {
      onMesesChange([]);
    } else {
      onMesesChange(MESES.map((m) => m.key));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Ano
        </label>
        <select
          value={anoSelecionado}
          onChange={(e) => onAnoChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-cyan-500"
        >
          {anos.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes</label>
          <button
            onClick={toggleTodos}
            className="text-xs text-cyan-600 hover:text-cyan-800"
          >
            {mesesSelecionados.length === 12 ? "Limpar" : "Todos"}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {MESES.map((m) => {
            const selected = mesesSelecionados.length === 0 || mesesSelecionados.includes(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleMes(m.key)}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                  selected
                    ? `bg-slate-800 text-white`
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                } ${accentColor}`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
