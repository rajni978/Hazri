// export default function StatCard({ title, value, subtitle, trend }) {
//   return (
//     <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//       <p className="text-sm font-semibold text-terracotta uppercase tracking-wider">{title}</p>
//       <p className="mt-1 font-display text-3xl text-charcoal dark:text-cream">{value}</p>
//       {subtitle && <p className="mt-1 text-xs text-muted dark:text-sand">{subtitle}</p>}
//       {trend !== undefined && (
//         <p className="mt-1 text-xs font-medium">
//           {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
//         </p>
//       )}
//     </div>
//   );
// }


export default function StatCard({ title, value, subtitle, trend }) {
  const icons = {
    Students: '👥',
    Mentors: '🎓',
    Classes: '🏫',
    Subjects: '📚',
    'Your Class': '🏫',
    Attendance: '📊',
    'Account Status': '✓',
  };

  const icon = icons[title] || '✦';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-sand/70 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-terracotta/5 dark:border-white/10 dark:bg-bark">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted dark:text-sand">
            {title}
          </p>

          <p className="mt-3 font-display text-3xl font-semibold tracking-tight text-charcoal dark:text-cream">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/10 text-xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>

      {subtitle && (
        <p className="mt-3 text-xs text-muted dark:text-sand/80">
          {subtitle}
        </p>
      )}

      {trend !== undefined && (
        <p className={`mt-3 text-xs font-semibold ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-terracotta transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

