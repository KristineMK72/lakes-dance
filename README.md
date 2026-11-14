# Lakes Dance

A modern social platform for the Brainerd Lakes area where people can discover, post, and join dance events. Clean dark UI with glassmorphism, local community feel, and a calendar.

## Current Pages

- `/` — Hero + upcoming events feed
- `/calendar` — Visual calendar with event highlights
- `/post` — Post a new dance event
- `/login` & `/signup` — Auth screens (UI ready; Supabase wiring next)

## Tech Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Auth, Postgres, RLS) — schema ready in `supabase/schema.sql`
- **Vercel** for deployment

## Getting Started

1. Clone the repo
2. Create a free project at [supabase.com](https://supabase.com)
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase URL + anon key
4. Run the SQL in `supabase/schema.sql` in the Supabase SQL editor
5. `npm install && npm run dev`

---

Built for the Brainerd Lakes dance community.
