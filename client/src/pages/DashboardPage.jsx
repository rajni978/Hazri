
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const roleNames = {
    student: 'Student Dashboard',
    mentor: 'Mentor Dashboard',
    admin: 'Admin Dashboard',
  };

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-sand pb-5">
          <h1 className="font-display text-3xl text-terracotta">
            Hazri
          </h1>

          <button
            onClick={handleLogout}
            className="border border-sand px-4 py-2 text-sm hover:border-terracotta"
          >
            Logout
          </button>
        </header>

        <section className="mt-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">
            {user.role} account
          </p>

          <h2 className="mt-3 font-display text-4xl">
            Welcome, {user.fullName}!
          </h2>

          <p className="mt-3 text-muted dark:text-sand">
            You are logged in successfully.
          </p>

          <div className="surface mt-8 border border-sand bg-paper p-6 dark:border-sand/30 dark:bg-bark">
            <h3 className="font-display text-2xl">
              {roleNames[user.role]}
            </h3>

            <p className="mt-3 text-muted dark:text-sand">
              Your dashboard is being developed. Your account authentication is working.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
