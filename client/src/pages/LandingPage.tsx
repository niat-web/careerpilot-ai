import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-16 lg:grid-cols-2 lg:items-center lg:pt-24">
          <div className="animate-fade-up">
            <p className="font-display text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
              CareerPilot AI
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Real-time interview practice for students and early-career developers
            </h1>
            <p className="mt-4 max-w-lg text-base text-ink-muted">
              Practice technical, HR, and mixed interviews with Gemini-powered questions,
              instant feedback, and a seven-day study plan tailored to your weak areas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent-dark"
              >
                Start practicing free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-surface"
              >
                Log in
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-accent/20 via-warm/20 to-transparent blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-border bg-ink p-6 text-white shadow-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Live mock interview</p>
              <p className="mt-4 font-display text-2xl leading-snug">
                “Explain how you would secure a REST API used by a React frontend.”
              </p>
              <div className="mt-6 space-y-3 rounded-2xl bg-white/10 p-4 text-sm text-white/90">
                <p>Score: 8.0 / 10 · Good</p>
                <p>Strong on JWT basics · Revise refresh-token rotation</p>
              </div>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-accent px-3 py-1 text-xs">Backend</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Medium</span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Technical</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white/50 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            {
              title: 'Role-based questions',
              body: 'Frontend, backend, or full-stack — pick a topic and difficulty that matches your goals.',
            },
            {
              title: 'Constructive AI feedback',
              body: 'Get scores, missing points, improved answers, and topics to revise after every response.',
            },
            {
              title: 'Seven-day study plans',
              body: 'Turn interview weak spots into a realistic daily preparation schedule.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-xl text-ink">{item.title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
