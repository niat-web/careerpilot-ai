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
        rows={9}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your answer here…"
        className="input-field min-h-[180px] resize-y leading-relaxed disabled:opacity-60"
        maxLength={5000}
      />
      <div className="mt-1 flex justify-between text-xs text-ink-muted">
        <span>{error || 'Be specific. Mention concepts, trade-offs, and examples.'}</span>
        <span>{value.length}/5000</span>
      </div>
    </div>
  );
}
