import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  let events: any[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data } = await supabase
        .from("lakes_events")
        .select("*")
        .gte("start_time", monthStart.toISOString())
        .lte("start_time", monthEnd.toISOString())
        .order("start_time", { ascending: true });
      events = data || [];
    } catch (e) {
      console.error(e);
    }
  }

  const eventsByDay: Record<number, any[]> = {};
  events.forEach((e) => {
    const d = new Date(e.start_time).getDate();
    if (!eventsByDay[d]) eventsByDay[d] = [];
    eventsByDay[d].push(e);
  });

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Calendar</h1>
        <p className="text-slate-400 mb-8">{format(now, "MMMM yyyy")}</p>

        <div className="glass rounded-2xl p-3 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 text-center text-[10px] sm:text-xs text-slate-500">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[90px] sm:min-h-[120px] rounded-lg opacity-20" />
            ))}
            {daysInMonth.map((day) => {
              const dayNum = day.getDate();
              const dayEvents = eventsByDay[dayNum] || [];
              return (
                <div key={dayNum} className={`min-h-[90px] sm:min-h-[120px] rounded-lg p-1.5 sm:p-2 text-xs bg-slate-900/50 ${dayEvents.length ? "ring-1 ring-cyan-500/50" : ""}`}>
                  <div className="font-semibold text-slate-200 mb-1">{dayNum}</div>
                  <div className="space-y-1">
                    {dayEvents.map((ev) => {
                      const mapsUrl = ev.location
                        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ev.location)}`
                        : null;
                      const time = format(new Date(ev.start_time), "h:mm a");
                      const content = (
                        <>
                          <div className="font-medium text-cyan-200 leading-tight">{ev.title}</div>
                          <div className="text-[10px] text-slate-400">{time}</div>
                        </>
                      );
                      return mapsUrl ? (
                        <a
                          key={ev.id}
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-cyan-500/15 hover:bg-cyan-500/25 rounded px-1.5 py-1 transition"
                          title={`${ev.title} — tap for directions`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={ev.id} className="bg-slate-800/60 rounded px-1.5 py-1">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">Tap any event for driving directions</p>
      </main>
    </div>
  );
}
