import { useMemo, useState } from 'react';

export default function DataTable({ columns, data, loading = false, emptyMessage = 'No records found.' }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const term = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return value != null && String(value).toLowerCase().includes(term);
      })
    );
  }, [data, search, columns]);

  if (loading) return <Loading />;
  if (!filtered || filtered.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="surface border border-sand bg-paper dark:border-sand/30 dark:bg-bark">
      <div className="border-b border-sand bg-paper/60 dark:bg-bark/60 dark:border-sand/30 px-5 py-3 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full min-w-0 border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40 text-sm"
        />
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-sand dark:border-sand/30">
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase tracking-[0.1em]">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sand dark:divide-sand/30">
          {filtered.map((row) => (
            <tr key={row._id || row.id} className="hover:bg-sand/50 dark:hover:bg-sand/40 transition">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 text-charcoal dark:text-cream">
                  {typeof col.render === 'function' ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Loading() {
  return (
    <div className="py-10 text-center text-muted dark:text-sand">Loading…</div>
  );
}
