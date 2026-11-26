
import { useEffect, useState } from 'react';
import {
  apiStudentCheckIn,
  apiGetMyAttendance,
} from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadAttendance = async () => {
    try {
      const res = await apiGetMyAttendance();
      setAttendance(res.attendance || []);
    } catch (err) {
      setError(err.message || 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!sessionId.trim() || !/^\d{6}$/.test(otp)) {
      setError('Enter the session ID and a valid 6-digit OTP.');
      return;
    }

    setSubmitting(true);

    try {
      await apiStudentCheckIn({
        sessionId: sessionId.trim(),
        otp,
      });

      setMessage('Attendance marked successfully!');
      setSessionId('');
      setOtp('');
      await loadAttendance();
    } catch (err) {
      setError(err.message || 'Could not mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading attendance..." />;

  const presentCount = attendance.filter(
    (record) => record.status === 'present'
  ).length;

  const lastCheckIn = attendance[0]?.checkedInAt
    ? new Date(attendance[0].checkedInAt).toLocaleDateString()
    : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-terracotta">
          Attendance
        </h1>
        <p className="mt-2 text-sm text-muted dark:text-sand">
          Mark your attendance using the OTP shared by your mentor.
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
          <p className="text-xs font-semibold uppercase text-terracotta">
            Total Check-ins
          </p>
          <p className="mt-2 font-display text-3xl text-charcoal dark:text-cream">
            {attendance.length}
          </p>
        </div>

        <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
          <p className="text-xs font-semibold uppercase text-terracotta">
            Present
          </p>
          <p className="mt-2 font-display text-3xl text-charcoal dark:text-cream">
            {presentCount}
          </p>
        </div>

        <div className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
          <p className="text-xs font-semibold uppercase text-terracotta">
            Last Check-in
          </p>
          <p className="mt-2 font-display text-2xl text-charcoal dark:text-cream">
            {lastCheckIn}
          </p>
        </div>
      </div>

      <section className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
        <h2 className="mb-4 font-display text-xl font-semibold text-charcoal dark:text-cream">
          Mark Your Attendance
        </h2>

        <form onSubmit={handleCheckIn} className="max-w-xl space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal dark:text-cream">
              Attendance Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Paste session ID shared by your mentor"
              required
              className="w-full rounded-xl border border-sand bg-cream px-4 py-3 text-sm dark:border-white/10 dark:bg-charcoal dark:text-cream"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-charcoal dark:text-cream">
              6-Digit OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter attendance OTP"
              required
              className="w-full rounded-xl border border-sand bg-cream px-4 py-3 text-sm tracking-widest dark:border-white/10 dark:bg-charcoal dark:text-cream"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Checking...' : 'Mark Present'}
          </button>
        </form>
      </section>

      <section className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
        <h2 className="mb-4 font-display text-xl font-semibold text-charcoal dark:text-cream">
          Attendance History
        </h2>

        {attendance.length === 0 ? (
          <EmptyState message="No attendance records yet. Join your first session using the OTP shared by your mentor." />
        ) : (
          <div className="space-y-3">
            {attendance.map((record) => (
              <div
                key={record._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand/50 p-4 dark:border-white/10"
              >
                <div>
                  <p className="font-medium text-charcoal dark:text-cream">
                    {record.session?.class?.className || 'Class'}
                    {record.session?.subject?.subjectName
                      ? ` · ${record.session.subject.subjectName}`
                      : ''}
                  </p>
                  <p className="mt-1 text-xs text-muted dark:text-sand">
                    {record.checkedInAt
                      ? new Date(record.checkedInAt).toLocaleString()
                      : 'Date unavailable'}
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
