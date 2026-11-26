import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetStudentProfile } from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

export default function StudentClass() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetStudentProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || 'Failed to load class'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading your class…" />;
  if (error) return <Alert type="error">{error}</Alert>;

  const theClass = profile?.class;
  const subjects = profile?.subjects || [];
  const mentors = profile?.mentors || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-terracotta">My Class</h1>
      </div>

      {profile && !theClass ? (
        <EmptyState message="You are not assigned to any class yet." />
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark col-span-4 md:col-span-2">
            <h2 className="font-display text-xl text-charcoal dark:text-cream mb-3">
              {theClass?.className}
            </h2>
            <p className="text-sm text-muted dark:text-sand">{theClass?.classCode}</p>
            <p className="mt-2 text-sm text-charcoal dark:text-cream">{theClass?.description || 'No description available.'}</p>
            <p className="mt-1 text-xs text-muted dark:text-sand">Academic year: {theClass?.academicYear || '—'}</p>
          </div>

          <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark md:col-span-2">
            <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Enrolled Subjects</h3>
            {subjects.length ? (
              <ul className="space-y-2 text-sm">
                {subjects.map((s) => (
                  <li key={s._id} className="border-b border-sand/50 dark:border-sand/30 pb-2 last:border-0 flex items-center justify-between">
                    <span>{s.subjectName}</span>
                    <span className="text-xs border border-sand px-1.5 py-0.5 rounded text-muted">{s.subjectCode}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No subjects assigned to this class." />
            )}
          </div>

          <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark md:col-span-2">
            <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Class Mentor(s)</h3>
            {mentors.length ? (
              <ul className="space-y-2 text-sm">
                {mentors.map((m) => (
                  <li key={m._id} className="border-b border-sand/50 dark:border-sand/30 pb-2 last:border-0">
                    <p className="text-sm text-charcoal dark:text-cream">{m.mentorId}</p>
                    <p className="text-xs text-muted dark:text-sand">{m.phone || 'No contact'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No mentor assigned to this class." />
            )}
          </div>

          <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark md:col-span-2">
            <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Class Representative</h3>
            <p className="text-sm text-charcoal dark:text-cream">{user?.fullName}</p>
            <p className="text-xs text-muted dark:text-sand">{profile.studentId}</p>
          </div>
        </div>
      )}
    </div>
  );
}
