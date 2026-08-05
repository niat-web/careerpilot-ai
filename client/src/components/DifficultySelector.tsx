type Props = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export function DifficultySelector({ value, options, onChange }: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">Difficulty</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              value === option
                ? 'bg-ink text-white'
                : 'border border-border bg-white text-ink-muted hover:text-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
