import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

const [theme, setTheme] = useState(() =>
  localStorage.getItem('hazri-theme') || 'light'
);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('hazri-theme', theme)
  }, [theme])

  function handleToggleTheme() {
    setTheme(current => current === 'dark' ? 'light' : 'dark')
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-sand bg-cream/90 backdrop-blur-xl dark:border-sand/30 dark:bg-charcoal/90">
      <div className="flex items-center justify-between gap-4 px-6 py-3">
        <div>
          <p className="font-display text-xl font-semibold text-charcoal dark:text-cream">
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
          </p>
          <p className="text-xs text-muted dark:text-sand">
            Here's your workspace at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            title="Toggle appearance"
            className="grid h-10 w-10 place-items-center rounded-full border border-sand text-lg text-muted transition hover:border-terracotta hover:bg-terracotta/10 hover:text-terracotta dark:border-sand/40 dark:text-cream"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          <div className="hidden items-center gap-3 border-l border-sand px-4 py-1 dark:border-sand/30 sm:flex">
            <div className="text-right">
              <p className="text-sm font-semibold text-charcoal dark:text-cream">
                {user?.fullName || 'User'}
              </p>
              <p className="text-xs capitalize text-muted dark:text-sand">
                {user?.role || ''}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-sand px-3 py-2 text-sm transition hover:border-terracotta hover:text-terracotta dark:border-sand/40"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
