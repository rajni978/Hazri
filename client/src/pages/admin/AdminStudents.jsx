
import { useEffect, useState } from 'react';
import {
  apiListStudents,
  apiCreateStudent,
  apiUpdateStudent,
  apiDeleteStudent,
  apiListClasses,
} from '../../services/api';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import Btn from '../../components/Btn';
import ConfirmDialog from '../../components/ConfirmDialog';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  password: '',
  studentId: '',
  phone: '',
  class: '',
};

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');

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
      const [studentsRes, classesRes] = await Promise.all([
        apiListStudents({ q: search || undefined, class: classFilter || undefined }),
        apiListClasses({}),
      ]);

      setStudents(studentsRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }

  function loadForEdit(s) {
    const formData = {
      fullName: s.user?.fullName || '',
      email: s.user?.email || '',
      password: '',
      studentId: s.studentId || '',
      phone: s.phone || '',
      class: s.class?._id || '',
    };

    setEditForm(formData);
    setOriginalForm({ ...formData });
    setEditId(s._id);
    setAddOpen(false);
    setError('');
    setSuccess('');
  }

  function openAddForm() {
    setEditForm({ ...INITIAL_FORM });
    setOriginalForm(null);
    setEditId(null);
    setAddOpen(true);
    setError('');
    setSuccess('');
  }

  function closeAddEdit() {
    setAddOpen(false);
    setEditId(null);
    setEditForm({ ...INITIAL_FORM });
    setOriginalForm(null);
  }

  function handleFormChange(e) {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleAddOrEditSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !editForm.fullName.trim() ||
      !editForm.email.trim() ||
      !editForm.studentId.trim()
    ) {
      setError('Please fill in all required fields: Full name, Email and Student ID.');
      return;
    }

    if (addOpen && editForm.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!addOpen && editForm.password && editForm.password.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (!addOpen && originalForm) {
      const fieldsToCompare = [
        'fullName',
        'email',
        'studentId',
        'phone',
        'class',
      ];

      const hasChanges =
        fieldsToCompare.some(
          (field) =>
            String(editForm[field]).trim() !==
            String(originalForm[field]).trim()
        ) || Boolean(editForm.password);

      if (!hasChanges) {
        setError('No changes detected. Please update at least one field.');
        return;
      }
    }

    setSaving(true);

    try {
      const body = {
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        studentId: editForm.studentId.trim(),
        phone: editForm.phone.trim(),
        class: editForm.class || '',
      };

      if (addOpen) {
        body.password = editForm.password;
        await apiCreateStudent(body);
        setSuccess('Student created successfully.');
      } else {
        if (editForm.password) {
          body.password = editForm.password;
        }

        await apiUpdateStudent(editId, body);
        setSuccess('Student updated successfully.');
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
    try {
      await apiDeleteStudent(deleteId);
      setSuccess('Student deactivated.');
      setDeleteId(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Deactivate failed');
      setDeleteId(null);
    }
  }

  const filtered = students.filter(
    (s) =>
      (!search ||
        (s.studentId &&
          s.studentId.toLowerCase().includes(search.toLowerCase())) ||
        (s.user?.fullName &&
          s.user.fullName.toLowerCase().includes(search.toLowerCase())) ||
        (s.user?.email &&
          s.user.email.toLowerCase().includes(search.toLowerCase()))) &&
      (!classFilter || s.class?._id === classFilter)
  );

  return (
    <div className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-terracotta">Students</h1>
          <p className="text-muted dark:text-sand">
            Manage student accounts and class assignments.
          </p>
        </div>

        <Btn variant="primary" onClick={openAddForm}>
          Add student
        </Btn>
      </div>

      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
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

        <div className="md:col-span-4">
          <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
            Filter by class
          </label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
          >
            <option value="">All classes</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className} ({c.classCode})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 flex items-end">
          <Btn variant="secondary" onClick={loadData} disabled={loading}>
            Refresh
          </Btn>
        </div>
      </div>

      {filtered.length ? (
        <div className="overflow-x-auto">
          <table className="w-full surface border border-sand bg-paper text-sm dark:border-sand/30 dark:bg-bark">
            <thead className="border-b border-sand dark:border-sand/30">
              <tr>
                <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Student</th>
                <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">ID</th>
                <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Email</th>
                <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Class</th>
                <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Status</th>
                <th className="px-5 py-3 font-semibold text-muted dark:text-sand uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sand dark:divide-sand/30">
              {filtered.map((s) => {
                const user = s.user || {};

                return (
                  <tr
                    key={s._id}
                    className="text-charcoal dark:text-cream hover:bg-sand/50 dark:hover:bg-sand/40 transition"
                  >
                    <td className="px-5 py-4 font-medium">{user.fullName || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="border border-sand px-1.5 py-0.5 rounded text-xs text-muted">
                        {s.studentId}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted dark:text-sand">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-muted dark:text-sand">
                      {s.class?.className || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                          s.isActive
                            ? 'bg-sage/20 text-sage dark:text-sage border border-sage/40'
                            : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
                        }`}
                      >
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Btn variant="secondary" size="sm" onClick={() => loadForEdit(s)}>
                        Edit
                      </Btn>
                      <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteId(s._id)}
                      >
                        {s.isActive ? 'Deactivate' : 'Deactivate'}
                      </Btn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No students found." />
      )}

      {(addOpen || editId) && (
        <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
            {addOpen ? 'Add new student' : 'Edit student'}
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

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Password {addOpen ? '*' : ''}
              </label>
              <input
                name="password"
                type="password"
                value={editForm.password}
                onChange={handleFormChange}
                minLength={8}
                required={addOpen}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
                placeholder={
                  addOpen
                    ? 'Required (min 8 chars)'
                    : 'Leave blank to keep current'
                }
              />
              <p className="text-xs text-muted dark:text-sand mt-1">
                {addOpen
                  ? 'Password must contain at least 8 characters.'
                  : 'Only enter a password if you want to change it.'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Student ID *
              </label>
              <input
                name="studentId"
                value={editForm.studentId}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Assign class
              </label>
              <select
                name="class"
                value={editForm.class}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              >
                <option value="">None</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.className} ({c.classCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Btn type="button" variant="secondary" onClick={closeAddEdit}>
                Cancel
              </Btn>
              <Btn type="submit" variant="primary" disabled={saving}>
                {saving
                  ? 'Saving...'
                  : addOpen
                    ? 'Create student'
                    : 'Update student'}
              </Btn>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate student"
        message="This will deactivate the student account. The student will no longer be able to log in."
        confirmLabel="Deactivate"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
