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
    slug: "perplexity-bumblebee-developer-endpoint-supply-chain-scanner",
    title: "Perplexity Bumblebee: read-only supply-chain exposure scanning for developer laptops",
    category: "AI security",
    date: "2026-05-23",
    sourceUrl: "https://x.com/vaibhavsisinty/status/2058153373740982372",
    summary:
      "Vaibhav Sisinty amplified Perplexity's open-source Bumblebee scanner as a defense for AI-assisted developers. The useful underlying project is narrower and more practical than the viral framing: Bumblebee is a read-only macOS/Linux endpoint inventory collector that scans local package metadata, editor/browser extensions, and supported AI/MCP tool configs, then optionally matches exact package/version exposures from JSON threat-intel catalogs.",
    keyPoints: [
      "Original source: https://x.com/vaibhavsisinty/status/2058153373740982372",
      "Primary source reviewed: Perplexity's quoted post and GitHub repo at https://github.com/perplexityai/bumblebee, especially README.md, SECURITY.md, docs/deployment-macos.md, docs/transport.md, and threat_intel/README.md.",
      "What Bumblebee actually does: it walks on-disk metadata and emits structured NDJSON component records. It does not execute package managers, download packages, fetch threat intelligence at runtime, parse source code, or require elevated privileges for normal user-scoped scans.",
      "Covered ecosystems include npm, pnpm, Yarn, Bun, PyPI, Go modules, RubyGems, Composer/Packagist, MCP JSON host configs, VS Code/Cursor/Windsurf/VSCodium extensions, Chromium-family browser extensions, and Firefox extensions.",
      "The three scan profiles are `baseline` for common global/user package roots and developer tools, `project` for known workspaces such as code/src/Developer/Projects, and `deep` for explicit incident-response roots such as `$HOME`.",
      "Exposure matching is exact `(ecosystem, package/name, version)` matching against a trusted JSON exposure catalog. It is not a behavior detector, antivirus, EDR, exploit scanner, or general malware classifier.",
      "Useful deployment pattern: run recurring baseline/project inventory through cron, launchd, systemd, MDM, or an existing remote-execution tool; use `deep` plus `--exposure-catalog` during a specific supply-chain incident; ship NDJSON to stdout, file/log shipper, or an HTTPS ingest endpoint.",
      "Security posture: Bumblebee is read-only, skips common credential directories and `.env`/`.envrc` files, and MCP config env blocks are parsed for server inventory but not emitted. Still, output can reveal developer tools, project paths, package inventory, usernames, and host metadata, so treat collected NDJSON as sensitive endpoint inventory.",
    ],
    functionality:
      "Step-by-step implementation: (1) Decide the operating mode. For a solo developer, start local-only: install, run selftest, scan to a local file, and inspect findings manually. For a team, decide whether inventory goes to a log shipper, an HTTPS receiver, or an MDM/EDR workflow. (2) Install with Go 1.25+: `go install github.com/perplexityai/bumblebee/cmd/bumblebee@latest`; pin a release such as `@v0.1.1` if reproducibility matters. Verify with `bumblebee version` and `bumblebee selftest`. (3) Preview scan scope before collecting data: `bumblebee roots --profile baseline` and, for projects, `bumblebee roots --profile project --root '$HOME/code' --root '$HOME/Developer'`. Do not start with a broad home scan unless you are responding to a concrete incident. (4) Run a baseline inventory: `bumblebee scan --profile baseline > baseline.ndjson 2> baseline.diag.ndjson`; confirm the output contains `record_type=package` records and a final `record_type=scan_summary` with `status=complete`. (5) Run project inventory over explicit workspaces: `bumblebee scan --profile project --root '$HOME/code' --root '$HOME/Developer' --max-duration 10m > project.ndjson 2> project.diag.ndjson`. Add `--ecosystem npm,pypi,go` if you only care about selected ecosystems. (6) For a known campaign, download or review an exposure catalog, then run: `bumblebee scan --profile deep --root '$HOME' --exposure-catalog ./catalog.json --findings-only --max-duration 10m > findings.ndjson 2> findings.diag.ndjson`. Use the repo's `threat_intel/*.json` catalogs as examples, but review entries against current advisories before production use. (7) For recurring macOS deployment, prefer a per-user LaunchAgent for least privilege. Schedule baseline every ~6 hours with RunAtLoad and project scans daily/12-hourly; only use a root LaunchDaemon with `--all-users` when you intentionally want one process to fan out across all real `/Users/<name>` homes. (8) For teams with a log shipper, use `--output file --output-file /var/log/bumblebee/inventory.ndjson --append` and let Vector/Fluent Bit/Filebeat handle retries. Without a shipper, use HTTPS: `--output http --http-url https://inventory.example.com/v1/ingest --http-auth bearer --http-token-env BUMBLEBEE_TOKEN --http-gzip --device-id-env BUMBLEBEE_DEVICE_ID`. Read tokens from environment variables, not CLI literals. (9) Build the receiver around NDJSON semantics: accept `Content-Type: application/x-ndjson`, durably store whole batches before returning 2xx, verify HMAC before decompression if HMAC auth is enabled, and promote a run to current state only after `scan_summary.status=complete`. (10) Operationalize triage: alert only on `record_type=finding`, link each finding to catalog ID/source, include endpoint/device ID, source_file, project_path, ecosystem, package_name, version, confidence, and evidence, then verify/remediate by updating/removing the affected package, extension, or config and re-running the same scan.",
    critique:
      "What is actually useful: Bumblebee fills a real gap between SBOMs and EDR. SBOMs tell you what shipped; EDR tells you what executed or touched the network; Bumblebee tells you what risky package, extension, or AI-tool config metadata exists right now on developer machines, including messy local state that never made it into production. That is especially relevant as AI coding tools and MCP configs increase the blast radius of a compromised developer endpoint. The limits matter: it only matches known catalogs exactly, so it will not discover unknown malware or prove that a package executed. Its value depends on current, accurate exposure catalogs and disciplined routing of sensitive inventory. The viral post slightly overstates it as a broad safety layer for AI tools; the repo is more precise and therefore more credible: a read-only inventory and exposure-checking primitive that teams can wire into existing incident response and endpoint-management workflows.",
    nextSteps: [
      "Run Bumblebee locally in stdout/file mode first: install, `bumblebee selftest`, `bumblebee roots --profile baseline`, then baseline and project scans to NDJSON files.",
      "Create a small internal exposure-catalog review workflow: every catalog entry must include source, affected ecosystem/package/version, severity, and reviewer/date before being pushed to endpoints.",
      "For any team rollout, classify Bumblebee NDJSON as sensitive endpoint inventory and decide retention, access control, and whether usernames/project paths need hashing or minimization.",
      "Article idea: 'Developer Machines Are the New Supply-Chain Perimeter.' Explain why AI coding agents, MCP configs, package managers, and browser/editor extensions need local exposure inventory.",
      "X framing: 'The useful part of Bumblebee is not magic AI security. It is a read-only way to answer: which dev machines have the exact risky package/extension/config named in this advisory right now?'",
    ],
  },
  {
    slug: "hermes-agent-tips-power-user-commands-fact-check",
    title: "Hermes power-user tips: useful habits, but several commands are not real Hermes CLI",
    category: "AI agents",
    date: "2026-05-23",
    sourceUrl: "https://x.com/hermesagenttips/status/2058210280245453037",
    summary:
      "Hermes Agent Tips posted a beginner/power-user command list and a large infographic of supposed Hermes commands. The useful part is not the literal command list: several headline commands in the post and image do not exist in the installed Hermes CLI. The practical value is the workflow shape: inspect the project before acting, dry-run risky automation, verify auth/config, follow logs, keep reusable starter templates, and use profiles/skills/cron where Hermes actually supports them.",
    keyPoints: [
      "Original source: https://x.com/hermesagenttips/status/2058210280245453037",
      "Extracted material: public X syndication text, X Search full-post summary, attached infographic image, and a local `hermes --help`/subcommand check against the installed Hermes CLI.",
      "The post claims commands such as `hermes catalog --deep`, `hermes run <flow> --dry-run`, `hermes inspect <flow>`, `hermes auth whoami`, and `hermes logs --follow` are useful Hermes commands.",
      "Fact check: in the installed Hermes CLI, `catalog`, `run`, and `inspect` are not top-level commands. `hermes auth whoami` is also not a listed auth subcommand; available auth subcommands are `add`, `list`, `remove`, `reset`, `status`, `logout`, and `spotify`.",
      "Partially true: log following is real but the actual CLI form is `hermes logs -f`, not `hermes logs --follow`. `hermes logs` also supports `errors`, `gateway`, `--lines`, `--level`, `--session`, `--since`, and `--component`.",
      "The attached infographic adds many apparent non-existent or unverified commands around `hermes install`, `hermes catalog`, `hermes flow export/import`, `hermes cache clean`, and `hermes sandbox`. These should be treated as conceptual tips or hallucinated/aspirational commands, not copy-paste instructions.",
      "Real Hermes equivalents for useful parts: use `hermes doctor` for environment health, `hermes config` / `hermes config set` / `hermes config path` / `hermes config env-path` for config, `hermes skills` for reusable procedures, `hermes profile` for isolated agent instances, `hermes cron` for scheduled workflows, `hermes mcp` for MCP servers, and `hermes sessions` for history.",
      "The best non-command advice in the post is to build starter templates for recurring agent types: research, debugging, content, and deployment. In real Hermes, that should usually become skills, skill bundles, project templates, profiles, or cron prompts rather than a vague prompt pasted each time.",
    ],
    functionality:
      "Implementation-specific reading: do not adopt the infographic as a command reference. Instead, convert the useful intentions into real Hermes workflows. (1) Project mapping: use normal repo inspection plus Hermes tools and skills; for codebase surveys, use a codebase-inspection skill or commands like `pygount`, `tree`, and targeted file search rather than non-existent `hermes catalog --deep`. (2) Dry-runs: before destructive work, ask Hermes for a plan, run tests/builds, inspect `git diff`, and use explicit approval gates; for scheduled work, use `hermes cron run <id>` to trigger a job and then verify `hermes cron list`/session output. (3) Flow inspection: if the workflow is a cron job, inspect/edit it with `hermes cron list` and `hermes cron edit`; if it is a skill, inspect it with `hermes skills`; if it is an MCP integration, use `hermes mcp list` and `hermes mcp test <name>`. (4) Auth verification: use `hermes status --all`, `hermes doctor`, `hermes auth status <provider>`, `hermes auth list`, `hermes login --provider <provider>`, or provider-specific health checks instead of `hermes auth whoami`. (5) Logs: use `hermes logs -f`, `hermes logs gateway -n 100`, `hermes logs errors`, or filters like `--since 1h` and `--component cron`. (6) Starter templates: create actual `SKILL.md` files for repeatable research/debug/content/deploy workflows, and consider `hermes bundles` when a project should preload multiple skills. For stronger isolation, use `hermes profile create <name>` and profile-specific config/memory; for recurring monitoring, use `hermes cron create`. (7) Verification habit: for any tip post, run `hermes <command> --help` locally before trusting it, because Hermes is moving quickly and X infographics often mix real features, adjacent tools, and made-up CLI syntax.",
    critique:
      "What is actually useful: the post gets the operating philosophy right but the command surface wrong. The useful ideas are project inventory, safe rehearsal before execution, auth/config verification, log visibility, and packaging repeatable work into templates. Those are exactly the behaviors that make an agent setup maintainable. The weak point is that the post presents several commands as if they are real, and the steampunk infographic appears to be at least partly synthetic or aspirational: `catalog`, `run`, `inspect`, `install`, `flow export/import`, `cache clean`, and `sandbox` do not appear in the installed Hermes top-level CLI checked here. That makes it dangerous as a beginner guide because novices will copy commands that fail and may misunderstand what Hermes actually provides. The best way to use this source is as a checklist of desired capabilities, then map each capability to real Hermes primitives: skills for reusable procedure, profiles for isolation, cron for scheduled execution, MCP for tool integrations, doctor/status/auth for health checks, logs for debugging, and session_search/sessions for history.",
    nextSteps: [
      "Create a real Hermes quick-reference note that replaces each fake/uncertain command with the current CLI equivalent from `hermes --help`.",
      "Build four practical ai-update/Hermes starter skills: research-source-review, systematic-debugging, content-review-publishing, and deployment-verification.",
      "Add a rule for Hermes-related X tips: always fact-check command syntax locally with `hermes <command> --help` before logging as actionable advice.",
      "Article idea: 'AI Tool Infographics Are Becoming Hallucination Vectors.' Use this as an example of a useful workflow idea packaged with inaccurate CLI commands.",
      "X framing: 'Useful idea, bad command reference. The real takeaway is: inspect before acting, dry-run/plan risky work, verify auth, follow logs, and turn repeatable work into skills/profiles/cron jobs. But don’t copy the listed commands without checking `hermes --help`.'",
    ],
  },
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
