
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGetStudentProfile } from '../../services/api';
import StatCard from '../../components/StatCard';
import Alert from '../../components/Alert';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';

const quickLinks = [
  {
    title: 'My Class',
    description: 'View your class information and details.',
    path: '/student/class',
    icon: '🏫',
  },
  {
    title: 'My Subjects',
    description: 'Explore the subjects assigned to your class.',
    path: '/student/subjects',
    icon: '📚',
  },
  {
    title: 'Attendance',
    description: 'Keep track of your attendance records.',
    path: '/student/attendance',
    icon: '📊',
  },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGetStudentProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading message="Loading your dashboard…" />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!profile) return <EmptyState message="Student profile not available." />;

  const subjects = profile.subjects || [];
  const mentors = profile.mentors || [];
  const theClass = profile.class;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-terracotta p-7 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-white/80">
            STUDENT WORKSPACE
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}!
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-6 text-white/85">
            Your learning journey starts here. Stay connected with your class,
            subjects, mentors and attendance.
          </p>

          <Link
            to="/student/class"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-paper px-5 py-3 text-sm font-semibold text-terracotta transition hover:bg-white"
          >
            Explore my class <span>→</span>
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
            My overview
          </h2>
          <p className="mt-1 text-sm text-muted dark:text-sand">
            A quick look at your academic information
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Your Class"
            value={theClass?.className || '—'}
            subtitle={theClass?.classCode || 'Not assigned yet'}
          />
          <StatCard
            title="Subjects"
            value={subjects.length}
            subtitle="Subjects assigned"
          />
          <StatCard
            title="Mentors"
            value={mentors.length}
            subtitle="Assigned mentors"
          />
          <StatCard
            title="Account"
            value={profile.isActive ? 'Active' : 'Inactive'}
            subtitle={profile.user?.email || user?.email || ''}
          />
        </div>
      </section>

      {/* Academic information */}
      <section>
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-charcoal dark:text-cream">
            My academics
          </h2>
          <p className="mt-1 text-sm text-muted dark:text-sand">
            Your class, subjects and mentor information
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* Class information */}
          <div className="rounded-2xl border border-sand/70 bg-paper p-5 dark:border-white/10 dark:bg-bark">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/10 text-xl">
                🏫
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal dark:text-cream">
                  My Class
                </h3>
                <p className="text-xs text-muted dark:text-sand">
                  Class information
                </p>
              </div>
            </div>

            {theClass ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted dark:text-sand">Class name</p>
                  <p className="mt-1 font-medium text-charcoal dark:text-cream">
                    {theClass.className}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted dark:text-sand">Class code</p>
                  <span className="mt-1 inline-flex rounded-lg bg-terracotta/10 px-3 py-1.5 text-xs font-semibold text-terracotta">
                    {theClass.classCode}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-muted dark:text-sand">Academic year</p>
                  <p className="mt-1 text-sm text-charcoal dark:text-cream">
                    {theClass.academicYear || '—'}
                  </p>
                </div>

                <p className="text-sm leading-6 text-muted dark:text-sand">
                  {theClass.description || 'No class description available.'}
                </p>

                <Link
                  to="/student/class"
                  className="inline-flex items-center text-sm font-semibold text-terracotta hover:underline"
                >
                  View class details →
                </Link>
              </div>
            ) : (
              <EmptyState message="You have not been assigned to a class yet." />
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
                    {subjects.length} available
                  </p>
                </div>
              </div>
              <Link
                to="/student/subjects"
                className="text-sm font-semibold text-terracotta hover:underline"
              >
                View →
              </Link>
            </div>

            {subjects.length ? (
              <ul className="space-y-3">
                {subjects.map((s) => (
                  <li
                    key={s._id}
                    className="rounded-xl border border-sand/50 bg-cream/60 p-3 dark:border-white/10 dark:bg-charcoal/40"
                  >
                    <p className="text-sm font-medium text-charcoal dark:text-cream">
                      {s.subjectName}
                    </p>
                    <span className="mt-2 inline-flex rounded-lg bg-terracotta/10 px-2.5 py-1 text-xs font-semibold text-terracotta">
                      {s.subjectCode}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No subjects assigned to your class yet." />
            )}
          </div>

          {/* Mentors */}
          <div className="rounded-2xl border border-sand/70 bg-paper p-5 dark:border-white/10 dark:bg-bark">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta/10 text-xl">
                🎓
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-charcoal dark:text-cream">
                  My Mentors
                </h3>
                <p className="text-xs text-muted dark:text-sand">
                  {mentors.length} assigned
                </p>
              </div>
            </div>

            {mentors.length ? (
              <ul className="space-y-3">
                {mentors.map((m) => (
                  <li
                    key={m._id}
                    className="rounded-xl border border-sand/50 bg-cream/60 p-3 dark:border-white/10 dark:bg-charcoal/40"
                  >
                    <p className="text-sm font-medium text-charcoal dark:text-cream">
                      {m.mentorId}
                    </p>
                    <p className="mt-1 text-xs text-muted dark:text-sand">
                      {m.phone || 'Contact information unavailable'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No mentor assigned to your class yet." />
            )}
          </div>
        </div>
      </section>

      {/* Attendance */}
      <section className="relative overflow-hidden rounded-2xl border border-sand/70 bg-paper p-5 dark:border-white/10 dark:bg-bark">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/10 text-2xl">
              📊
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-charcoal dark:text-cream">
                Attendance
              </h2>
              <p className="mt-1 max-w-lg text-sm text-muted dark:text-sand">
                Attendance records for {theClass ? theClass.className : 'your class'} will appear here once sessions are recorded.
              </p>
            </div>
          </div>

          <Link
            to="/student/attendance"
            className="inline-flex items-center justify-center rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            View attendance <span className="ml-2">→</span>
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
// import { apiGetStudentProfile } from '../../services/api';
// import StatCard from '../../components/StatCard';
// import Alert from '../../components/Alert';
// import Loading from '../../components/Loading';
// import EmptyState from '../../components/EmptyState';

// export default function StudentDashboard() {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     apiGetStudentProfile()
//       .then((res) => setProfile(res.data))
//       .catch((err) => setError(err.message || 'Failed to load profile'))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <Loading message="Loading your dashboard…" />;
//   if (error) return <Alert type="error">{error}</Alert>;
//   if (!profile) return <EmptyState message="Student profile not available." />;

//   const subjects = profile.subjects || [];
//   const mentors = profile.mentors || [];
//   const theClass = profile.class;

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-3xl text-terracotta">Dashboard</h1>
//           <p className="text-muted dark:text-sand">Welcome back, {user?.fullName}.</p>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard title="Your Class" value={theClass ? theClass.className : '—'} subtitle={theClass ? theClass.classCode : 'Not assigned'} />
//         <StatCard title="Subjects" value={subjects.length} />
//         <StatCard title="Mentors" value={mentors.length} />
//         <StatCard title="Account" value={profile.isActive ? 'Active' : 'Inactive'} subtitle={profile.user.email} />
//       </div>

//       <div className="grid gap-6 md:grid-cols-3">
//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Your Class</h3>
//           {theClass ? (
//             <div className="space-y-2">
//               <p className="text-sm text-charcoal dark:text-cream"><strong>Class:</strong> {theClass.className}</p>
//               <p className="text-sm text-charcoal dark:text-cream"><strong>Code:</strong> {theClass.classCode}</p>
//               <p className="text-sm text-charcoal dark:text-cream"><strong>Year:</strong> {theClass.academicYear || '—'}</p>
//               <p className="text-sm text-charcoal dark:text-cream">{theClass.description || 'No description'}</p>
//               <Link to="/student/class" className="mt-3 inline-block text-sm font-semibold text-terracotta underline">View details →</Link>
//             </div>
//           ) : (
//             <EmptyState message="Not assigned to a class yet." />
//           )}
//         </section>

//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Your Subjects</h3>
//           {subjects.length ? (
//             <ul className="space-y-2 text-sm">
//               {subjects.map((s) => (
//                 <li key={s._id} className="border-b border-sand/50 dark:border-sand/30 pb-2 last:border-0">
//                   {s.subjectName} <span className="text-xs border border-sand px-1.5 py-0.5 rounded text-muted"> {s.subjectCode}</span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <EmptyState message="No subjects assigned to your class." />
//           )}
//         </section>

//         <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//           <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Your Mentor(s)</h3>
//           {mentors.length ? (
//             <ul className="space-y-2 text-sm">
//               {mentors.map((m) => (
//                 <li key={m._id} className="border-b border-sand/50 dark:border-sand/30 pb-2 last:border-0">
//                   <p className="text-sm text-charcoal dark:text-cream">{m.mentorId}</p>
//                   <p className="text-xs text-muted dark:text-sand">{m.phone || 'No contact'}</p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <EmptyState message="No mentor assigned to your class." />
//           )}
//         </section>
//       </div>

//       <section className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark">
//         <h3 className="font-display text-lg text-charcoal dark:text-cream mb-3">Attendance</h3>
//         <p className="text-sm text-muted dark:text-sand">
//           Attendance records for {theClass ? theClass.className : 'your class'} will appear here once sessions are recorded.
//         </p>
//         <Link to="/student/attendance" className="mt-3 inline-block text-sm font-semibold text-terracotta underline">View attendance →</Link>
//       </section>
//     </div>
//   );
// }
