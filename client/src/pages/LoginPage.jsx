
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email, password });

      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Your account has an invalid role.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
          Welcome back
        </h1>

        <p className="mt-2 text-muted dark:text-sand">
          Sign in to continue to your Hazri account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full border border-sand bg-transparent px-4 py-3 outline-none focus:border-terracotta dark:border-sand/40"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-terracotta">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta px-4 py-3 font-semibold text-cream hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted dark:text-sand">
          New student?{' '}
          <Link to="/register" className="font-semibold text-terracotta">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
