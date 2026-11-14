# Lakes Dance

A modern social platform for the Brainerd Lakes area where people can discover, post, and join dance events. Clean dark UI with glassmorphism, local community feel, and a calendar.

## Current Status

- Auth (signup + login) wired to Supabase
- Event posting wired to Supabase
- Homepage pulls live upcoming events
- Calendar UI ready (data hookup next)

## Setup (once)

1. Create a Supabase project (free tier is fine to start)
2. In the SQL Editor, run everything in `supabase/schema.sql`
3. In Vercel → Project Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy (or push any change)

## Tech Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Auth, Postgres, RLS)
- **Vercel** for deployment

---

Built for the Brainerd Lakes dance community.
