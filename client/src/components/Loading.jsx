export default function Loading({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-muted dark:text-sand">
      <span className="animate-spin text-terracotta">↻</span>
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );
}
