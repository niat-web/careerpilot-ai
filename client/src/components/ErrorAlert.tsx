type Props = {
  message: string;
  onClose?: () => void;
};

export function ErrorAlert({ message, onClose }: Props) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <p>{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-red-600 hover:text-red-900"
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  );
}
