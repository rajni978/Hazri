import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetMentorProfile } from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

export default function MentorStudents() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetMentorProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || 'Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading students…" />;
  if (error) return <Alert type="error">{error}</Alert>;

  const students = profile?.students || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-terracotta">My Students</h1>
        <p className="text-sm text-muted dark:text-sand">Students across your assigned classes</p>
      </div>

      {students.length ? (
        <>
        <table className="w-full surface border border-sand bg-paper text-sm dark:border-sand/30 dark:bg-bark">
          <thead className="border-b border-sand dark:border-sand/30">
            <tr>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Student</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Student ID</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Class</th>
              <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand dark:divide-sand/30">
            {students.map((s) => (
              <tr key={s._id} className="text-charcoal dark:text-cream">
                <td className="px-5 py-4 font-medium">{s.user?.fullName}</td>
                <td className="px-5 py-4"><span className="border border-sand px-1.5 py-0.5 rounded text-xs text-muted">{s.studentId}</span></td>
                <td className="px-5 py-4 text-sm text-muted dark:text-sand">{s.class?.className || '—'}</td>
                <td className="px-5 py-4 text-sm text-muted dark:text-sand">{s.user?.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3">
          <p className="text-sm text-muted dark:text-sand">Total: {students.length} student(s)</p>
        </div>
        </>
      ) : (
        <EmptyState message="No students found in your assigned classes." />
      )}
    </div>
  );
}
