
import { useEffect, useState } from 'react';
import {
  apiListAssignments,
  apiListClasses,
  apiListMentors,
  apiListSubjects,
  apiAssignMentorsToClass,
  apiAssignMentorsToSubject,
  apiAssignSubjectsToClass,
  apiRemoveMentorFromClass,
  apiRemoveMentorFromSubject,
  apiRemoveSubjectFromClass,
} from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import Btn from '../../components/Btn';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState({ classes: [], subjects: [] });
  const [classes, setClasses] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [acClass, setAcClass] = useState('');
  const [acMentors, setAcMentors] = useState([]);
  const [asSubject, setAsSubject] = useState('');
  const [asMentors, setAsMentors] = useState([]);
  const [scClass, setScClass] = useState('');
  const [scSubjects, setScSubjects] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [a, c, m, s] = await Promise.all([
        apiListAssignments(),
        apiListClasses({}),
        apiListMentors({}),
        apiListSubjects({}),
      ]);

      setAssignments(a.data);
      setClasses(c.data);
      setMentors(m.data);
      setSubjects(s.data);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignMentorsToClass(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiAssignMentorsToClass({
        classId: acClass,
        mentorIds: acMentors,
      });
      setSuccess('Mentors assigned to class.');
      setAcMentors([]);
      await loadData();
    } catch (err) {
      setError(err.message || 'Assignment failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleAssignMentorsToSubject(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiAssignMentorsToSubject({
        subjectId: asSubject,
        mentorIds: asMentors,
      });
      setSuccess('Mentors assigned to subject.');
      setAsMentors([]);
      await loadData();
    } catch (err) {
      setError(err.message || 'Assignment failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleAssignSubjectsToClass(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiAssignSubjectsToClass(scClass, {
        subjectIds: scSubjects,
      });
      setSuccess('Subjects assigned to class.');
      setScSubjects([]);
      await loadData();
    } catch (err) {
      setError(err.message || 'Assignment failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveMentorFromClass(classId, mentorId) {
    if (!window.confirm('Remove this mentor from the class?')) return;

    setError('');
    setSuccess('');

    try {
      await apiRemoveMentorFromClass(classId, mentorId);
      setSuccess('Mentor removed from class.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Remove failed');
    }
  }

  async function handleRemoveMentorFromSubject(subjectId, mentorId) {
    if (!window.confirm('Remove this mentor from the subject?')) return;

    setError('');
    setSuccess('');

    try {
      await apiRemoveMentorFromSubject(subjectId, mentorId);
      setSuccess('Mentor removed from subject.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Remove failed');
    }
  }

  async function handleRemoveSubjectFromClass(classId, subjectId) {
    if (!window.confirm('Remove this subject from the class?')) return;

    setError('');
    setSuccess('');

    try {
      await apiRemoveSubjectFromClass(classId, subjectId);
      setSuccess('Subject removed from class.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Remove failed');
    }
  }

  if (loading) {
    return <Loading message="Loading assignments…" />;
  }

  return (
    <div className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <h1 className="font-display text-3xl text-terracotta">
        Mentor Assignments
      </h1>

      <p className="text-muted dark:text-sand">
        Assign mentors to classes and subjects, and subjects to classes.
      </p>

      <div className="grid gap-6 md:grid-cols-4">
        <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark col-span-4 md:col-span-2">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
            Assign mentors to a class
          </h3>

          <form onSubmit={handleAssignMentorsToClass} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Class
              </label>
              <select
                required
                value={acClass}
                onChange={(e) => setAcClass(e.target.value)}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                <option value="">Select a class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.className} ({c.classCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Mentors
              </label>
              <select
                multiple
                size="4"
                required
                value={acMentors}
                onChange={(e) =>
                  setAcMentors(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                {mentors.filter((m) => m.isActive).map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.mentorId} - {m.user?.fullName || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>

            <Btn
              type="submit"
              variant="primary"
              disabled={saving || !acClass || !acMentors.length}
            >
              Assign mentors
            </Btn>
          </form>
        </section>

        <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark col-span-4 md:col-span-2">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
            Assign mentors to a subject
          </h3>

          <form onSubmit={handleAssignMentorsToSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Subject
              </label>
              <select
                required
                value={asSubject}
                onChange={(e) => setAsSubject(e.target.value)}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                <option value="">Select a subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Mentors
              </label>
              <select
                multiple
                size="4"
                required
                value={asMentors}
                onChange={(e) =>
                  setAsMentors(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                {mentors.filter((m) => m.isActive).map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.mentorId} - {m.user?.fullName || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>

            <Btn
              type="submit"
              variant="primary"
              disabled={saving || !asSubject || !asMentors.length}
            >
              Assign mentors
            </Btn>
          </form>
        </section>

        <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark col-span-4 md:col-span-2">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
            Assign subjects to a class
          </h3>

          <form onSubmit={handleAssignSubjectsToClass} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Class
              </label>
              <select
                required
                value={scClass}
                onChange={(e) => setScClass(e.target.value)}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                <option value="">Select a class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.className} ({c.classCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Subjects
              </label>
              <select
                multiple
                size="4"
                required
                value={scSubjects}
                onChange={(e) =>
                  setScSubjects(
                    Array.from(e.target.selectedOptions, (o) => o.value)
                  )
                }
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                {subjects.filter((s) => s.isActive).map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <Btn
              type="submit"
              variant="primary"
              disabled={saving || !scClass || !scSubjects.length}
            >
              Assign subjects
            </Btn>
          </form>
        </section>
      </div>

      <div className="grid gap-6">
        <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">
            Current mentor → class assignments
          </h3>

          {assignments.classes.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-sand dark:border-sand/30">
                    <th className="px-4 py-2 font-semibold text-muted dark:text-sand">Class</th>
                    <th className="px-4 py-2 font-semibold text-muted dark:text-sand">Mentors</th>
                    <th className="px-4 py-2 font-semibold text-muted dark:text-sand">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand dark:divide-sand/30">
                  {assignments.classes.map((c) => (
                    <tr key={c._id} className="text-charcoal dark:text-cream">
                      <td className="px-4 py-3 font-medium">
                        {c.className} ({c.classCode})
                      </td>
                      <td className="px-4 py-3 text-sm text-muted dark:text-sand">
                        {(c.mentors || [])
                          .map((m) =>
                            typeof m === 'string'
                              ? m
                              : m.mentorId || m.user?.fullName || 'Unknown'
                          )
                          .join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {(c.mentors || []).map((m) => (
                          <Btn
                            key={m._id || m}
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveMentorFromClass(
                                c._id,
                                m._id || m
                              )
                            }
                          >
                            Remove
                          </Btn>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted dark:text-sand">
              No class → mentor assignments.
            </p>
          )}
        </section>

        <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">
            Current mentor → subject assignments
          </h3>

          {assignments.subjects.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-sand dark:border-sand/30">
                    <th className="px-4 py-2 font-semibold text-muted dark:text-sand">Subject</th>
                    <th className="px-4 py-2 font-semibold text-muted dark:text-sand">Mentors</th>
                    <th className="px-4 py-2 font-semibold text-muted dark:text-sand">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand dark:divide-sand/30">
                  {assignments.subjects.map((s) => (
                    <tr key={s._id} className="text-charcoal dark:text-cream">
                      <td className="px-4 py-3 font-medium">
                        {s.subjectName} ({s.subjectCode})
                      </td>
                      <td className="px-4 py-3 text-sm text-muted dark:text-sand">
                        {(s.mentors || [])
                          .map((m) =>
                            typeof m === 'string'
                              ? m
                              : m.mentorId || m.user?.fullName || 'Unknown'
                          )
                          .join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3">
                        {(s.mentors || []).map((m) => (
                          <Btn
                            key={m._id || m}
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveMentorFromSubject(
                                s._id,
                                m._id || m
                              )
                            }
                          >
                            Remove
                          </Btn>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted dark:text-sand">
              No subject → mentor assignments.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
