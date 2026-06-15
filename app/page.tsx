import Image from "next/image";
import Link from "next/link";
import { BookOpen, BarChart3, Trophy, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export default function LandingPage() {
  return (
    <div className="bg-[#09090b] text-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-100 h-75 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-0 text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
            <Zap size={12} className="shrink-0" />
            100% Free — no credit card needed
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-5">
            Crack Your Dream
            <br />
            <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Placement
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Curated study sheets for OOP, DBMS, System Design &amp; more.
            Track your progress, stay focused, and crack technical interviews — completely free.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              href="/sheets"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors text-sm"
            >
              Explore Sheets <ArrowRight size={15} />
            </Link>
            <Link
              href="/signUp"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg border border-white/15 text-white font-semibold hover:bg-white/5 transition-colors text-sm"
            >
              Create free account
            </Link>
          </div>

          {/* Browser-framed hero image */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#09090b] to-transparent z-10 pointer-events-none" />
            <div className="rounded-t-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.15)]">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-white/4 border-b border-white/10">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-xs mx-auto px-3 py-0.5 rounded bg-white/5 border border-white/10 text-gray-500 text-xs text-center">
                    placedin.app/sheets
                  </div>
                </div>
              </div>
              <Image
                src="/hero.png"
                alt="PlacedIn — study sheets dashboard"
                width={1200}
                height={720}
                className="w-full object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-28">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Everything you need to prepare
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            No more scattered resources. One platform, structured paths, real progress tracking.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <Card
              key={f.title}
              className="rounded-2xl border-white/10 bg-white/3 gap-0 py-6 hover:border-indigo-500/40 hover:bg-indigo-500/4 transition-all group"
            >
              <CardContent className="px-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
                  <f.icon size={19} className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-y border-white/5 bg-white/1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Get placed in 3 steps</h2>
            <p className="text-gray-400 text-sm sm:text-base">Simple, structured, and free.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center mx-auto mb-5">
                  <span className="text-indigo-400 font-bold text-sm">{s.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Frequently asked questions
          </h2>
        </div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.q}
              value={`item-${i}`}
              className="rounded-xl border border-white/10 bg-white/2 px-5 overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium text-gray-200 hover:text-white hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-400 leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-950/50 via-[#09090b] to-violet-950/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-28 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to land your dream job?
          </h2>
          <p className="text-gray-400 mb-10 leading-relaxed text-sm sm:text-base max-w-xl mx-auto">
            Structured, free, and built to get you placed. Start learning in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signUp"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors text-sm"
            >
              Get started for free <ArrowRight size={15} />
            </Link>
            <Link
              href="/sheets"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-white/15 text-white font-semibold hover:bg-white/5 transition-colors text-sm"
            >
              Browse sheets
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
