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
    slug: "corey-ganim-hermes-multi-profile-gbrain-architecture",
    title: "Three Hermes agents on one VPS: role profiles, private GBrains, and shared company memory",
    category: "AI agents",
    date: "2026-05-22",
    sourceUrl: "https://x.com/coreyganim/status/2057912862169878718",
    summary:
      "Corey Ganim shared a concrete multi-agent Hermes architecture: one VPS runs a single Hermes install, three role-specific Hermes profiles, four GBrains, and cron-synced company context. The useful pattern is separation of responsibilities without losing shared business context: CFO, Ops, and Content/Marketing agents each get private working memory, while all three read a shared company knowledge brain fed by documents, calls, email, and calendar.",
    keyPoints: [
      "Original source: https://x.com/coreyganim/status/2057912862169878718",
      "Extracted material: full X post text, attached architecture diagram, and author reply context surfaced by X Search. The post describes 4 separate GBrains: 1 shared company knowledge base and 3 private role-specific working memories.",
      "The three Hermes profiles are CFO, Ops, and Marketing/Content. Each profile is treated as a specialist agent rather than a prompt preset inside one shared runtime.",
      "Agent-to-brain mapping: CFO uses Finance Brain + Shared GBrain; Ops uses Ops Brain + Shared GBrain; Content/Marketing uses Content Brain + Shared GBrain.",
      "Shared GBrain inputs: a context repo containing company docs, offers, brand voice, ICPs and team roles; Fathom/call transcripts synced every 2 hours; Gmail synced every 2 hours; and Google Calendar synced daily.",
      "Each Hermes profile owns its own config, .env, SOUL.md, memory, logs, sessions, home directory, Telegram bot, and gateway process, while local wrapper scripts force requests to route into the correct private brain plus the shared brain.",
      "The diagram labels the setup as: 'Hermes Setup: 1 VPS, 3 Profiles, 4 Brains'; top layer '1 VPS — Single Hermes Install'; profile boxes for CFO, Ops, and Content; private brain boxes for Finance, Ops, and Content; and one central 'Shared GBrain — Company Knowledge'.",
      "Corey says the purpose is role separation: each agent stays specialized in a business function while the shared brain keeps all of them aligned on the same company context.",
    ],
    functionality:
      "Implementation-specific recipe: (1) Provision one VPS and install Hermes once. Treat the VPS as the process host, not as one undifferentiated agent. (2) Create one Hermes profile per business role, e.g. cfo, ops, and content. Each profile should have isolated config, .env, SOUL.md/persona, memory files, logs, sessions, home directory, Telegram bot token, and gateway process/port. (3) Create four GBrain stores: shared-company plus finance, ops, and content. The shared store should contain relatively stable company context: docs, offers, brand voice, ICPs, product notes, team roles, policies, and source metadata. Private stores should contain role-specific working memory: finance metrics and assumptions for CFO; operational tasks, vendor/process notes, and personal-assistant context for Ops; content strategy, hooks, drafts, and audience patterns for Content. (4) Add wrapper scripts for each profile so a CFO request always loads/routes Finance Brain + Shared GBrain, Ops routes Ops Brain + Shared GBrain, and Content routes Content Brain + Shared GBrain. The wrapper should set the Hermes profile, GBrain identifiers, environment path, gateway URL/port, and bot token explicitly rather than relying on global defaults. (5) Feed the shared brain with scheduled sync jobs: pull markdown/docs from a context repo; import Fathom or meeting transcripts every 2 hours; ingest Gmail summaries/metadata every 2 hours; and ingest calendar events daily. Each sync should preserve source URL/ID, timestamp, and source type so the agent can cite and delete/update records later. (6) Keep ingestion least-privilege: use read-only Gmail/calendar scopes where possible, summarize before writing durable shared memory, and skip or quarantine prompt-injection-looking source content. (7) Run each profile/gateway as a separate service under systemd or a process manager; verify with health checks, logs, and a test message to each Telegram bot. (8) Add operating rules: shared brain is for company facts, not private role scratchpad; private brains are for role-specific judgments and temporary working context; promotion from private to shared should be intentional. (9) Test cross-agent consistency: ask all three agents the same company-background questions and role-specific questions, then confirm they share baseline facts but diverge appropriately on finance, ops, and content recommendations.",
    critique:
      "This is a strong practical architecture because it solves a real failure mode in agent setups: one giant agent memory tends to blur roles, while totally separate agents drift apart on company facts. The shared-plus-private brain split is the right mental model for business agents. The risk is operational complexity: three profiles means three bots, env files, gateways, logs, sync paths, auth scopes, and failure modes. The biggest design issue is governance, not plumbing. Gmail, calendar, calls, and company docs can contain privileged, confidential, or personal data, so shared memory needs deletion, auditability, source attribution, access boundaries, and prompt-injection filtering. There is also a subtle memory-pollution risk: if meeting transcripts or emails are blindly summarized into the shared brain, stale or low-confidence statements can become 'company knowledge.' The setup is worth it when the roles are actually used often and need different memory; otherwise a simpler single Hermes profile with explicit skills and source folders may be easier to operate.",
    nextSteps: [
      "Create a concrete profile template for this Hermes setup: directory layout, profile names, env var names, gateway ports, Telegram bot mapping, and GBrain IDs.",
      "Build an ingestion policy before syncing Gmail/calendar/calls: read-only scopes, allowed labels/calendars, retention period, redaction rules, and a quarantine path for suspicious text.",
      "Add a shared-vs-private memory promotion rule: private agents can propose durable company facts, but shared brain writes should require source citation and optionally human approval for sensitive categories.",
      "Article idea: 'The Right Multi-Agent Pattern Is Shared Company Memory plus Private Role Memory.' Use Corey’s diagram as the practical example and focus on why role separation beats one giant context bucket.",
      "Article idea: 'Your Agent Org Chart Needs an Information Architecture.' Cover profiles, memories, source routing, cron ingestion, least-privilege sync, and auditability.",
      "X framing: 'The interesting part is not 3 agents; it is the memory topology: private role brains for specialization + shared company brain for alignment. That is the difference between a toy swarm and an operating system for business agents.'",
    ],
  },
  {
    slug: "hermes-agent-memory-guidebook",
    title: "Hermes Agent memory: native notes, provider choices, and graph add-ons",
    category: "AI agents",
    date: "2026-05-23",
    sourceUrl: "https://x.com/ksimback/status/2058262328496554021",
    summary:
      "Kevin Simback’s X Article is a practical map of Hermes Agent memory. The useful breakdown is a three-layer model: native always-visible memory plus searchable session history; optional official MemoryProvider systems for richer recall; and community add-ons such as GBrain or Mnemosyne when you need graph memory, local-first retrieval, or specialized agent coordination.",
    keyPoints: [
      "Original source: https://x.com/ksimback/status/2058262328496554021",
      "Extracted material: X Article titled 'The Hermes Agent Memory Guidebook' plus the article’s linked Hermes Atlas context at hermesatlas.com.",
      "Layer 1 is the default Hermes memory stack: compact markdown notes for durable always-visible facts about the user/system, plus a SQLite session database that can be searched on demand rather than injected into every prompt.",
      "A key correction in the article: the native memory files are not automatically consolidated by code at 80%; the fill gauge and consolidation behavior are prompt/tool discipline, while hard caps force replace/remove if the agent tries to overfill memory.",
      "Layer 2 is the official pluggable MemoryProvider slot. The article emphasizes that you pick one provider at a time, because competing memory-search tools and stores can confuse the agent and make behavior harder to reason about.",
      "The official providers are framed by architectural tradeoff rather than hype: user modeling, fast setup, benchmark recall, local/air-gapped use, filesystem tiers, cheap managed memory, git-like context trees, or high-scale low-latency recall.",
      "Layer 3 is the community layer. Some projects compete as MemoryProvider alternatives; others are additive side systems. GBrain is highlighted as a separate world-fact/knowledge-graph layer, while Mnemosyne is highlighted as a strong local tiered MemoryProvider alternative.",
      "The practical warning signs are latency, higher API cost, contradictory recalls, context budget pressure, and no measurable improvement in work quality after a couple of weeks.",
    ],
    functionality:
      "Implementation-specific takeaway for a Hermes setup: (1) Start with native memory discipline before adding infrastructure. Keep USER.md for stable user preferences and MEMORY.md for durable environment/project facts; do not save stale task progress, PR IDs, or temporary TODOs. (2) Use session_search for episodic recall: prior discussions, decisions, debugging trails, and completed task context that may matter later but should not be injected every turn. (3) Only add a Layer 2 provider when you have a clear failure mode: semantic recall is weak, many agents need shared memory, the native cap is blocking useful personalization, or you need structured profile extraction. (4) Choose one provider based on operating constraints: cloud vs local, latency budget, deletion/audit needs, graph needs, cost, and whether you want opinionated user modeling or factual recall. (5) Treat Layer 3 systems as add-ons for specific gaps: GBrain for people/companies/projects/world facts and markdown-vault knowledge graphs; Mnemosyne or similar for local temporal/tiered recall. (6) Add evaluation before adding memory: define 5–10 recurring questions the agent should answer better, record baseline answers with native memory only, enable the provider, then compare accuracy, citations, latency, cost, and whether the agent can explain what memory influenced its response. (7) Review memory regularly for pollution: duplicates, contradictions, outdated assumptions, sensitive facts, and entries that should be moved from always-visible memory into searchable notes or removed entirely.",
    critique:
      "This is a strong piece because it separates the memory stack into layers and calls out where third-party posts tend to conflate always-visible notes, session archives, MemoryProviders, skills, and external knowledge graphs. The most important product insight is that more memory is not automatically better: memory has latency, cost, context, privacy, and contradiction risks. The article is also useful because it treats provider choice as architecture, not leaderboard shopping. The caveat is that some provider descriptions are necessarily ecosystem/benchmark claims that should be verified against current Hermes docs, installed plugins, and the user’s own workload before changing a production setup. For Ed’s privacy-preserving preference, the default recommendation should remain conservative: maximize native memory discipline and searchable local sessions first; only add cloud memory when a specific need justifies externalizing agent context.",
    nextSteps: [
      "Create a Hermes memory audit checklist: what belongs in USER.md, what belongs in MEMORY.md, what belongs only in session_search, and what should never be stored.",
      "Article idea: 'Agent Memory Is an Architecture Decision, Not a Feature Toggle.' Use the three-layer model to discuss cost, privacy, latency, recall quality, and deletion/audit obligations.",
      "Article idea: 'The Memory Pollution Problem.' Cover contradictory recalls, self-ingestion, stale preferences, prompt-injection residue, and why memory needs review loops.",
      "Build an evaluation harness before installing any Layer 2 provider: recurring questions, expected answers, allowed sources, latency/cost budget, and a weekly pass/fail score.",
      "For this Hermes setup, keep using native memory plus session_search as the default and consider GBrain-style project/world-fact notes only when a dedicated project has enough recurring entities to justify the added layer.",
      "X framing: 'The useful framing is 3 layers: always-visible native notes, searchable session archive/provider memory, and optional graph/world-fact systems. The mistake is treating memory as one bucket. The hard part is curation, not storage.'",
    ],
  },
  {
    slug: "tufte-viz-skill-chart-critique",
    title: "Tufte as an agent skill: chart taste becomes reusable procedure",
    category: "AI agents",
    date: "2026-05-22",
    sourceUrl: "https://x.com/draparente/status/2057937428531568866",
    summary:
      "Angelica Parente shared a small but useful pattern: when Claude's charts were disappointing, she fed it Edward Tufte's The Visual Display of Quantitative Information and had it generate a Claude Code skill. The resulting tufte-viz skill turns visual-design judgment into a reusable workflow for designing, critiquing, and simplifying data visualizations.",
    keyPoints: [
      "Original source: https://x.com/draparente/status/2057937428531568866",
      "Extracted material: the X post text, the linked GitHub Gist skill at https://gist.github.com/aparente/e48c353755958621b3c0004593105a90, and the quoted image of Edward R. Tufte's The Visual Display of Quantitative Information, Second Edition.",
      "The Gist is a working SKILL.md named tufte-viz, with a description that triggers on designing charts, critiquing visualizations, reviewing dashboards, choosing visualization approaches, reducing chartjunk, and improving data-ink ratio.",
      "The skill operationalizes Tufte concepts including data-ink ratio, chartjunk elimination, graphical integrity, lie factor, small multiples, data density, layering and separation, sparklines, and the question 'compared to what?'",
      "For new visualizations, it asks the agent to clarify the comparison, key insight, and audience; select a chart approach; start minimal; and add only marks that earn their ink.",
      "For critiques, it directs the agent to check scales and baselines, calculate lie factor where proportions look suspicious, identify decorative noise, evaluate removable ink, and propose concrete before/after changes.",
      "This is a practical example of using skills for taste transfer: a domain book becomes a compact review rubric and execution checklist that can be invoked repeatedly inside coding/design work.",
    ],
    functionality:
      "Implementation-specific recipe: (1) Create a skill folder such as tufte-viz/ with a SKILL.md file. (2) Put specific trigger language in YAML frontmatter: use when designing new data visualizations, improving existing charts, reviewing dashboards/reports, deciding between visualization approaches, reducing chartjunk, or improving data-ink ratio. (3) Keep the body procedural: first clarify data story, comparison, audience, and desired insight; then select chart type using rules of thumb such as small multiples for repeated comparisons, line charts for time series, tables/sparklines for dense values, and bars/tables instead of pies for part-to-whole. (4) Add a critique workflow: verify graphical integrity, baselines, scales, lie factor, 3D distortion, decorative elements, heavy grids, redundant labels, and color misuse. (5) Put longer Tufte notes in references/tufte-principles.md and references/analytical-design.md so the model loads them only when needed. (6) Add deterministic checks where possible: for generated chart code, inspect axis domains, baseline choices, units, data transforms, label text, color palette, and whether the chart includes source/context. (7) Test the skill against known bad charts and a no-skill baseline; success should mean simpler charts, fewer ornamental marks, clearer comparisons, and explicit rationale for what was removed.",
    critique:
      "This is more valuable than a generic 'make charts better' prompt because it packages an aesthetic and analytical standard as repeatable agent procedure. The strongest lesson is not only Tufte specifically; it is that books, internal style guides, legal playbooks, investment memos, or product-review rubrics can become executable skills with triggers, checklists, references, and validation gates. The limitation is that a short skill cannot fully encode Tufte's judgment: it can over-apply minimalism, miss accessibility needs, or treat data-ink as a universal objective when exploratory, explanatory, or persuasive contexts differ. It also needs examples and before/after tests to avoid becoming a list of slogans. Still, this is a clean demonstration of skills as reusable taste infrastructure: compact enough to trigger often, specific enough to change output quality, and extensible through reference files.",
    nextSteps: [
      "Build a local Hermes/Claude tufte-viz skill from the Gist, but add examples of before/after chart refactors and an accessibility section covering color-blind-safe palettes, contrast, and direct labels.",
      "Create a companion chart-review checklist for generated dashboard PRs: scales, baselines, units, source labels, chart type, data-ink, color purpose, annotation clarity, and whether the comparison is explicit.",
      "Article idea: 'Taste Is Becoming Agent Infrastructure' — use this Tufte example to explain how domain judgment can be packaged as reusable skills rather than repeated prompting.",
      "Article idea: 'Your AI Chart Problem Is a Missing Review Rubric' — argue that model chart quality improves when agents are given critique procedures, not just style adjectives.",
      "X framing: 'The underrated part of skills: you can turn a book or internal taste standard into a reusable agent checklist. Tufte → chart skill is the pattern; legal memo style, diligence rubrics, dashboard QA, and product teardown standards are next.'",
    ],
  },
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
