
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGetMentorProfile } from '../../services/api';
import StatCard from '../../components/StatCard';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const quickLinks = [
  {
    title: 'My Classes',
    description: 'View the classes assigned to you.',
    path: '/mentor/classes',
    icon: '🏫',
  },
  {
    title: 'My Subjects',
    description: 'View and manage your teaching subjects.',
    path: '/mentor/subjects',
    icon: '📚',
  },
  {
    title: 'My Students',
    description: 'View students across your assigned classes.',
    path: '/mentor/students',
    icon: '👥',
  },
];

export default function MentorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetMentorProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading your dashboard…" />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!profile) return <EmptyState message="Mentor profile not available." />;

  const classes = profile.assignedClasses || [];
  const subjects = profile.assignedSubjects || [];
  const students = profile.students || [];

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-terracotta p-7 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-white/80">
            MENTOR WORKSPACE
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Mentor'}!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">
            Here's your teaching overview. Keep track of your classes, subjects
            and students, all from one place.
          </p>

          <Link
            to="/mentor/classes"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-paper px-5 py-3 text-sm font-semibold text-terracotta transition hover:bg-white"
          >
            View my classes <span>→</span>
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
            Your overview
          </h2>
          <p className="mt-1 text-sm text-muted dark:text-sand">
            Summary of your current teaching responsibilities
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Classes"
            value={classes.length}
            subtitle="Assigned classes"
          />
          <StatCard
            title="Subjects"
            value={subjects.length}
            subtitle="Assigned subjects"
          />
          <StatCard
            title="Students"
            value={students.length}
            subtitle="Across your classes"
          />
          <StatCard
            title="Account"
            value={profile.isActive ? 'Active' : 'Inactive'}
            subtitle={profile.user?.email || user?.email || ''}
          />
        </div>
      </section>

      {/* Classes and subjects */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
            Teaching overview
          </h2>
          <p className="mt-1 text-sm text-muted dark:text-sand">
            Your assigned classes and academic subjects
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Classes */}
          <div className="rounded-2xl border border-sand/70 bg-paper p-5 dark:border-white/10 dark:bg-bark">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/10 text-xl">
                  🏫
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-charcoal dark:text-cream">
                    My Classes
                  </h3>
                  <p className="text-xs text-muted dark:text-sand">
                    {classes.length} assigned
                  </p>
                </div>
              </div>

              <Link
                to="/mentor/classes"
                className="text-sm font-semibold text-terracotta hover:underline"
              >
                View all →
              </Link>
            </div>

            {classes.length ? (
              <ul className="space-y-3">
                {classes.map((c) => (
                  <li
                    key={c._id}
                    className="flex items-center justify-between rounded-xl border border-sand/50 bg-cream/60 p-3 dark:border-white/10 dark:bg-charcoal/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal dark:text-cream">
                        {c.className}
                      </p>
                      <p className="mt-1 text-xs text-muted dark:text-sand">
                        Class code
                      </p>
                    </div>

                    <span className="rounded-lg bg-terracotta/10 px-3 py-1.5 text-xs font-semibold text-terracotta">
                      {c.classCode}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No classes assigned to you." />
            )}
          </div>

          {/* Subjects */}
          <div className="rounded-2xl border border-sand/70 bg-paper p-5 dark:border-white/10 dark:bg-bark">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/10 text-xl">
                  📚
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-charcoal dark:text-cream">
                    My Subjects
                  </h3>
                  <p className="text-xs text-muted dark:text-sand">
                    {subjects.length} assigned
                  </p>
                </div>
              </div>

              <Link
                to="/mentor/subjects"
                className="text-sm font-semibold text-terracotta hover:underline"
              >
                View all →
              </Link>
            </div>

            {subjects.length ? (
              <ul className="space-y-3">
                {subjects.map((s) => (
                  <li
                    key={s._id}
                    className="flex items-center justify-between rounded-xl border border-sand/50 bg-cream/60 p-3 dark:border-white/10 dark:bg-charcoal/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal dark:text-cream">
                        {s.subjectName}
                      </p>
                      <p className="mt-1 text-xs text-muted dark:text-sand">
                        Subject code
                      </p>
                    </div>

                    <span className="rounded-lg bg-terracotta/10 px-3 py-1.5 text-xs font-semibold text-terracotta">
                      {s.subjectCode}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No subjects assigned to you." />
            )}
          </div>
        </div>
      </section>

      {/* Student overview */}
      <section className="rounded-2xl border border-sand/70 bg-paper p-5 dark:border-white/10 dark:bg-bark">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/10 text-2xl">
              👥
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-charcoal dark:text-cream">
                My Students
              </h2>
              <p className="mt-1 text-sm text-muted dark:text-sand">
                {students.length} student(s) across your assigned classes
              </p>
            </div>
          </div>

          <Link
            to="/mentor/students"
            className="inline-flex items-center justify-center rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View students <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Quick navigation */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
            Quick access
          </h2>
          <p className="mt-1 text-sm text-muted dark:text-sand">
            Jump directly to the section you need
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="group rounded-2xl border border-sand/70 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:shadow-lg hover:shadow-terracotta/5 dark:border-white/10 dark:bg-bark"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/10 text-xl transition-transform group-hover:scale-110">
                  {item.icon}
                </div>
                <span className="text-muted transition-transform group-hover:translate-x-1 dark:text-sand">
                  ↗
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold text-charcoal dark:text-cream">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted dark:text-sand">
                {item.description}
              </p>
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
// import { apiGetMentorProfile } from '../../services/api';
// import StatCard from '../../components/StatCard';
// import Alert from '../../components/Alert';
// import Loading from '../../components/Loading';
// import EmptyState from '../../components/EmptyState';

// export default function MentorDashboard() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     apiGetMentorProfile()
//       .then((res) => setProfile(res.data))
//       .catch((err) => setError(err.message || 'Failed to load dashboard'))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loading message="Loading your dashboard…" />;
//   if (error) return <Alert type="error">{error}</Alert>;
//   if (!profile) return <EmptyState message="Mentor profile not available." />;

//   const classes = profile.assignedClasses || [];
//   const subjects = profile.assignedSubjects || [];
//   const students = profile.students || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl text-terracotta">Dashboard</h1>
//           <p className="text-muted dark:text-sand">Welcome back, {user?.fullName}.</p>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard title="Classes" value={classes.length} />
//         <StatCard title="Subjects" value={subjects.length} />
//         <StatCard title="Students" value={students.length} />
//         <StatCard title="Account" value={profile.isActive ? 'Active' : 'Inactive'} subtitle={profile.user.email} />
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">My Classes</h3>
//           {classes.length ? (
//             <>
//             <ul className="space-y-2 text-sm">
//               {classes.map((c) => (
//                 <li key={c._id} className="border-b border-sand/50 dark:border-sand/30 pb-2 last:border-0 flex items-center justify-between">
//                   <span>{c.className}</span>
//                   <span className="text-xs border border-sand px-1.5 py-0.5 rounded text-muted">{c.classCode}</span>
//                 </li>
//               ))}
//             </ul>
//             <Link to="/mentor/classes" className="mt-3 inline-block text-sm font-semibold text-terracotta underline">Manage classes →</Link>
//             </>
//           ) : (
//             <EmptyState message="No classes assigned to you." />
//           )}
//         </section>

//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">My Subjects</h3>
//           {subjects.length ? (
//             <>
//             <ul className="space-y-2 text-sm">
//               {subjects.map((s) => (
//                 <li key={s._id} className="border-b border-sand/50 dark:border-sand/30 pb-2 last:border-0 flex items-center justify-between">
//                   <span>{s.subjectName}</span>
//                   <span className="text-xs border border-sand px-1.5 py-0.5 rounded text-muted">{s.subjectCode}</span>
//                 </li>
//               ))}
//             </ul>
//             <Link to="/mentor/subjects" className="mt-3 inline-block text-sm font-semibold text-terracotta underline">Manage subjects →</Link>
//             </>
//           ) : (
//             <EmptyState message="No subjects assigned to you." />
//           )}
//         </section>

//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">My Students</h3>
//           <p className="text-sm text-charcoal dark:text-cream">{students.length} student(s) across your assigned classes.</p>
//           {students.length ? (
//             <Link to="/mentor/students" className="mt-3 inline-block text-sm font-semibold text-terracotta underline">View students →</Link>
//           ) : (
//             <EmptyState message="No students in your classes." />
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }
