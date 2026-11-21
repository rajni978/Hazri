import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const roles = [
  {
    name: 'Student',
    text: 'See your class, join an open session, and check in with the short code your mentor shows.',
  },
  {
    name: 'Mentor',
    text: 'Open a session, watch the roster, correct a record with a reason, and export the sheet.',
  },
  {
    name: 'Admin',
    text: 'Keep student and mentor accounts, classes, subjects, and enrollments in order.',
  },
]

function App() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  const [health, setHealth] = useState({ state: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadHealth() {
      try {
        const response = await fetch(`${API_URL}/api/health`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`The API replied with HTTP ${response.status}.`)
        }
        const data = await response.json()
        setHealth({ state: 'ok', data })
      } catch (error) {
        if (error.name === 'AbortError') return
        setHealth({
          state: 'error',
          message: 'The API is not reachable. Start the server, then refresh this page.',
        })
      }
    }

    loadHealth()
    return () => controller.abort()
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    document.documentElement.style.colorScheme = next
    localStorage.setItem('hazri-theme', next)
    setTheme(next)
  }

  return (
    <div className="min-h-screen">
      <header className="surface border-b border-sand/80 dark:border-sand/30">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center bg-terracotta font-display text-lg text-cream">
              H
            </span>
            <div>
              <p className="font-display text-2xl leading-none">Hazri</p>
              <p className="mt-1 text-sm text-muted dark:text-sand">Every presence matters.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            className="surface border border-sand px-3 py-2 text-sm text-charcoal hover:border-terracotta hover:text-terracotta dark:border-sand/40 dark:text-cream dark:hover:border-sand"
          >
            {theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-14">
        <p className="text-sm font-semibold tracking-[0.14em] text-terracotta uppercase">
          Campus attendance
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-5xl leading-[1.05] text-balance">
          A clear record of who was in the room.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted dark:text-sand">
          Classes run from morning until evening, and each session needs its own
          attendance. This page is the project shell. Accounts, sessions, and
          check-in are not built yet.
        </p>

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Roles">
          {roles.map((role) => (
            <article
              key={role.name}
              className="surface border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl">{role.name}</h2>
                <span className="bg-sage/40 px-2 py-0.5 text-xs font-semibold tracking-wide text-charcoal uppercase">
                  Planned
                </span>
              </div>
              <p className="mt-3 leading-relaxed text-muted dark:text-sand">{role.text}</p>
            </article>
          ))}
        </section>

        <section
          className="surface mt-10 border border-sand bg-paper p-5 dark:border-sand/30 dark:bg-bark"
          aria-live="polite"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl">API status</h2>
            <p className="text-sm text-muted dark:text-sand">GET /api/health</p>
          </div>
          <HealthDetails health={health} />
        </section>
      </main>
    </div>
  )
}

function HealthDetails({ health }) {
  if (health.state === 'loading') {
    return <p className="mt-3 text-muted dark:text-sand">Checking the API…</p>
  }

  if (health.state === 'error') {
    return <p className="mt-3 text-terracotta">{health.message}</p>
  }

  return (
    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
      <div>
        <dt className="text-muted dark:text-sand">Service</dt>
        <dd className="mt-1 font-semibold">{health.data.service}</dd>
      </div>
      <div>
        <dt className="text-muted dark:text-sand">Database</dt>
        <dd className="mt-1 font-semibold">{health.data.database}</dd>
      </div>
      <div>
        <dt className="text-muted dark:text-sand">Server time</dt>
        <dd className="mt-1 font-semibold">{health.data.time}</dd>
      </div>
    </dl>
  )
}

export default App
