
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  apiGetStudentProfile,
  apiUpdateStudentProfile
} from '../../services/api';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import Btn from '../../components/Btn';

export default function StudentProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    phone: '',
    fullName: '',
    email: ''
  });

  useEffect(() => {
    apiGetStudentProfile()
      .then((res) => {
        const p = res.data;
        setProfile(p);

        setForm({
          phone: p.phone || '',
          fullName: p.user?.fullName || '',
          email: p.user?.email || ''
        });
      })
      .catch((err) => {
        setError(err.message || 'Failed to load profile');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await apiUpdateStudentProfile({
        phone: form.phone,
        fullName: form.fullName,
        email: form.email
      });

      setSuccess('Profile updated successfully.');

      setProfile((prev) => ({
        ...prev,
        phone: form.phone,
        user: {
          ...prev.user,
          fullName: form.fullName,
          email: form.email
        }
      }));
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading message="Loading profile…" />;
  }

  if (error && !profile) {
    return <Alert type="error">{error}</Alert>;
  }

  if (!profile) {
    return <EmptyState message="Profile not available." />;
  }

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
              <h2 className="font-display text-xl text-charcoal dark:text-cream">
                {user?.fullName}
              </h2>
              <p className="text-sm text-muted dark:text-sand capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <div className="text-right hidden md:block">
            <p className="text-sm text-charcoal dark:text-cream">
              <strong>Student ID:</strong> {profile.studentId}
            </p>
            <p className="text-sm text-charcoal dark:text-cream">
              <strong>Roll Number:</strong> {profile.user?.rollNumber}
            </p>
          </div>

        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">
              Email
            </dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">
              {profile.user?.email}
            </dd>
          </div>

          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">
              Phone
            </dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">
              {profile.phone || 'Not provided'}
            </dd>
          </div>

          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">
              Class
            </dt>
            <dd className="mt-1 text-sm text-charcoal dark:text-cream">
              {profile.class?.className || 'Not assigned'}
            </dd>
          </div>

          <div className="border border-sand p-3 rounded dark:border-sand/30">
            <dt className="text-xs font-semibold text-terracotta uppercase">
              Account status
            </dt>
            <dd className="mt-1 text-sm font-semibold">
              {profile.isActive ? 'Active' : 'Inactive'}
            </dd>
          </div>

        </dl>
      </div>

      <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">

        <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
          Update profile
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
              Full name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
              Email address
            </label>
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
            <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
              Phone
            </label>
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

    </div>
  );
}
