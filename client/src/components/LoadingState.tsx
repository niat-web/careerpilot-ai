type Props = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = 'Loading…', className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-soft border-t-accent" />
      <p className="animate-pulse-soft text-sm text-ink-muted">{label}</p>
    </div>
  );
}
