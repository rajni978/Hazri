import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetMentorProfile } from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { Link } from 'react-router-dom';

export default function MentorClasses() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetMentorProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || 'Failed to load classes'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading your classes…" />;
  if (error) return <Alert type="error">{error}</Alert>;

  const classes = profile?.assignedClasses || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-terracotta">My Classes</h1>
        <p className="text-sm text-muted dark:text-sand">Assigned to {user?.fullName}</p>
      </div>

      {classes.length ? (
        <table className="w-full surface border border-sand bg-paper text-sm dark:border-sand/30 dark:bg-bark">
          <thead className="border-b border-sand dark:border-sand/30">
            <tr>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Class</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Code</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Academic Year</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Students</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand dark:divide-sand/30">
            {classes.map((c) => (
              <tr key={c._id} className="text-charcoal dark:text-cream hover:bg-sand/50 dark:hover:bg-sand/40 transition">
                <td className="px-5 py-4 font-medium">{c.className}</td>
                <td className="px-5 py-4"><span className="border border-sand px-1.5 py-0.5 rounded text-xs text-muted">{c.classCode}</span></td>
                <td className="px-5 py-4 text-muted dark:text-sand">{c.academicYear || '—'}</td>
                <td className="px-5 py-4">
                  <Link to={`/mentor/classes/${c._id}/students`} className="text-terracotta font-semibold underline">View students</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState message="No classes have been assigned to you." />
      )}
    </div>
  );
}
