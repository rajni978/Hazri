export default function EmptyState({ message = 'No records found.' }) {
  return (
    <div className="surface border border-sand bg-paper p-12 text-center dark:border-sand/30 dark:bg-bark">
      <p className="text-muted dark:text-sand">{message}</p>
    </div>
  );
}
