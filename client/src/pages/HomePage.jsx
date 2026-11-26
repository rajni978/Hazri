import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const features = [
  {
    number: '01',
    icon: '◷',
    title: 'Simple attendance tracking',
    description: 'Make attendance part of every class session. Students can check in using a short session code.',
  },
  {
    number: '02',
    icon: '▤',
    title: 'Centralised student records',
    description: 'Keep student profiles, class details and subject information organised in one place.',
  },
  {
    number: '03',
    icon: '◫',
    title: 'Mentor workspace',
    description: 'Manage classes, monitor student attendance and keep track of academic activity.',
  },
  {
    number: '04',
    icon: '↗',
    title: 'Clear attendance reports',
    description: 'Review attendance records and make it easier to understand student participation.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Set up your classroom',
    description: 'Mentors organise their classes, students and subjects in one workspace.',
  },
  {
    number: '02',
    title: 'Start a session',
    description: 'A mentor opens an attendance session and shares its unique check-in code.',
  },
  {
    number: '03',
    title: 'Record attendance',
    description: 'Students use the code to mark their attendance for that session.',
  },
  {
    number: '04',
    title: 'Review the records',
    description: 'Attendance information stays organised for mentors and administrators.',
  },
]

const roles = [
  {
    title: 'For Students',
    description: 'Check your attendance, view class information and stay updated with your academic activity.',
    icon: '◎',
  },
  {
    title: 'For Mentors',
    description: 'Manage classes, take attendance and keep track of student participation.',
    icon: '◉',
  },
  {
    title: 'For Administrators',
    description: 'Manage students, mentors, classes and subjects from a central workspace.',
    icon: '▦',
  },
]

function HomePage() {
const [theme, setTheme] = useState(() => {
  return localStorage.getItem('hazri-theme') || 'light';
});


  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('hazri-theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(current => current === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen overflow-hidden bg-cream text-charcoal transition-colors duration-300 dark:bg-charcoal dark:text-cream">

      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-[100] border-b border-sand/60 bg-paper/90 backdrop-blur-xl dark:border-sand/20 dark:bg-bark/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-terracotta font-display text-2xl text-cream shadow-sm">
              H
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold leading-none">Hazri</span>
              <span className="mt-1 block text-[10px] tracking-[0.2em] text-muted dark:text-sand">ATTENDANCE, SIMPLIFIED</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted transition hover:text-terracotta dark:text-sand">Features</a>
            <a href="#how-it-works" className="text-sm text-muted transition hover:text-terracotta dark:text-sand">How it works</a>
            <a href="#roles" className="text-sm text-muted transition hover:text-terracotta dark:text-sand">Who it's for</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title="Toggle appearance"
              className="grid h-10 w-10 place-items-center rounded-full border border-sand/70 text-lg transition hover:border-terracotta hover:bg-terracotta/10 dark:border-sand/30"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>

            <Link to="/login" className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold transition hover:text-terracotta sm:inline-flex">
              Log in
            </Link>
            <Link to="/register" className="rounded-lg bg-terracotta px-4 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              Get started <span className="ml-1">↗</span>
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-[76px]">
        {/* Hero */}
        <section className="relative">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-sand/20 blur-3xl dark:bg-terracotta/10" />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2 lg:px-12 lg:py-32">

            <div className="relative z-10">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sand/70 bg-paper px-4 py-2 text-xs font-semibold tracking-wide text-terracotta dark:border-sand/30 dark:bg-bark">
                <span className="h-2 w-2 rounded-full bg-sage" />
                A smarter way to manage attendance
              </div>

              <h1 className="max-w-2xl font-display text-5xl font-medium leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Every presence has a <span className="italic text-terracotta">story.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-muted dark:text-sand">
                Attendance shouldn't be complicated. Hazri brings students, mentors and administrators together with one simple platform to manage classes and track attendance.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/register" className="rounded-lg bg-terracotta px-7 py-4 text-sm font-semibold text-cream shadow-lg shadow-terracotta/20 transition hover:-translate-y-1 hover:shadow-xl">
                  Create your account <span className="ml-2">→</span>
                </Link>
                <Link to="/login" className="rounded-lg border border-sand px-7 py-4 text-sm font-semibold transition hover:border-terracotta hover:text-terracotta dark:border-sand/40">
                  Sign in to Hazri
                </Link>
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-sand/60 pt-7 text-sm text-muted dark:border-sand/20 dark:text-sand">
                <span className="flex items-center gap-2"><span className="text-terracotta">✓</span> Easy to use</span>
                <span className="flex items-center gap-2"><span className="text-terracotta">✓</span> Role-based access</span>
                <span className="flex items-center gap-2"><span className="text-terracotta">✓</span> Organised records</span>
              </div>
            </div>

            {/* Product preview */}
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-5 rounded-[2rem] bg-sand/20 blur-2xl dark:bg-terracotta/10" />
              <div className="relative rotate-1 rounded-2xl border border-sand/70 bg-paper p-4 shadow-2xl shadow-charcoal/10 transition duration-500 hover:rotate-0 dark:border-sand/20 dark:bg-bark sm:p-6">

                <div className="flex items-center justify-between border-b border-sand/50 pb-5 dark:border-sand/20">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-terracotta font-display text-xl text-cream">H</div>
                    <div>
                      <p className="font-display text-lg font-semibold">Overview</p>
                      <p className="text-xs text-muted dark:text-sand">Your classroom at a glance</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-sage/30 px-3 py-1 text-xs font-semibold text-charcoal">Dashboard</span>
                </div>

                <div className="grid grid-cols-2 gap-3 py-6">
                  <div className="rounded-xl border border-sand/60 bg-cream p-4 dark:border-sand/20 dark:bg-charcoal">
                    <p className="text-xs text-muted dark:text-sand">Students</p>
                    <p className="mt-2 font-display text-3xl">Manage</p>
                    <p className="mt-1 text-xs text-muted dark:text-sand">Student records</p>
                  </div>
                  <div className="rounded-xl border border-sand/60 bg-cream p-4 dark:border-sand/20 dark:bg-charcoal">
                    <p className="text-xs text-muted dark:text-sand">Classes</p>
                    <p className="mt-2 font-display text-3xl">Organise</p>
                    <p className="mt-1 text-xs text-muted dark:text-sand">Class information</p>
                  </div>
                </div>

                <div className="rounded-xl border border-sand/60 p-4 dark:border-sand/20">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Attendance workflow</p>
                    <span className="text-xs text-muted dark:text-sand">Example preview</span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      ['01', 'Create a session', 'Mentor opens a class session'],
                      ['02', 'Share the code', 'Students receive a check-in code'],
                      ['03', 'Review attendance', 'Records are available in the dashboard'],
                    ].map(([number, title, description]) => (
                      <div key={number} className="flex items-center gap-4">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terracotta/10 text-sm font-bold text-terracotta">{number}</span>
                        <div>
                          <p className="text-sm font-semibold">{title}</p>
                          <p className="mt-0.5 text-xs text-muted dark:text-sand">{description}</p>
                        </div>
                        <span className="ml-auto text-terracotta">✓</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-terracotta px-5 py-4 text-cream">
                  <div>
                    <p className="text-xs text-cream/75">One connected workspace</p>
                    <p className="mt-1 font-display text-xl">Made for learning communities.</p>
                  </div>
                  <span className="text-3xl">✳</span>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-5 hidden rounded-xl border border-sand/60 bg-paper px-5 py-4 shadow-xl dark:border-sand/20 dark:bg-bark sm:block">
                <p className="text-xs text-muted dark:text-sand">Designed around people</p>
                <p className="mt-1 font-display text-lg">Students. Mentors. Together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-paper py-24 dark:bg-bark">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">What makes Hazri useful</p>
              <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Everything in its right place.</h2>
              <p className="mt-5 text-lg leading-8 text-muted dark:text-sand">
                Spend less time organising attendance and more time focusing on the learning experience.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(feature => (
                <article key={feature.number} className="group rounded-2xl border border-sand/60 bg-cream p-7 transition duration-300 hover:-translate-y-2 hover:border-terracotta/50 hover:shadow-xl dark:border-sand/20 dark:bg-charcoal">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-terracotta/10 text-2xl text-terracotta">{feature.icon}</span>
                    <span className="text-xs font-semibold tracking-widest text-muted/60 dark:text-sand/50">{feature.number}</span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted dark:text-sand">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Simple by design</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">Four steps. One smoother routine.</h2>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted dark:text-sand">
                From setting up a classroom to reviewing attendance, Hazri keeps the process clear.
              </p>
            </div>

            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index !== steps.length - 1 && (
                    <div className="absolute left-12 top-6 hidden h-px w-[calc(100%-2rem)] bg-sand lg:block" />
                  )}
                  <span className="relative grid h-12 w-12 place-items-center rounded-full border border-terracotta bg-paper font-semibold text-terracotta dark:bg-bark">{step.number}</span>
                  <h3 className="mt-6 font-display text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted dark:text-sand">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="bg-paper py-24 dark:bg-bark">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">One platform, different perspectives</p>
                <h2 className="mt-4 font-display text-4xl sm:text-5xl">Built for everyone in the classroom.</h2>
              </div>
              <p className="max-w-sm leading-7 text-muted dark:text-sand">Each role gets a workspace designed around the tasks they need to complete.</p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {roles.map(role => (
                <article key={role.title} className="rounded-2xl border border-sand/60 bg-cream p-8 dark:border-sand/20 dark:bg-charcoal">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-terracotta text-2xl text-cream">{role.icon}</span>
                  <h3 className="mt-7 font-display text-2xl">{role.title}</h3>
                  <p className="mt-4 min-h-20 text-sm leading-7 text-muted dark:text-sand">{role.description}</p>
                  <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-terracotta transition hover:gap-3">
                    Access your workspace <span>→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-24 sm:px-8 lg:px-12">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-terracotta px-7 py-16 text-center text-cream sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-cream/15" />
            <div className="pointer-events-none absolute -bottom-48 -left-20 h-96 w-96 rounded-full border border-cream/15" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cream/75">A better way to stay organised</p>
              <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-6xl">Make every class count.</h2>
              <p className="mx-auto mt-6 max-w-xl leading-7 text-cream/80">
                Bring your classroom community together with a simpler approach to attendance and academic organisation.
              </p>
              <Link to="/register" className="mt-9 inline-flex rounded-lg bg-cream px-8 py-4 text-sm font-bold text-charcoal transition hover:-translate-y-1 hover:shadow-xl">
                Get started with Hazri <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand/60 bg-paper dark:border-sand/20 dark:bg-bark">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-terracotta font-display text-xl text-cream">H</span>
            <span className="font-display text-xl font-semibold">Hazri</span>
          </Link>
          <p className="text-sm text-muted dark:text-sand">Every presence matters.</p>
          <div className="flex gap-6 text-sm text-muted dark:text-sand">
            <Link to="/login" className="transition hover:text-terracotta">Login</Link>
            <Link to="/register" className="transition hover:text-terracotta">Register</Link>
          </div>
        </div>
        <div className="border-t border-sand/50 px-5 py-5 text-center text-xs text-muted dark:border-sand/20 dark:text-sand">
          © {new Date().getFullYear()} Hazri. Made for learning communities.
        </div>
      </footer>
    </div>
  )
}

export default HomePage
