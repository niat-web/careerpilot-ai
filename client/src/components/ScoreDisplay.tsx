type Props = {
  score: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'lg';
};

export function ScoreDisplay({ score, max = 10, label, size = 'sm' }: Props) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100));
  const color =
    pct >= 75 ? 'text-success' : pct >= 50 ? 'text-warm' : 'text-danger';

  return (
    <div className={size === 'lg' ? 'text-center' : ''}>
      {label && <p className="mb-1 text-xs uppercase tracking-wide text-ink-muted">{label}</p>}
      <p className={`font-display font-semibold ${color} ${size === 'lg' ? 'text-5xl' : 'text-2xl'}`}>
        {Number(score).toFixed(1)}
        <span className="text-base font-normal text-ink-muted"> / {max}</span>
      </p>
    </div>
  );
}
