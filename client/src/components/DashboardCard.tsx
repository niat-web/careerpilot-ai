type Props = {
  title: string;
  value: string | number;
  hint?: string;
};

export function DashboardCard({ title, value, hint }: Props) {
  return (
    <div className="surface-panel p-4 transition-shadow hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{title}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
