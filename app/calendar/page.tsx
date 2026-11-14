import Link from "next/link";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";

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
      <header className="border-b border-white/10 glass">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold">Lakes Dance</span>
          </Link>
          <Link href="/post" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm">Post Event</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">Calendar</h1>
        <p className="text-slate-400 mb-8">{format(now, "MMMM yyyy")}</p>

        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm text-slate-500">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square rounded-xl opacity-30" />
            ))}
            {daysInMonth.map((day) => {
              const dayNum = day.getDate();
              const dayEvents = eventsByDay[dayNum] || [];
              return (
                <div key={dayNum} className={`aspect-square rounded-xl p-2 text-sm bg-slate-900/40 ${dayEvents.length ? "ring-1 ring-cyan-500/40" : ""}`}>
                  <div className="font-medium">{dayNum}</div>
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div key={ev.id} className="text-[10px] text-cyan-400 mt-1 truncate" title={ev.title}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-slate-500">+{dayEvents.length - 2}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
