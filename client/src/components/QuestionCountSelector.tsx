type Props = {
  value: number;
  options: number[];
  onChange: (value: number) => void;
};

export function QuestionCountSelector({ value, options, onChange }: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">Number of questions</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`h-11 w-14 rounded-xl text-sm font-semibold ${
              value === option
                ? 'bg-accent text-white'
                : 'border border-border bg-white text-ink-muted hover:border-accent'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
