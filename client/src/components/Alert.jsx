export default function Alert({ type = 'error', children }) {
  const variants = {
    error: 'border-terracotta bg-terracotta/10 text-terracotta',
    success: 'border-sage bg-sage/10 text-charcoal dark:text-cream',
    info: 'border-sand bg-sand/10 text-charcoal dark:text-cream',
  };
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-4 text-sm rounded border px-4 py-3 ${variants[type]}`}
    >
      {children}
    </p>
  );
}
