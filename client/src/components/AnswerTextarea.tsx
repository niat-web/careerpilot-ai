type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
};

export function AnswerTextarea({ value, onChange, disabled, error }: Props) {
  return (
    <div>
      <label htmlFor="student-answer" className="mb-2 block text-sm font-medium text-ink">
        Your answer
      </label>
      <textarea
        id="student-answer"
        rows={8}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your answer here…"
        className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none ring-accent focus:ring-2 disabled:opacity-60"
        maxLength={5000}
      />
      <div className="mt-1 flex justify-between text-xs text-ink-muted">
        <span>{error || `${value.length}/5000 characters`}</span>
      </div>
    </div>
  );
}
