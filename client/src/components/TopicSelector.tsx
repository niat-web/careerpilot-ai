type Props = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
};

export function TopicSelector({ value, options, onChange, error }: Props) {
  return (
    <div>
      <label htmlFor="topic" className="mb-2 block text-sm font-medium text-ink">
        Topic
      </label>
      <select
        id="topic"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
