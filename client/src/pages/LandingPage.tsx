import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-full">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-ink text-white">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-sky/25 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-up">
            <p className="font-display text-4xl tracking-tight text-accent-soft sm:text-5xl lg:text-6xl">
              CareerPilot AI
            </p>
            <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
              Interview practice that feels like the real room — with coaching that helps you improve.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Configure a mock interview, answer Gemini-generated questions, get structured feedback,
              and leave with a seven-day study plan tailored to your weak areas.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary px-6 py-3 text-base">
                Start practicing
              </Link>
              <Link
                to="/login"
                className="btn border border-white/20 bg-white/5 px-6 py-3 text-base text-white hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3 animate-fade-up stagger-2">
            {[
              { label: 'Structured mocks', value: 'Technical · HR · Mixed' },
              { label: 'Actionable scoring', value: '0–10 with revision topics' },
              { label: 'Weekly focus', value: 'AI 7-day study plans' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{item.label}</p>
                <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface-2 py-20">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            {
              title: 'Role-aware questions',
              body: 'Frontend, backend, or full-stack tracks with topic and difficulty controls that match campus-to-career prep.',
            },
            {
              title: 'Feedback you can use',
              body: 'See correct points, gaps, an improved answer, and a recommended revision topic after every response.',
            },
            {
              title: 'Progress that sticks',
              body: 'History, topic averages, and study plans keep your preparation organized between practice sessions.',
            },
          ].map((item, i) => (
            <div key={item.title} className={`animate-fade-up stagger-${i + 1}`}>
              <h2 className="font-display text-2xl text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
