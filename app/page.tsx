import Link from "next/link";
import { ArrowRight, BadgeCheck, Bot, Clock, FileText, Radar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUpdates } from "@/lib/updates";

const focusAreas = [
  "AI tools and agents",
  "Workflow implementations",
  "Model/product launches",
  "Legal AI and investing angles",
  "Critical reviews, not hype",
];

export default async function Home() {
  const updates = await getUpdates();
  const featured = updates[0];

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-10 md:py-16">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-black">
              AI
            </span>
            ai-update
          </div>
          <div className="hidden items-center gap-4 text-sm text-white/60 md:flex">
            <span>curated log</span>
            <span>•</span>
            <span>summary + critique</span>
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" />
              A running intelligence log for practical AI developments
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
                Track what AI tools actually do — and whether they matter.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/68">
                Send articles, product pages, videos, or transcripts. ai-update turns them into structured entries: key points, functionality extraction, critical review, and practical follow-ups.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="rounded-full bg-cyan-300 px-6 text-black hover:bg-cyan-200">
                <Link href="#updates" className="flex items-center gap-2">
                  View updates <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white">
                <Link href="#workflow">Workflow</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/30">
            <div className="rounded-[1.5rem] border border-cyan-200/15 bg-black/40 p-6">
              <div className="mb-8 flex items-center justify-between text-sm text-white/55">
                <span>latest entry</span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">ready for Vercel</span>
              </div>
              {featured ? (
                <article className="space-y-5">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">{featured.category}</p>
                    <h2 className="text-3xl font-semibold leading-tight">{featured.title}</h2>
                    <p className="text-white/65">{featured.summary}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-white/70">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-white">Functionality</p>
                      {featured.functionality}
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="mb-1 text-white">Critical take</p>
                      {featured.critique}
                    </div>
                  </div>
                  <Link href={`/updates/${featured.slug}`} className="inline-flex items-center gap-2 text-cyan-200 hover:text-cyan-100">
                    Read structured note <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-10 md:grid-cols-4">
          {[
            [FileText, "Capture", "Ingest a user-provided article, link, video, or transcript."],
            [Bot, "Extract", "Pull out key points, concrete functionality, and claimed workflows."],
            [BadgeCheck, "Critique", "Assess novelty, usefulness, risks, and hype-vs-signal."],
            [Radar, "Publish", "Push user-provided analysis straight to the public log."],
          ].map(([Icon, title, body]) => (
            <div key={title as string} className="rounded-3xl border border-white/10 bg-black/20 p-5">
              <Icon className="mb-5 h-6 w-6 text-cyan-200" />
              <h3 className="mb-2 font-semibold">{title as string}</h3>
              <p className="text-sm leading-6 text-white/60">{body as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="updates" className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-7 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-cyan-200/70">running log</p>
            <h2 className="text-3xl font-semibold">Recent AI updates</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/55">
            Cron-discovered candidates are staged in Discord first. User-provided links can be analyzed and published immediately.
          </p>
        </div>
        <div className="grid gap-4">
          {updates.map((update) => (
            <Link key={update.slug} href={`/updates/${update.slug}`} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-200/50 hover:bg-white/[0.07]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                    <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-cyan-100">{update.category}</span>
                    <Clock className="h-3 w-3" />
                    <time>{update.date}</time>
                  </div>
                  <h3 className="text-xl font-semibold group-hover:text-cyan-100">{update.title}</h3>
                  <p className="max-w-3xl text-sm leading-6 text-white/58">{update.summary}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-white/35 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[2rem] border border-white/10 bg-cyan-300 p-8 text-black">
          <h2 className="mb-4 text-3xl font-semibold">Focus filters</h2>
          <div className="flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              <span key={area} className="rounded-full bg-black/10 px-4 py-2 text-sm font-medium">{area}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
