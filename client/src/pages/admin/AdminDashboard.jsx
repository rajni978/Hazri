
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGetAdminStats } from '../../services/api';
import StatCard from '../../components/StatCard';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';

const managementItems = [
  {
    title: 'Students',
    description: 'View student records and manage student accounts.',
    path: '/admin/students',
    icon: '👥',
    label: 'Manage students',
  },
  {
    title: 'Mentors',
    description: 'Manage mentors and their institutional profiles.',
    path: '/admin/mentors',
    icon: '🎓',
    label: 'Manage mentors',
  },
  {
    title: 'Classes',
    description: 'Organize classes and academic groups.',
    path: '/admin/classes',
    icon: '🏫',
    label: 'Manage classes',
  },
  {
    title: 'Subjects',
    description: 'Manage subjects available in the institution.',
    path: '/admin/subjects',
    icon: '📚',
    label: 'Manage subjects',
  },
  {
    title: 'Assignments',
    description: 'Handle mentor, class and subject assignments.',
    path: '/admin/assignments',
    icon: '📋',
    label: 'Manage assignments',
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetAdminStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message || 'Failed to load statistics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading statistics…" />;
  if (error) return <Alert type="error">{error}</Alert>;

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-terracotta p-7 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium text-white/80">
            ADMINISTRATOR WORKSPACE
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'}!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">
            Here's an overview of your institution. Keep track of students,
            mentors, classes and subjects from one place.
          </p>

          <Link
            to="/admin/students"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-paper px-5 py-3 text-sm font-semibold text-terracotta transition hover:bg-white"
          >
            Manage institution <span>→</span>
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
            Institution overview
          </h2>
          <p className="mt-1 text-sm text-muted dark:text-sand">
            Current statistics across your institution
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Students"
            value={stats?.totalStudents ?? 0}
            subtitle="Registered students"
          />
          <StatCard
            title="Total Mentors"
            value={stats?.totalMentors ?? 0}
            subtitle="Registered mentors"
          />
          <StatCard
            title="Total Classes"
            value={stats?.totalClasses ?? 0}
            subtitle="Available classes"
          />
          <StatCard
            title="Total Subjects"
            value={stats?.totalSubjects ?? 0}
            subtitle="Academic subjects"
          />
        </div>
      </section>

      {/* Management section */}
      <section>
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
              Management workspace
            </h2>
            <p className="mt-1 text-sm text-muted dark:text-sand">
              Access and manage different areas of your institution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {managementItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group flex flex-col justify-between rounded-2xl border border-sand/70 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-lg hover:shadow-terracotta/5 dark:border-white/10 dark:bg-bark"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/10 text-2xl transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>

                  <span className="text-lg text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-sand">
                    ↗
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold text-charcoal dark:text-cream">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted dark:text-sand">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 border-t border-sand/50 pt-4 dark:border-white/10">
                <span className="text-sm font-semibold text-terracotta">
                  {item.label} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}



// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { apiGetAdminStats } from '../../services/api';
// import StatCard from '../../components/StatCard';
// import Alert from '../../components/Alert';
// import Loading from '../../components/Loading';

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     apiGetAdminStats()
//       .then((res) => setStats(res.data))
//       .catch((err) => setError(err.message || 'Failed to load statistics'))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loading message="Loading statistics…" />;
//   if (error) return <Alert type="error">{error}</Alert>;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl text-terracotta">Admin Dashboard</h1>
//           <p className="text-muted dark:text-sand">Welcome, {user?.fullName}. Manage the institution here.</p>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard title="Total Students" value={stats?.totalStudents ?? 0} />
//         <StatCard title="Total Mentors" value={stats?.totalMentors ?? 0} />
//         <StatCard title="Total Classes" value={stats?.totalClasses ?? 0} />
//         <StatCard title="Total Subjects" value={stats?.totalSubjects ?? 0} />
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Students</h3>
//           <Link to="/admin/students" className="inline-block text-sm font-semibold text-terracotta underline">Manage students →</Link>
//         </section>
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Mentors</h3>
//           <Link to="/admin/mentors" className="inline-block text-sm font-semibold text-terracotta underline">Manage mentors →</Link>
//         </section>
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Classes</h3>
//           <Link to="/admin/classes" className="inline-block text-sm font-semibold text-terracotta underline">Manage classes →</Link>
//         </section>
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Subjects</h3>
//           <Link to="/admin/subjects" className="inline-block text-sm font-semibold text-terracotta underline">Manage subjects →</Link>
//         </section>
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Assignments</h3>
//           <Link to="/admin/assignments" className="inline-block text-sm font-semibold text-terracotta underline">Manage assignments →</Link>
//         </section>
//       </div>
//     </div>
//   );
// }
