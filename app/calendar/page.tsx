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

        <div className="glass rounded-2xl p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 text-center text-xs sm:text-sm text-slate-500">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[80px] sm:min-h-[100px] rounded-xl opacity-30" />
            ))}
            {daysInMonth.map((day) => {
              const dayNum = day.getDate();
              const dayEvents = eventsByDay[dayNum] || [];
              return (
                <div key={dayNum} className={`min-h-[80px] sm:min-h-[100px] rounded-xl p-1.5 sm:p-2 text-xs sm:text-sm bg-slate-900/40 ${dayEvents.length ? "ring-1 ring-cyan-500/40" : ""}`}>
                  <div className="font-medium mb-1">{dayNum}</div>
                  <div className="space-y-1">
                    {dayEvents.map((ev) => {
                      const mapsUrl = ev.location
                        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ev.location)}`
                        : null;
                      const label = (
                        <span className="block text-[10px] leading-tight text-cyan-300 hover:text-cyan-100 truncate" title={`${ev.title}${ev.location ? " — " + ev.location : ""}`}>
                          {ev.title}
                        </span>
                      );
                      return mapsUrl ? (
                        <a key={ev.id} href={mapsUrl} target="_blank" rel="noopener noreferrer">
                          {label}
                        </a>
                      ) : (
                        <div key={ev.id}>{label}</div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">Click any event for driving directions</p>
      </main>
    </div>
  );
}
