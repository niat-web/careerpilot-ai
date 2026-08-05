type Props = {
  message: string;
  onClose?: () => void;
};

export function ErrorAlert({ message, onClose }: Props) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-danger/20 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <p>{message}</p>
      {onClose && (
        <button type="button" onClick={onClose} className="shrink-0 font-semibold" aria-label="Dismiss error">
          ×
        </button>
      )}
    </div>
  );
}
