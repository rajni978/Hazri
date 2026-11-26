
import { useEffect, useState } from 'react';
import {
  apiListClasses,
  apiCreateClass,
  apiUpdateClass,
  apiDeleteClass,
  apiGetClass,
} from '../../services/api';
import Alert from '../../components/Alert';
import EmptyState from '../../components/EmptyState';
import Btn from '../../components/Btn';
import ConfirmDialog from '../../components/ConfirmDialog';

const INITIAL_FORM = {
  className: '',
  classCode: '',
  description: '',
  academicYear: '',
};

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ ...INITIAL_FORM });
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [view, setView] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await apiListClasses({ q: search || undefined });
      setClasses(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  }

  async function loadView(id) {
    setError('');
    setLoading(true);
    try {
      const res = await apiGetClass(id);
      setView(res.data);
      setViewId(id);
      closeAddEdit();
    } catch (err) {
      setError(err.message || 'Failed to load class details');
    } finally {
      setLoading(false);
    }
  }

  function openAddForm() {
    setEditForm({ ...INITIAL_FORM });
    setEditId(null);
    setAddOpen(true);
    setViewId(null);
    setView(null);
    setError('');
  }

  function loadForEdit(c) {
    setEditForm({
      className: c.className || '',
      classCode: c.classCode || '',
      description: c.description || '',
      academicYear: c.academicYear || '',
    });
    setEditId(c._id);
    setAddOpen(false);
    setViewId(null);
    setView(null);
    setError('');
  }

  function closeAddEdit() {
    setAddOpen(false);
    setEditId(null);
    setEditForm({ ...INITIAL_FORM });
  }

  function closeView() {
    setViewId(null);
    setView(null);
  }

  function handleFormChange(e) {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleAddOrEditSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editForm.className.trim() || !editForm.classCode.trim()) {
      setError('Class name and class code are required.');
      return;
    }

    if (!addOpen && !editId) {
      setError('Please select Add Class or Edit before submitting.');
      return;
    }

    setSaving(true);

    try {
      const body = {
        className: editForm.className.trim(),
        classCode: editForm.classCode.trim(),
        description: editForm.description.trim(),
        academicYear: editForm.academicYear.trim(),
      };

      if (addOpen) {
        await apiCreateClass(body);
        setSuccess('Class created successfully.');
      } else {
        await apiUpdateClass(editId, body);
        setSuccess('Class updated successfully.');
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
      await apiDeleteClass(deleteId);
      setSuccess('Class deactivated.');
      setDeleteId(null);

      if (viewId === deleteId) {
        closeView();
      }

      await loadData();
    } catch (err) {
      setError(err.message || 'Deactivate failed');
      setDeleteId(null);
    }
  }

  const filtered = classes.filter(
    (c) =>
      !search ||
      (c.className || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.classCode || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-terracotta">Classes</h1>
          <p className="text-muted dark:text-sand">
            Manage classes, enrolled students, subjects and mentors.
          </p>
        </div>

        <Btn variant="primary" onClick={openAddForm}>
          Add class
        </Btn>
      </div>

      <div>
        <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
          Search name or code
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
          placeholder="Search..."
        />
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : filtered.length ? (
        <div className="overflow-x-auto">
          <table className="w-full surface border border-sand bg-paper text-sm dark:border-sand/30 dark:bg-bark">
            <thead className="border-b border-sand dark:border-sand/30">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Class</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Code</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Year</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Students</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Mentors</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Subjects</th>
                <th className="px-5 py-3 text-left font-semibold text-muted dark:text-sand uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-sand dark:divide-sand/30">
              {filtered.map((c) => (
                <tr
                  key={c._id}
                  className="text-charcoal dark:text-cream hover:bg-sand/50 dark:hover:bg-sand/40 transition"
                >
                  <td className="px-5 py-4 font-medium">{c.className}</td>
                  <td className="px-5 py-4">{c.classCode}</td>
                  <td className="px-5 py-4">{c.academicYear || '—'}</td>
                  <td className="px-5 py-4">{c.students?.length || 0}</td>
                  <td className="px-5 py-4">{c.mentors?.length || 0}</td>
                  <td className="px-5 py-4">{c.subjects?.length || 0}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Btn variant="secondary" size="sm" onClick={() => loadView(c._id)}>
                      View
                    </Btn>
                    <Btn variant="secondary" size="sm" onClick={() => loadForEdit(c)}>
                      Edit
                    </Btn>
                    {c.isActive && (
                      <Btn variant="danger" size="sm" onClick={() => setDeleteId(c._id)}>
                        Deactivate
                      </Btn>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No classes found." />
      )}

      {view && (
        <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-charcoal dark:text-cream">
              Class details: {view.className}
            </h3>
            <Btn variant="secondary" onClick={closeView}>Back</Btn>
          </div>

          <p className="text-sm text-muted dark:text-sand">
            <strong>Code:</strong> {view.classCode} | <strong>Year:</strong> {view.academicYear || '—'}
          </p>

          <p className="mt-2 text-sm text-charcoal dark:text-cream">
            {view.description || 'No description'}
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="border border-sand p-4 rounded dark:border-sand/30">
              <p className="text-xs font-semibold text-terracotta uppercase mb-2">Enrolled students</p>
              <ul className="text-sm space-y-1">
                {(view.students || []).length
                  ? view.students.map((s) => (
                      <li key={s._id}>{s.studentId} - {(s.user || {}).fullName}</li>
                    ))
                  : <li className="text-muted">None</li>}
              </ul>
            </div>

            <div className="border border-sand p-4 rounded dark:border-sand/30">
              <p className="text-xs font-semibold text-terracotta uppercase mb-2">Assigned mentors</p>
              <ul className="text-sm space-y-1">
                {(view.mentors || []).length
                  ? view.mentors.map((m) => <li key={m._id}>{m.mentorId}</li>)
                  : <li className="text-muted">None</li>}
              </ul>
            </div>

            <div className="border border-sand p-4 rounded dark:border-sand/30">
              <p className="text-xs font-semibold text-terracotta uppercase mb-2">Assigned subjects</p>
              <ul className="text-sm space-y-1">
                {(view.subjects || []).length
                  ? view.subjects.map((s) => (
                      <li key={s._id}>{s.subjectName} ({s.subjectCode})</li>
                    ))
                  : <li className="text-muted">None</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {(addOpen || editId) && (
        <div className="surface border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
          <h3 className="font-display text-lg text-charcoal dark:text-cream mb-4">
            {addOpen ? 'Add new class' : 'Edit class'}
          </h3>

          <form onSubmit={handleAddOrEditSubmit} className="grid gap-4 md:grid-cols-2 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Class name
              </label>
              <input
                name="className"
                value={editForm.className}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Class code
              </label>
              <input
                name="classCode"
                value={editForm.classCode}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Academic year
              </label>
              <input
                name="academicYear"
                value={editForm.academicYear}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-charcoal dark:text-cream mb-1">
                Description
              </label>
              <input
                name="description"
                value={editForm.description}
                onChange={handleFormChange}
                className="w-full border border-sand bg-transparent px-3 py-2 outline-none focus:border-terracotta dark:border-sand/40"
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <Btn type="button" variant="secondary" onClick={closeAddEdit}>
                Cancel
              </Btn>
              <Btn type="submit" variant="primary" disabled={saving}>
                {saving ? 'Saving...' : addOpen ? 'Create class' : 'Update class'}
              </Btn>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deactivate class"
        message="This will deactivate the class. Students and mentors will no longer see it as active."
        confirmLabel="Deactivate"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
