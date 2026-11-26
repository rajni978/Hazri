import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_BY_ROLE = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: '⌂' },
    { to: '/student/profile', label: 'My Profile', icon: '♙' },
    { to: '/student/class', label: 'My Class', icon: '▣' },
    { to: '/student/subjects', label: 'My Subjects', icon: '▤' },
    { to: '/student/attendance', label: 'Attendance', icon: '◷' },
  ],
  mentor: [
    { to: '/mentor/dashboard', label: 'Dashboard', icon: '⌂' },
    { to: '/mentor/profile', label: 'My Profile', icon: '♙' },
    { to: '/mentor/classes', label: 'My Classes', icon: '▣' },
    { to: '/mentor/subjects', label: 'My Subjects', icon: '▤' },
    { to: '/mentor/students', label: 'Students', icon: '♧' },
    { to: '/mentor/attendance', label: 'Attendance', icon: '◷' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '⌂' },
    { to: '/admin/students', label: 'Students', icon: '♧' },
    { to: '/admin/mentors', label: 'Mentors', icon: '♙' },
    { to: '/admin/classes', label: 'Classes', icon: '▣' },
    { to: '/admin/subjects', label: 'Subjects', icon: '▤' },
    { to: '/admin/assignments', label: 'Assignments', icon: '◷' },
  ],
}

export default function Sidebar() {
  const { user } = useAuth()
  const items = NAV_BY_ROLE[user?.role] || []

  return (
    <aside
      className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-sand bg-paper dark:border-sand/30 dark:bg-bark md:block"
      aria-label="Main navigation"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-sand px-5 py-6 dark:border-sand/30">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-terracotta font-display text-xl text-cream">
            H
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-terracotta">Hazri</p>
            <p className="text-[10px] tracking-widest text-muted dark:text-sand">YOUR LEARNING SPACE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted/70 dark:text-sand/60">
            Workspace
          </p>

          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('/dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-terracotta text-cream shadow-sm'
                    : 'text-muted hover:bg-sand/30 hover:text-terracotta dark:text-sand dark:hover:bg-sand/20'
                }`
              }
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sand p-4 dark:border-sand/30">
          <p className="truncate text-sm font-semibold text-charcoal dark:text-cream">
            {user?.fullName || 'User'}
          </p>
          <p className="mt-1 truncate text-xs capitalize text-muted dark:text-sand">
            {user?.role || ''}
          </p>
        </div>
      </div>
    </aside>
  )
}
