import Link from "next/link";

export default function CalendarPage() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const sampleEvents: Record<number, string[]> = {
    14: ["Friday Night Social"],
    15: ["Line Dancing Class"],
    16: ["Swing Night"],
  };

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
        <p className="text-slate-400 mb-8">November 2026</p>

        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center text-sm text-slate-500">
            {days.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5;
              const hasEvent = sampleEvents[day];
              return (
                <div key={i} className={`aspect-square rounded-xl p-2 text-sm ${day > 0 && day <= 30 ? "bg-slate-900/40" : "opacity-30"} ${hasEvent ? "ring-1 ring-cyan-500/40" : ""}`}>
                  {day > 0 && day <= 30 && (
                    <>
                      <div className="font-medium">{day}</div>
                      {hasEvent && <div className="text-[10px] text-cyan-400 mt-1 truncate">{hasEvent[0]}</div>}
                    </>
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
