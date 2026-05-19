# ai-update

A public running log for practical AI developments.

## Purpose

User-provided articles, links, videos, and transcripts are turned into structured entries:

- original source link on every review
- key points
- functionality extraction
- implementation specifics and actionable instructions
- critical review
- follow-up/watchlist items

User-provided analysis may be published to Vercel immediately. Cron-discovered candidates should be staged in Discord first for approval/training before automatic publishing.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- shadcn/ui
- Supabase Postgres/Auth-ready setup
- Vercel deploy

## Local dev

```bash
npm install
npm run dev
```

## Data

The app reads from Supabase table `updates` when env vars are present, otherwise it falls back to a seed launch note.
