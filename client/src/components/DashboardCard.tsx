type Props = {
  title: string;
  value: string | number;
  hint?: string;
};

export function DashboardCard({ title, value, hint }: Props) {
  return (
    <div className="surface-panel p-4">
      <p className="text-xs font-medium text-ink-muted">{title}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}
