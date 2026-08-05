type Props = {
  current: number;
  total: number;
  label?: string;
};

export function InterviewProgress({ current, total, label }: Props) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(total, 1)) * 100));
  return (
    <div className="surface-panel p-4 animate-fade-in">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <p className="font-medium text-ink">{label || 'Interview progress'}</p>
        <p className="text-ink-muted">
          {current} / {total}
        </p>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
