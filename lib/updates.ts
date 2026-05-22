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

const localUpdates: Update[] = [
  {
    slug: "anthropic-skills-guide-progressive-disclosure",
    title: "Anthropic’s Skills guide: reusable workflows beat static PDFs",
    category: "AI agents",
    date: "2026-05-22",
    sourceUrl: "https://x.com/alive_eth/status/2057306868297425062",
    summary:
      "Ali Yahya criticized Anthropic’s 33-page skills guide for being a static PDF when the material itself argues for reusable, interactive workflow packages. The underlying guide is still useful: it frames skills as portable folders with a SKILL.md file plus optional scripts, references, and assets; the central design pattern is progressive disclosure so the model sees only the trigger metadata by default and loads deeper instructions or files only when needed.",
    keyPoints: [
      "Original source: https://x.com/alive_eth/status/2057306868297425062",
      "Official PDF: https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf",
      "A skill is a folder containing SKILL.md plus optional scripts/, references/, and assets/ directories; SKILL.md is mandatory and includes Markdown instructions with YAML frontmatter.",
      "The most important concept is progressive disclosure: frontmatter is always visible for trigger detection, the SKILL.md body loads only when relevant, and linked files load on demand.",
      "Anthropic’s practical advice is to start with 2–3 concrete use cases, define triggers, workflow steps, required tools or MCP servers, embedded domain knowledge, and success criteria before writing the skill.",
      "The description field is the key lever: it must say both what the skill does and when to use it, with specific phrases, file types, and scope boundaries; vague descriptions cause under-triggering or over-triggering.",
      "The guide recommends testing triggering, functional correctness, and performance versus a no-skill baseline, then iterating based on under-triggering, over-triggering, API failures, and user corrections.",
    ],
    functionality:
      "Implementation-specific recipe: (1) Pick one painful recurring workflow, not a broad knowledge area. (2) Write 2–3 user-facing use cases with trigger phrases and expected outcomes. (3) Create a kebab-case folder with SKILL.md exactly named and YAML frontmatter containing name and description. (4) Make description follow: what it does + when to use it + concrete triggers + file/tool scope; add negative triggers if false positives are likely. (5) Put only core steps in SKILL.md: numbered workflow, validation gates, examples, common errors, and explicit success conditions. (6) Move long docs, API notes, examples, and templates to references/ or assets/ so the skill stays lightweight. (7) Use scripts/ for deterministic checks or transformations instead of asking the model to interpret critical rules in prose. (8) If using MCP, treat MCP as the tool-access layer and the skill as the recipe: order tool calls, pass IDs between services, validate each phase, and define rollback or fallback behavior. (9) Test with obvious trigger prompts, paraphrases, and unrelated prompts; separately test valid outputs, error paths, and tool failures. (10) Compare with baseline: fewer clarifying turns, fewer failed tool calls, lower token use, and more consistent outputs across sessions.",
    critique:
      "Ali’s complaint is directionally right: a guide about interactive workflow packaging is less compelling as a static PDF than as a skill that walks the user through choosing a workflow, drafting frontmatter, validating structure, generating tests, and revising based on failures. The guide’s strongest contribution is not novelty in prompt writing; it is the operational shift from prompts as one-off text to skills as maintainable, testable procedure artifacts. The weak point is that the PDF still leaves the user to manually translate advice into a working skill, exactly the gap skills are meant to close. For product teams, the takeaway is clear: documentation for agentic tools should increasingly ship as executable or semi-executable guidance, with tests, templates, and validation loops, not just pages of prose.",
    nextSteps: [
      "Create an interactive ‘skill-builder’ meta-skill that asks for the workflow, drafts SKILL.md, proposes references/scripts/assets, and generates trigger/functionality test cases.",
      "Article idea: ‘The End of Static Docs for Agentic Products.’ Use this Anthropic example to argue that AI documentation should become executable workflow guidance.",
      "Article idea: ‘Skills Are Prompt Engineering Becoming Software Engineering.’ Cover structure, tests, versioning, progressive disclosure, and deterministic scripts.",
      "Practical checklist: audit existing Hermes/Claude skills for specific descriptions, negative triggers, validation gates, linked references, and test prompts.",
      "X framing: ‘If your product teaches agents reusable workflows, the docs should probably be a workflow too: SKILL.md + tests + references, not just a PDF.’",
    ],
  },
  {
    slug: "garry-tan-gbrain-personal-agent-memory",
    title: "Garry Tan on GBrain: agents need personal attention infrastructure",
    category: "AI agents",
    date: "2026-05-21",
    sourceUrl: "https://x.com/garrytan/status/2057636167525498961",
    summary:
      "Garry Tan amplified Lan Xuezhao’s example of a Hermes + Codex + GBrain setup that uses a daily cron job to process long-form podcasts and press sources, filter promotional noise, identify cross-episode insights, profile overlooked guests, and prioritize what is actually worth listening to. The useful framing is not generic ‘AI summarizes podcasts’; it is personal attention infrastructure: an agent with durable, opinionated memory about a user’s goals, source preferences, prior judgments, and definition of signal.",
    keyPoints: [
      "Original source: https://x.com/garrytan/status/2057636167525498961",
      "Quoted workflow: Hermes Agent + Codex + GBrain + recent/press data used to run a daily cron that filters noisy long-form content and surfaces high-signal learning opportunities.",
      "The strongest product insight is that agents become more useful when they can prioritize attention, not merely summarize content.",
      "Useful memory should be structured and opinionated: goals, trusted sources, ignored sources, projects, prior decisions, and past judgments matter more than a giant undifferentiated vector dump.",
      "The thread points toward specialized memory routing: people, projects, companies, code, emails, source history, and decisions may need separate memory layers rather than one semantic blob.",
      "The professional/legal angle is significant: the more useful personal AI memory becomes, the more sensitive it becomes for privacy, evidence, privilege, governance, deletion, and auditability.",
    ],
    functionality:
      "Implementation-specific reading: build this as a source-to-attention pipeline, not a content summarizer. (1) Define the user’s information diet: trusted sources, watchlist people, excluded/hype-prone sources, and topics of active interest. (2) Schedule ingestion with cron for podcasts, transcripts, X posts, articles, newsletters, and press pages. (3) Extract structured facts: source URL, author/speaker, claims, concrete workflows, named tools, implementation steps, evidence, and open questions. (4) Compare each item against personal memory: have we seen this idea before, does it contradict prior notes, does it affect a current project, and is the person/source becoming more important? (5) Produce a ranked queue with reasons: listen/read now, skim, archive, or ignore. (6) Preserve citations and uncertainty so the agent does not become an opaque recommendation layer. (7) Keep memory curated: store durable source judgments and recurring patterns, not every raw transcript. (8) For public commentary, convert the insight into article ideas, X posts, or replies that add a frame rather than merely agreeing with the original post.",
    critique:
      "This is a high-signal example because it shows an agent improving judgment about attention allocation rather than just compressing content. The risk is that ‘agent with a brain’ can become vague branding unless the memory layer is inspectable, scoped, and maintained. A giant memory dump may increase cost and context bloat without improving decisions. The hard problems are curation, routing, privacy, poisoning, source incentives, stale assumptions, and knowing when old personal context should not influence a new answer. For professional users, the governance issues are not secondary: a useful personal-agent memory may contain strategy, client context, priorities, doubts, and sensitive source patterns. That makes deletion, auditability, local/private options, and approval boundaries central design requirements.",
    nextSteps: [
      "Article idea: ‘The Next AI Moat Is Not the Model. It’s the Memory Around the Person.’ Focus on structured personal memory versus raw context accumulation.",
      "Article idea: ‘Summaries Are the Least Interesting Use of AI Agents.’ Argue that prioritization, novelty detection, and cross-source synthesis are more valuable than compression.",
      "Article idea: ‘Your AI Agent Will Need an Information Diet.’ Explore source hygiene, hype filters, trusted/excluded sources, and the risk of automating exposure to noise.",
      "Legal/professional article idea: ‘Personal AI Memory Is a Privacy Problem Before It Is a Productivity Feature.’ Cover privilege, discovery, deletion, vendor access, and governance.",
      "X framing: ‘The useful part is not AI summarizes podcasts. It is personal attention infrastructure: an agent that knows your goals, source preferences, prior judgments, and current projects can answer what deserves attention and why.’",
      "Reply framing for the original thread: ‘Agree, though I’d frame the key as not just agent + memory but agent + opinionated memory. A useful GBrain should know sources, goals, prior judgments, and what counts as noise.’",
      "Track follow-up theme: specialized memory routing / MoE-style memory for people, projects, sources, decisions, and domain knowledge.",
    ],
  },
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
  if (!supabase) return localUpdates;

  const { data, error } = await supabase
    .from("updates")
    .select("slug,title,category,date,source_url,summary,key_points,functionality,critique,next_steps")
    .order("date", { ascending: false });

  if (error || !data?.length) return localUpdates;

  const remoteUpdates = data.map((row) => ({
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

  const localSlugs = new Set(localUpdates.map((update) => update.slug));

  return [...localUpdates, ...remoteUpdates.filter((update) => !localSlugs.has(update.slug))].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export async function getUpdate(slug: string) {
  const updates = await getUpdates();
  return updates.find((update) => update.slug === slug) ?? null;
}
