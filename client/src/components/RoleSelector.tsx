type Props = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function RoleSelector({ value, options, onChange }: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">Target role</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
              value === option
                ? 'border-accent bg-accent-soft text-accent-dark'
                : 'border-border bg-white text-ink-muted hover:border-accent/40'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
