import Link from "next/link";
import { format } from "date-fns";
import { rsvp } from "./events/rsvp-actions";
import { saveEvent } from "./events/save-actions";
import { signOut } from "./auth/actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  let events: any[] = [];
  let user: any = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      user = u;

      const { data } = await supabase
        .from("lakes_events")
        .select(`
          *,
          lakes_rsvps(
            user_id,
            status,
            lakes_profiles(full_name, avatar_url)
          )
        `)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true })
        .limit(6);
      events = data || [];
    } catch (e) {
      console.error("Supabase fetch failed:", e);
      events = [];
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 glass">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-lg sm:text-xl font-semibold tracking-tight gradient-text">Lakes Dance</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-x-auto">
            <Link href="/calendar" className="text-slate-300 hover:text-white whitespace-nowrap">Calendar</Link>
            <Link href="/wall" className="text-slate-300 hover:text-white whitespace-nowrap">Wall</Link>
            <Link href="/bands" className="text-slate-300 hover:text-white whitespace-nowrap hidden sm:inline">Bands</Link>
            <Link href="/past" className="text-slate-300 hover:text-white whitespace-nowrap">Past</Link>
            <Link href="/post" className="text-slate-300 hover:text-white whitespace-nowrap">Post</Link>
            <Link href="/profile" className="text-slate-300 hover:text-white whitespace-nowrap">Profile</Link>
            {user ? (
              <form action={signOut}>
                <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                  Sign Out
                </button>
              </form>
            ) : (
              <Link href="/login" className="bg-cyan-500 hover:bg-cyan-400 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">Sign In</Link>
            )}
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-24 pb-12 sm:pb-20 text-center relative">
          <p className="text-cyan-300 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3">Brainerd Lakes Area</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="gradient-text">Where the Lakes</span><br />
            <span className="text-white">Come to Dance</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10">
            Find socials, classes, ballroom nights, line dancing, and community events. Post yours and connect with local dancers.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/post" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg transition shadow-lg shadow-cyan-500/30">
              Post an Event
            </Link>
            <Link href="/calendar" className="glass px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-white/10 transition">
              Browse Calendar
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold gradient-text">Upcoming Events</h2>
          <Link href="/calendar" className="text-cyan-400 text-sm hover:underline">View all →</Link>
        </div>
        {events.length === 0 ? (
          <div className="glass rounded-2xl p-8 sm:p-12 text-center text-slate-400">
            No events yet. Be the first to post one!
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const goingList = (e.lakes_rsvps || []).filter((r: any) => r.status === "going");
              const going = goingList.length;
              const mapsUrl = e.location
                ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(e.location)}`
                : null;
              return (
                <div key={e.id} className="group glass rounded-2xl p-5 sm:p-6 hover:border-cyan-500/40 transition border border-transparent">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300">
                      {e.dance_style || "Event"}
                    </span>
                    <span className="text-xs text-slate-400">{going} going</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-cyan-200 transition">{e.title}</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {e.location} • {format(new Date(e.start_time), "EEE MMM d, h:mm a")}
                  </p>

                  {goingList.length > 0 && (
                    <div className="flex items-center gap-1 mb-4">
                      {goingList.slice(0, 5).map((r: any) => {
                        const p = r.lakes_profiles;
                        const name = p?.full_name || "?";
                        return (
                          <Link
                            key={r.user_id}
                            href={`/profile/${r.user_id}`}
                            className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] font-medium text-cyan-300 overflow-hidden border border-white/10"
                            title={name}
                          >
                            {p?.avatar_url ? (
                              <img src={p.avatar_url} alt={name} className="w-full h-full object-cover" />
                            ) : (
                              name[0].toUpperCase()
                            )}
                          </Link>
                        );
                      })}
                      {goingList.length > 5 && (
                        <span className="text-xs text-slate-500 ml-1">+{goingList.length - 5}</span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <form action={rsvp}>
                      <input type="hidden" name="event_id" value={e.id} />
                      <input type="hidden" name="status" value="going" />
                      <button type="submit" className="text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-3 py-1.5 rounded-full transition">
                        I’m Going
                      </button>
                    </form>
                    <form action={saveEvent}>
                      <input type="hidden" name="event_id" value={e.id} />
                      <button type="submit" className="text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition">
                        Save
                      </button>
                    </form>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition"
                      >
                        Directions
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
