import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetStudentProfile } from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

export default function StudentSubjects() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetStudentProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || 'Failed to load subjects'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading subjects…" />;
  if (error) return <Alert type="error">{error}</Alert>;

  const subjects = profile?.subjects || [];
  const theClass = profile?.class;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-terracotta">My Subjects</h1>
        <p className="text-sm text-muted dark:text-sand">
          Class: {theClass?.className || '—'}
        </p>
      </div>

      {subjects.length ? (
        <table className="w-full surface border border-sand bg-paper text-sm dark:border-sand/30 dark:bg-bark">
          <thead className="border-b border-sand dark:border-sand/30">
            <tr>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Subject</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Code</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand dark:divide-sand/30">
            {subjects.map((s) => (
              <tr key={s._id} className="text-charcoal dark:text-cream">
                <td className="px-5 py-4 font-medium">{s.subjectName}</td>
                <td className="px-5 py-4">
                  <span className="border border-sand px-1.5 py-0.5 rounded text-xs text-muted">{s.subjectCode}</span>
                </td>
                <td className="px-5 py-4 text-muted dark:text-sand">{s.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="No subjects assigned to your class." />
      )}
    </div>
  );
}
