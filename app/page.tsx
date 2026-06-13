import Link from "next/link";
import { BookOpen, BarChart3, Trophy, Zap, ArrowRight, CheckCircle } from "lucide-react";

const stats = [
  { label: "Learners", value: "10,000+" },
  { label: "Problems", value: "500+" },
  { label: "Study Sheets", value: "10+" },
  { label: "Free to start", value: "100%" },
];

const features = [
  {
    icon: BookOpen,
    title: "Structured Learning Paths",
    description:
      "Sheets organised by topic — OOP, DBMS, System Design, and more. Never wonder what to study next.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Mark questions done, watch your progress bar grow, and stay motivated with clear milestones.",
  },
  {
    icon: Trophy,
    title: "Expert-Curated Content",
    description:
      "Every question and article is hand-picked from top companies and competitive programmers.",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign up free",
    desc: "Create your account in 30 seconds. No credit card, no subscription.",
  },
  {
    step: "02",
    title: "Pick a sheet",
    desc: "Choose a curated study sheet for the topic you want to master.",
  },
  {
    step: "03",
    title: "Track & complete",
    desc: "Work through topics, check off questions, and watch your progress grow.",
  },
];

const faqs = [
  {
    q: "Is PlacedIn free?",
    a: "Yes! All sheets, topics, and questions are completely free. We may offer premium features in future, but the fundamentals will always stay free.",
  },
  {
    q: "How is this different from LeetCode or GeeksForGeeks?",
    a: "We don't just list problems — we organise them into curated learning paths so you know exactly what to study, in what order, for technical interviews.",
  },
  {
    q: "Do I need an account to browse?",
    a: "You can browse all sheets without an account. To track your progress and mark questions complete, signing up is free and takes 30 seconds.",
  },
  {
    q: "What topics are covered?",
    a: "Currently: System Design, OOP, DBMS, Computer Networks, OS, and core programming. New sheets are added regularly.",
  },
  {
    q: "Does it work on mobile?",
    a: "Absolutely. PlacedIn is fully responsive and works great on any device.",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE Intern @ Amazon",
    quote:
      "PlacedIn helped me structure my prep in the last month before my interviews. The progress tracking kept me accountable every day.",
  },
  {
    name: "Rohan Mehta",
    role: "Campus Placed @ Microsoft",
    quote:
      "I tried several platforms but the curated sheets here are genuinely top-notch. Covered everything that showed up in my interviews.",
  },
  {
    name: "Sneha Patel",
    role: "SDE @ Flipkart",
    quote:
      "The DBMS and OS sheets are incredible. I felt 10x more confident in my technical rounds after going through them.",
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-950 via-gray-950 to-violet-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-28 sm:py-36 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
            <Zap size={12} />
            100% Free — no credit card needed
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
            Crack Your Dream{" "}
            <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Placement
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Curated study sheets built by toppers to help you ace technical interviews — structured,
            trackable, and completely free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/sheets"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Explore Sheets <ArrowRight size={16} />
            </Link>
            <Link
              href="/signUp"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              Create free account
            </Link>
          </div>

          {/* Mini proof strip */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
            {["No credit card", "Instant access", "All topics free", "Progress tracking"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-indigo-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-border/60 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything you need to prepare</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            No more scattered resources. One platform, structured paths, real progress tracking.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border p-6 hover:border-indigo-500/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center mb-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                <f.icon size={20} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-muted/30 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Get placed in 3 steps</h2>
            <p className="text-muted-foreground">Simple, structured, and free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-6xl font-black text-indigo-600/15 mb-3 select-none">{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Loved by students everywhere</h2>
          <p className="text-muted-foreground">Join thousands who cracked their interviews with PlacedIn.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border border-border p-6 bg-card">
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">"{t.quote}"</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-muted/30 border-y border-border/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border bg-background overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-sm hover:bg-muted/50 transition-colors select-none list-none">
                  {faq.q}
                  <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-180 shrink-0 text-xs">
                    ▼
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to land your dream job?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join thousands of students who use PlacedIn to prepare for technical interviews —
            structured, free, and built to get you placed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signUp"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
            >
              Get started for free <ArrowRight size={16} />
            </Link>
            <Link
              href="/sheets"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/15 transition-colors"
            >
              Browse sheets
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
