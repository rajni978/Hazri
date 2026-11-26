
export default function ConfirmDialog({
  open,
  title = 'Confirm action',
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Confirmation box */}
      <div className="relative z-10 surface border border-sand bg-paper p-6 rounded-lg shadow-xl dark:border-sand/30 dark:bg-bark w-full max-w-md">
        <h3 className="font-display text-xl text-charcoal dark:text-cream">
          {title}
        </h3>

        <p className="mt-2 text-sm text-muted dark:text-sand">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-sand rounded hover:bg-sand/50 dark:hover:bg-sand/40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm border border-terracotta bg-terracotta text-cream rounded hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
