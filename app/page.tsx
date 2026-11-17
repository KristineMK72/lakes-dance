import Link from "next/link";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { rsvp } from "./events/rsvp-actions";
import { saveEvent } from "./events/save-actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  let events: any[] = [];

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

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
        .gte("start_time", monthStart.toISOString())
        .lte("start_time", monthEnd.toISOString())
        .order("start_time", { ascending: true });
      events = data || [];
    } catch (e) {
      console.error("Supabase fetch failed:", e);
      events = [];
    }
  }

  const upcoming = events.filter((e) => new Date(e.start_time) >= now).slice(0, 6);
  const eventsByDay: Record<number, any[]> = {};
  events.forEach((e) => {
    const d = new Date(e.start_time).getDate();
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(e);
  });

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/thumbnail.jpg" alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 text-center">
          <p className="text-cyan-300 text-xs sm:text-sm font-medium tracking-widest uppercase mb-3">Brainerd Lakes Area</p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
            <span className="gradient-text">Where the Lakes</span><br />
            <span className="text-white">Come to Dance</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto mb-8 sm:mb-10">
            Find socials, classes, ballroom nights, line dancing, and community events. Post yours and connect with local dancers.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/post" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg transition shadow-lg shadow-cyan-500/30">
              Post an Event
            </Link>
            <Link href="/calendar" className="glass px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg hover:bg-white/10 transition">
              Full Calendar
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold gradient-text">This Month</h2>
          <Link href="/calendar" className="text-cyan-400 text-sm hover:underline">Full view →</Link>
        </div>
        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-[10px] sm:text-xs text-slate-500">
            {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`p-${i}`} className="min-h-[52px] sm:min-h-[70px] rounded-lg opacity-30" />
            ))}
            {daysInMonth.map((day) => {
              const dayNum = day.getDate();
              const dayEvents = eventsByDay[dayNum] || [];
              return (
                <div key={dayNum} className={`min-h-[52px] sm:min-h-[70px] rounded-lg p-1 text-[10px] sm:text-xs bg-slate-900/40 ${dayEvents.length ? "ring-1 ring-cyan-500/40" : ""}`}>
                  <div className="font-medium">{dayNum}</div>
                  {dayEvents.slice(0, 1).map((ev) => (
                    <div key={ev.id} className="text-cyan-300 truncate mt-0.5" title={ev.title}>{ev.title}</div>
                  ))}
                  {dayEvents.length > 1 && <div className="text-slate-500">+{dayEvents.length - 1}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold gradient-text">Upcoming Events</h2>
          <Link href="/calendar" className="text-cyan-400 text-sm hover:underline">View all →</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="glass rounded-2xl p-8 sm:p-12 text-center text-slate-400">
            No events yet. Be the first to post one!
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => {
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
