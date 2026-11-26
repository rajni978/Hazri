
import { useEffect, useState } from 'react';
import {
  apiGetMentorProfile,
  apiCreateAttendanceSession,
  apiListAttendanceSessions,
  apiGetSessionAttendance,
  apiRegenerateAttendanceOTP,
  apiUpdateAttendance,
  apiFinalizeAttendanceSession,
  apiExportSessionAttendance,
} from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

export default function MentorAttendance() {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [activeOTP, setActiveOTP] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [buttonLoading, setButtonLoading] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [corrections, setCorrections] = useState({});

  const loadData = async () => {
    try {
      const [profileRes, sessionRes] = await Promise.all([
        apiGetMentorProfile(),
        apiListAttendanceSessions(),
      ]);

      setProfile(profileRes.data);
      setSessions(sessionRes.sessions || []);
    } catch (err) {
      setError(err.message || 'Could not load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const classes = profile?.assignedClasses || [];
  const subjects = profile?.assignedSubjects || [];

  const availableSubjects = subjects.filter((subject) =>
    subject.classes?.some(
      (item) => (item._id || item).toString() === classId
    )
  );

  const copyToClipboard = async (value, label) => {
    try {
      await navigator.clipboard.writeText(String(value));
      setCopied(label);
      setError('');
      setMessage(`${label} copied successfully!`);

      window.setTimeout(() => {
        setCopied((current) => (current === label ? '' : current));
      }, 2500);
    } catch (err) {
      setError(`Could not copy ${label}. Please copy it manually.`);
    }
  };

  const createSession = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setActiveOTP(null);

    if (!classId) {
      setError('Please select a class.');
      return;
    }

    setSaving(true);

    try {
      const body = { classId };

      if (subjectId) {
        body.subjectId = subjectId;
      }

      const result = await apiCreateAttendanceSession(body);
      const session = result.session;
      const generatedSessionId = session?._id || session?.id;
      const generatedOTP = session?.otp || result.otp;

      if (!generatedSessionId || !generatedOTP) {
        throw new Error(
          'Session response did not contain the Session ID or OTP. Please check the server response.'
        );
      }

      setActiveOTP({
        ...session,
        id: generatedSessionId,
        otp: generatedOTP,
      });

      setMessage(
        'Attendance session created successfully. Share the Session ID and OTP with your students.'
      );

      const updated = await apiListAttendanceSessions();
      setSessions(updated.sessions || []);
    } catch (err) {
      setError(err.message || 'Could not create attendance session.');
    } finally {
      setSaving(false);
    }
  };

  const regenerateOTP = async (session) => {
    const sessionId = session._id || session.id;

    if (!sessionId) {
      setError('Attendance session ID is missing.');
      return;
    }

    setButtonLoading(`otp-${sessionId}`);
    setError('');
    setMessage('');

    try {
      const result = await apiRegenerateAttendanceOTP(sessionId);

      setActiveOTP({
        id: sessionId,
        otp: result.otp,
        expiresAt: result.expiresAt,
        class: session.class?.className || 'Class',
        subject: session.subject?.subjectName || null,
      });

      setMessage('New OTP generated successfully. Share it with students.');

      const updated = await apiListAttendanceSessions();
      setSessions(updated.sessions || []);
    } catch (err) {
      setError(err.message || 'Could not regenerate OTP.');
    } finally {
      setButtonLoading('');
    }
  };

  const saveCorrection = async (record) => {
    const draft = corrections[record._id];

    if (!draft?.reason?.trim()) {
      setError('Please enter a reason for the correction.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const result = await apiUpdateAttendance(record._id, {
        status: draft.status,
        reason: draft.reason,
      });

      setRecords((previous) =>
        previous.map((item) =>
          item._id === record._id ? result.attendance : item
        )
      );

      setMessage('Attendance corrected successfully.');
    } catch (err) {
      setError(err.message || 'Could not update attendance.');
    } finally {
      setSaving(false);
    }
  };

  const viewAttendance = async (session) => {
    const sessionId = session._id || session.id;

    if (!sessionId) {
      setError('Session ID is missing. Cannot load attendance.');
      return;
    }

    setButtonLoading(`view-${sessionId}`);
    setSelectedSession(session);
    setRecords([]);
    setCorrections({});
    setError('');
    setMessage('');
    setRecordsLoading(true);

    try {
      const result = await apiGetSessionAttendance(sessionId);

      if (!result.success) {
        throw new Error(result.message || 'Could not load attendance.');
      }

      const attendanceRecords = Array.isArray(result.attendance)
        ? result.attendance
        : [];

      setRecords(attendanceRecords);

      setMessage(
        attendanceRecords.length
          ? `${attendanceRecords.length} attendance record(s) loaded successfully.`
          : 'Attendance loaded. No students have checked in yet.'
      );

      // Bring the attendance section into view.
      window.setTimeout(() => {
        document
          .getElementById('session-attendance-records')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setSelectedSession(null);
      setError(err.message || 'Could not load session attendance.');
    } finally {
      setRecordsLoading(false);
      setButtonLoading('');
    }
  };

  const finalizeSession = async (session) => {
    const sessionId = session._id || session.id;

    if (!sessionId) {
      setError('Session ID is missing.');
      return;
    }

    const confirmed = window.confirm(
      'Finalize this attendance session? You will not be able to edit attendance afterward.'
    );

    if (!confirmed) return;

    setButtonLoading(`finalize-${sessionId}`);
    setError('');
    setMessage('');

    try {
      await apiFinalizeAttendanceSession(sessionId);

      setSessions((previous) =>
        previous.map((item) =>
          (item._id || item.id) === sessionId
            ? { ...item, status: 'finalized' }
            : item
        )
      );

      if (
        selectedSession &&
        (selectedSession._id || selectedSession.id) === sessionId
      ) {
        setSelectedSession((previous) => ({
          ...previous,
          status: 'finalized',
        }));
      }

      setMessage('Attendance session finalized successfully!');
    } catch (err) {
      setError(err.message || 'Could not finalize attendance session.');
    } finally {
      setButtonLoading('');
    }
  };

  const exportAttendance = async (session) => {
    const sessionId = session._id || session.id;

    if (!sessionId) {
      setError('Session ID is missing.');
      return;
    }

    setButtonLoading(`export-${sessionId}`);
    setError('');
    setMessage('');

    try {
      const blob = await apiExportSessionAttendance(sessionId);

      if (!blob || blob.size === 0) {
        throw new Error('The exported CSV file is empty.');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `attendance-${sessionId}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setMessage('Attendance CSV downloaded successfully!');
    } catch (err) {
      setError(err.message || 'Could not export attendance.');
    } finally {
      setButtonLoading('');
    }
  };

  if (loading) {
    return <Loading message="Loading attendance..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-charcoal dark:text-cream">
          Attendance Management
        </h1>
        <p className="mt-2 text-sm text-muted dark:text-sand">
          Create attendance sessions and monitor student check-ins.
        </p>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {message && <Alert type="success">{message}</Alert>}

      <form
        onSubmit={createSession}
        className="max-w-2xl space-y-4 rounded-2xl border border-sand/70 bg-paper p-6 dark:border-white/10 dark:bg-bark"
      >
        <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
          Start attendance session
        </h2>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Select class
          </label>
          <select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
              setSubjectId('');
            }}
            className="w-full rounded-xl border border-sand bg-cream px-4 py-3 text-sm dark:border-white/10 dark:bg-charcoal dark:text-cream"
            required
          >
            <option value="">Choose a class</option>
            {classes.map((item) => (
              <option key={item._id} value={item._id}>
                {item.className} ({item.classCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Select subject (optional)
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full rounded-xl border border-sand bg-cream px-4 py-3 text-sm dark:border-white/10 dark:bg-charcoal dark:text-cream"
          >
            <option value="">No specific subject</option>
            {availableSubjects.map((item) => (
              <option key={item._id} value={item._id}>
                {item.subjectName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={saving || !classes.length || !!buttonLoading}
          className="rounded-xl bg-terracotta px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Generating...' : 'Generate attendance OTP'}
        </button>
      </form>

      {activeOTP && (
        <section className="max-w-2xl rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6">
          <p className="text-sm font-medium text-muted dark:text-sand">
            Share these details with your students
          </p>

          <div className="my-3 flex flex-wrap items-center gap-3">
            <p className="text-4xl font-bold tracking-[0.3em] text-terracotta">
              {activeOTP.otp}
            </p>

            <button
              type="button"
              onClick={() => copyToClipboard(activeOTP.otp, 'OTP')}
              className="rounded-lg border border-terracotta px-3 py-2 text-xs font-semibold text-terracotta"
            >
              {copied === 'OTP' ? '✓ Copied!' : 'Copy OTP'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="break-all text-sm text-muted dark:text-sand">
              Session ID: {activeOTP.id}
            </p>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(activeOTP.id, 'Session ID')
              }
              className="rounded-lg border border-terracotta px-3 py-1 text-xs font-semibold text-terracotta"
            >
              {copied === 'Session ID' ? '✓ Copied!' : 'Copy Session ID'}
            </button>
          </div>

          <p className="mt-2 text-sm text-muted dark:text-sand">
            Class: {activeOTP.class || 'Class'} · Subject:{' '}
            {activeOTP.subject || 'General'}
          </p>

          <p className="mt-2 text-sm text-muted dark:text-sand">
            Expires:{' '}
            {activeOTP.expiresAt
              ? new Date(activeOTP.expiresAt).toLocaleTimeString()
              : 'Not available'}
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-sand/70 bg-paper p-6 dark:border-white/10 dark:bg-bark">
        <h2 className="mb-4 font-display text-xl font-semibold text-charcoal dark:text-cream">
          Previous sessions
        </h2>

        {sessions.length ? (
          <div className="space-y-3">
            {sessions.map((session) => {
              const sessionId = session._id || session.id;

              return (
                <div
                  key={sessionId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand/50 p-4 dark:border-white/10"
                >
                  <div>
                    <p className="font-medium text-charcoal dark:text-cream">
                      {session.class?.className || 'Class'}
                      {session.subject?.subjectName
                        ? ` · ${session.subject.subjectName}`
                        : ''}
                    </p>

                    <p className="mt-1 text-xs text-muted dark:text-sand">
                      {session.createdAt
                        ? new Date(session.createdAt).toLocaleString()
                        : 'Date unavailable'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-medium text-terracotta">
                      {session.status}
                    </span>

                    {session.status === 'active' && (
                      <button
                        type="button"
                        disabled={!!buttonLoading || saving}
                        onClick={() => regenerateOTP(session)}
                        className="rounded-xl border border-terracotta px-4 py-2 text-xs font-semibold text-terracotta disabled:opacity-50"
                      >
                        {buttonLoading === `otp-${sessionId}`
                          ? 'Generating...'
                          : 'Regenerate OTP'}
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={!!buttonLoading || saving}
                      onClick={() => viewAttendance(session)}
                      className="rounded-xl bg-terracotta px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {buttonLoading === `view-${sessionId}`
                        ? 'Loading...'
                        : 'View Attendance'}
                    </button>

                    {session.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => finalizeSession(session)}
                        disabled={!!buttonLoading || saving}
                        className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        {buttonLoading === `finalize-${sessionId}`
                          ? 'Finalizing...'
                          : 'Finalize Attendance'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => exportAttendance(session)}
                      disabled={!!buttonLoading || saving}
                      className="rounded-xl bg-green-700 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      {buttonLoading === `export-${sessionId}`
                        ? 'Exporting...'
                        : 'Export CSV'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted dark:text-sand">
            No attendance sessions created yet.
          </p>
        )}
      </section>

      {selectedSession && (
        <section
          id="session-attendance-records"
          className="rounded-2xl border border-sand/70 bg-paper p-6 dark:border-white/10 dark:bg-bark"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
                Student Attendance
              </h2>

              <p className="mt-1 text-sm text-muted dark:text-sand">
                {selectedSession.class?.className || 'Class'}
                {selectedSession.subject?.subjectName
                  ? ` · ${selectedSession.subject.subjectName}`
                  : ''}
              </p>

              <p className="mt-1 text-xs font-medium text-muted dark:text-sand">
                Status: {selectedSession.status}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedSession(null);
                setRecords([]);
                setError('');
                setMessage('');
              }}
              className="rounded-xl border border-sand px-4 py-2 text-sm dark:border-white/20"
            >
              Close
            </button>
          </div>

          {recordsLoading ? (
            <Loading message="Loading student records..." />
          ) : records.length ? (
            <>
              <p className="mb-4 text-sm font-medium text-charcoal dark:text-cream">
                Total attendance records: {records.length}
              </p>

              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record._id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sand/50 p-4 dark:border-white/10"
                  >
                    <div>
                      <p className="font-medium text-charcoal dark:text-cream">
                        {record.student?.user?.fullName || 'Student'}
                      </p>

                      <p className="mt-1 text-xs text-muted dark:text-sand">
                        {record.student?.user?.email || 'No email available'}
                      </p>

                      <p className="mt-1 text-xs text-muted dark:text-sand">
                        Checked in:{' '}
                        {record.checkedInAt
                          ? new Date(record.checkedInAt).toLocaleString()
                          : 'Unavailable'}
                      </p>

                      <p className="mt-1 text-xs text-muted dark:text-sand">
                        Attendance: {record.status}
                      </p>

                      {record.reason && (
                        <p className="mt-1 text-xs text-muted dark:text-sand">
                          Reason: {record.reason}
                        </p>
                      )}
                    </div>

                    <div className="w-full space-y-2 sm:w-64">
                      {selectedSession.status === 'finalized' ? (
                        <p className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
                          Attendance finalized. Editing is locked.
                        </p>
                      ) : (
                        <>
                          <select
                            value={
                              corrections[record._id]?.status ??
                              record.status
                            }
                            onChange={(e) =>
                              setCorrections((previous) => ({
                                ...previous,
                                [record._id]: {
                                  status: e.target.value,
                                  reason:
                                    previous[record._id]?.reason || '',
                                },
                              }))
                            }
                            className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm dark:border-white/10 dark:bg-charcoal dark:text-cream"
                          >
                            <option value="present">Present</option>
                            <option value="late">Late</option>
                            <option value="absent">Absent</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Reason for correction"
                            value={corrections[record._id]?.reason || ''}
                            onChange={(e) =>
                              setCorrections((previous) => ({
                                ...previous,
                                [record._id]: {
                                  status:
                                    previous[record._id]?.status ||
                                    record.status,
                                  reason: e.target.value,
                                },
                              }))
                            }
                            className="w-full rounded-lg border border-sand bg-cream px-3 py-2 text-sm dark:border-white/10 dark:bg-charcoal dark:text-cream"
                          />

                          <button
                            type="button"
                            disabled={saving || !!buttonLoading}
                            onClick={() => saveCorrection(record)}
                            className="w-full rounded-lg bg-terracotta px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save Correction'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="rounded-xl bg-cream/70 p-4 text-sm text-muted dark:bg-charcoal dark:text-sand">
              No students have checked in for this session yet.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
