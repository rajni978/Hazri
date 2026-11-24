
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerStudent } from '../services/authService';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rollNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      await registerStudent({
        fullName: formData.fullName,
        email: formData.email,
        rollNumber: formData.rollNumber,
        password: formData.password,
      });

      setSuccess('Account created successfully! You can now log in.');
      setFormData({
        fullName: '',
        email: '',
        rollNumber: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-6 py-12">
      <section className="surface w-full max-w-md border border-sand bg-paper p-8 dark:border-sand/30 dark:bg-bark">
        <Link to="/" className="font-display text-2xl text-terracotta">
          Hazri
        </Link>

        <h1 className="mt-8 font-display text-4xl">
          Create your account
        </h1>

        <p className="mt-2 text-muted dark:text-sand">
          Register as a student to access Hazri.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="fullName" className="mb-2 block text-sm font-medium">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder="Enter your full name"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          <div>
            <label htmlFor="rollNumber" className="mb-2 block text-sm font-medium">
              College roll number
            </label>
            <input
              id="rollNumber"
              name="rollNumber"
              type="text"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              placeholder="Enter your roll number"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Enter your password again"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-terracotta">
              {error}
            </p>
          )}

          {success && (
            <div role="status" className="border border-sage bg-sage/20 p-3 text-sm">
              {success}
              <p className="mt-2">
                <Link to="/login" className="font-semibold text-terracotta underline">
                  Go to login
                </Link>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta px-4 py-3 font-semibold text-cream hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted dark:text-sand">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-terracotta">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
