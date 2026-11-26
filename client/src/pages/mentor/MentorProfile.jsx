import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetMentorProfile, apiUpdateMentorProfile } from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import Btn from '../../components/Btn';

export default function MentorProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ phone: '', fullName: '', email: '' });

  useEffect(() => {
    apiGetMentorProfile()
      .then((res) => {
        const p = res.data;
        setProfile(p);
        setForm({ phone: p.phone || '', fullName: p.user?.fullName || '', email: p.user?.email || '' });
      })
      .catch((err) => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading profile…" />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!profile) return <EmptyState message="Profile not available." />;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await apiUpdateMentorProfile({ phone: form.phone, fullName: form.fullName, email: form.email });
      setSuccess('Profile updated successfully.');
      setProfile((prev) => ({ ...prev, phone: form.phone, user: { ...prev.user, fullName: form.fullName, email: form.email } }));
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  const classes = profile.assignedClasses || [];
  const subjects = profile.assignedSubjects || [];

  return (
    <div className="max-w-2xl space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center bg-terracotta font-display text-xl text-cream rounded-full">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
            <div>
              <h2 className="font-display text-xl text-charcoal dark:text-cream">{user?.fullName}</h2>
              <p className="text-sm text-muted dark:text-sand capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-charcoal dark:text-cream"><strong>Mentor ID:</strong> {profile.mentorId}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">Email</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">{profile.user?.email}</dd>
          </div>
          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">Phone</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">{profile.phone || 'Not provided'}</dd>
          </div>
          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">Classes</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">{profile.assignedClasses?.length}</dd>
          </div>
          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">Subjects</dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">{profile.assignedSubjects?.length}</dd>
          </div>
          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">Account status</dt>
            <dd className="mt-1 text-sm font-semibold">{profile.isActive ? 'Active' : 'Inactive'}</dd>
          </div>
        </dl>
      </div>

      <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
        <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">Update profile</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">Full name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">Email address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>
          <Btn type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Btn>
        </form>
      </div>

      <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
        <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">My academic responsibilities</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-sand p-4 rounded dark:border-sand/30">
            <p className="text-xs font-semibold text-terracotta uppercase mb-2">Assigned classes</p>
            <ul className="text-sm space-y-1">
              {classes.length ? classes.map((c) => <li key={c._id}>{c.className} ({c.classCode})</li>) : <li className="text-muted">None</li>}
            </ul>
          </div>
          <div className="border border-sand p-4 rounded dark:border-sand/30">
            <p className="text-xs font-semibold text-terracotta uppercase mb-2">Assigned subjects</p>
            <ul className="text-sm space-y-1">
              {subjects.length ? subjects.map((s) => <li key={s._id}>{s.subjectName} ({s.subjectCode})</li>) : <li className="text-muted">None</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
