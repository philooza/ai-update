import { createClient } from "@supabase/supabase-js";

export type Update = {
  slug: string;
  title: string;
  category: string;
  date: string;
  sourceUrl?: string;
  summary: string;
  keyPoints: string[];
  functionality: string;
  critique: string;
  nextSteps: string[];
};

const seedUpdates: Update[] = [
  {
    slug: "ai-update-launch-note",
    title: "ai-update launch note",
    category: "Project setup",
    date: "2026-05-19",
    summary:
      "Initial public surface for tracking user-provided AI articles, links, videos, and transcripts with structured summaries and critical reviews.",
    keyPoints: [
      "User-provided links and videos can be analyzed and published immediately.",
      "Each entry should capture key points, practical functionality, and a critical assessment.",
      "Cron-discovered candidates stay staged in Discord until approved or training improves.",
    ],
    functionality:
      "A curated log that turns raw AI content into durable structured notes: what happened, what it does, why it matters, and where skepticism is warranted.",
    critique:
      "The value is not another generic news feed; it depends on disciplined filtering, source links, concrete workflow extraction, and direct rejection of hype-only content.",
    nextSteps: [
      "Add the first user-provided article/video as a real entry.",
      "Wire an authenticated ingestion/admin path when editing through the site is needed.",
      "Use Discord staging for automatically discovered candidates.",
    ],
  },
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getUpdates(): Promise<Update[]> {
  const supabase = getSupabase();
  if (!supabase) return seedUpdates;

  const { data, error } = await supabase
    .from("updates")
    .select("slug,title,category,date,source_url,summary,key_points,functionality,critique,next_steps")
    .order("date", { ascending: false });

  if (error || !data?.length) return seedUpdates;

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.date,
    sourceUrl: row.source_url ?? undefined,
    summary: row.summary,
    keyPoints: row.key_points ?? [],
    functionality: row.functionality,
    critique: row.critique,
    nextSteps: row.next_steps ?? [],
  }));
}

export async function getUpdate(slug: string) {
  const updates = await getUpdates();
  return updates.find((update) => update.slug === slug) ?? null;
}
