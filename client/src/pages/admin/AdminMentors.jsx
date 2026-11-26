
import { useEffect, useState } from 'react';
import {
  apiListMentors,
  apiCreateMentor,
  apiUpdateMentor,
  apiDeleteMentor,
} from '../../services/api';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import Btn from '../../components/Btn';
import ConfirmDialog from '../../components/ConfirmDialog';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  password: '',
  mentorId: '',
  phone: '',
};

export default function AdminMentors() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ ...INITIAL_FORM });
  const [originalForm, setOriginalForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await apiListMentors();
      setMentors(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setError('');
    setSuccess('');
    setEditForm({ ...INITIAL_FORM });
    setOriginalForm(null);
    setEditId(null);
    setAddOpen(true);
  }

  function loadForEdit(mentor) {
    const formData = {
      fullName: mentor.user?.fullName || '',
      email: mentor.user?.email || '',
      password: '',
      mentorId: mentor.mentorId || '',
      phone: mentor.phone || '',
    };

    setError('');
    setSuccess('');
    setEditForm(formData);
    setOriginalForm({ ...formData });
    setEditId(mentor._id);
    setAddOpen(false);
  }

  function closeAddEdit() {
    setAddOpen(false);
    setEditId(null);
    setEditForm({ ...INITIAL_FORM });
    setOriginalForm(null);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddOrEditSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editForm.fullName.trim() || !editForm.email.trim() || !editForm.mentorId.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (addOpen && editForm.password.trim().length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!addOpen && (!editId || !originalForm)) {
      setError('Please select a valid mentor to update.');
      return;
    }

    if (!addOpen) {
      const fieldsToCompare = ['fullName', 'email', 'mentorId', 'phone'];

      const hasChanges = fieldsToCompare.some(
        (field) =>
          String(editForm[field] || '').trim() !==
          String(originalForm[field] || '').trim()
      );

      if (!hasChanges) {
        setError('No changes detected.');
        return;
      }
    }

    setSaving(true);

    try {
      const body = {
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        mentorId: editForm.mentorId.trim(),
        phone: editForm.phone.trim(),
      };

      if (addOpen) {
        body.password = editForm.password;
        await apiCreateMentor(body);
        setSuccess('Mentor created successfully.');
      } else {
        await apiUpdateMentor(editId, body);
        setSuccess('Mentor updated successfully.');
      }

      closeAddEdit();
      await loadData();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      await apiDeleteMentor(deleteId);
      setSuccess('Mentor deactivated.');
      setDeleteId(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Deactivate failed');
      setDeleteId(null);
    }
  }

  const filtered = mentors.filter((mentor) => {
    const query = search.toLowerCase();

    return (
      !query ||
      mentor.mentorId?.toLowerCase().includes(query) ||
      mentor.user?.fullName?.toLowerCase().includes(query) ||
      mentor.user?.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-terracotta">Mentors</h1>
          <p className="text-muted dark:text-sand">
            Manage mentor accounts and academic responsibilities.
          </p>
        </div>

        <Btn variant="primary" onClick={openAddForm}>
          Add mentor
        </Btn>
      </div>

      <div>
        <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
          Search name, email or ID
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
          placeholder="Search..."
        />
      </div>

      {loading ? (
        <p className="text-muted dark:text-sand">Loading mentors...</p>
      ) : filtered.length ? (
        <div className="overflow-x-auto">
          <table className="w-full surface border border-sand bg-paper text-sm dark:border-sand/30 dark:bg-bark">
            <thead className="border-b border-sand dark:border-sand/30">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Mentor</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">ID</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Email</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Classes</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Subjects</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sand dark:divide-sand/30">
              {filtered.map((mentor) => (
                <tr
                  key={mentor._id}
                  className="text-charcoal dark:text-cream hover:bg-sand/50 dark:hover:bg-sand/40 transition"
                >
                  <td className="px-5 py-4 font-medium">
                    {mentor.user?.fullName || '—'}
                  </td>

                  <td className="px-5 py-4">{mentor.mentorId}</td>

                  <td className="px-5 py-4 text-muted dark:text-sand">
                    {mentor.user?.email}
                  </td>

                  <td className="px-5 py-4">
                    {mentor.assignedClasses?.length || 0}
                  </td>

                  <td className="px-5 py-4">
                    {mentor.assignedSubjects?.length || 0}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded text-xs font-semibold ${
                        mentor.isActive
                          ? 'bg-sage/20 text-sage border border-sage/40'
                          : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
                      }`}
                    >
                      {mentor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Btn
                        variant="secondary"
                        size="sm"
                        onClick={() => loadForEdit(mentor)}
                      >
                        Edit
                      </Btn>

                      {mentor.isActive && (
                        <Btn
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteId(mentor._id)}
                        >
                          Deactivate
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No mentors found." />
      )}

      {(addOpen || editId) && (
        <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
            {addOpen ? 'Add new mentor' : 'Edit mentor'}
          </h3>

          <form
            onSubmit={handleAddOrEditSubmit}
            className="grid gap-4 md:grid-cols-2 items-end"
          >
            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Full name *
              </label>
              <input
                name="fullName"
                value={editForm.fullName}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Email *
              </label>
              <input
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
                required
              />
            </div>

            {addOpen && (
              <div>
                <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                  Password *
                </label>
                <input
                  name="password"
                  type="password"
                  value={editForm.password}
                  onChange={handleFormChange}
                  minLength={8}
                  className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Mentor ID *
              </label>
              <input
                name="mentorId"
                value={editForm.mentorId}
                onChange={handleFormChange}
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
                value={editForm.phone}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Btn
                type="button"
                variant="secondary"
                onClick={closeAddEdit}
              >
                Cancel
              </Btn>

              <Btn
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : addOpen
                    ? 'Create mentor'
                    : 'Update mentor'}
              </Btn>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate mentor"
        message="This will deactivate the mentor account. The mentor will no longer be able to log in."
        confirmLabel="Deactivate"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
