import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getUpdate, getUpdates } from "@/lib/updates";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const updates = await getUpdates();
  return updates.map((update) => ({ slug: update.slug }));
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = await getUpdate(slug);
  if (!update) notFound();

  return (
    <main className="min-h-screen bg-[#08090d] px-6 py-10 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-200 hover:text-cyan-100">
          <ArrowLeft className="h-4 w-4" /> Back to updates
        </Link>
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 md:p-10">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-200/70">{update.category}</p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">{update.title}</h1>
          <p className="mb-6 text-white/55">{update.date}</p>
          <p className="mb-8 text-lg leading-8 text-white/72">{update.summary}</p>

          {update.sourceUrl ? (
            <section className="mb-8 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-5">
              <p className="mb-2 text-sm font-semibold text-cyan-100">Original source</p>
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex break-all text-sm leading-6 text-cyan-100 underline decoration-cyan-100/40 underline-offset-4 hover:text-cyan-50"
              >
                {update.sourceUrl} <ExternalLink className="ml-2 mt-1 h-4 w-4 shrink-0" />
              </a>
            </section>
          ) : (
            <section className="mb-8 rounded-2xl border border-amber-200/20 bg-amber-300/10 p-5 text-sm text-amber-100">
              Original source link missing — add one before relying on this review.
            </section>
          )}

          <Section title="Key points" items={update.keyPoints} />
          <Block title="Functionality" body={update.functionality} />
          <Block title="Critical review" body={update.critique} />
          <Section title="Follow-ups" items={update.nextSteps} />
        </div>
      </article>
    </main>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <ul className="space-y-3 text-white/68">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4">{item}</li>
        ))}
      </ul>
    </section>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-black/20 p-5">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      <p className="leading-7 text-white/68">{body}</p>
    </section>
  );
}
