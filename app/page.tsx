import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 glass">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold tracking-tight">Lakes Dance</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/calendar" className="text-slate-300 hover:text-white transition">Calendar</Link>
            <Link href="/post" className="text-slate-300 hover:text-white transition">Post Event</Link>
            <Link href="/login" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-medium transition">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center relative">
          <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4">Brainerd Lakes Area</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Where the Lakes<br />Come to Dance
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Find socials, classes, ballroom nights, line dancing, and community events. Post yours and connect with local dancers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/post" className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-medium text-lg transition shadow-lg shadow-cyan-500/25">
              Post an Event
            </Link>
            <Link href="/calendar" className="glass px-8 py-4 rounded-full font-medium text-lg hover:bg-white/5 transition">
              Browse Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-3xl font-semibold">Upcoming Events</h2>
          <Link href="/calendar" className="text-cyan-400 text-sm hover:underline">View all →</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Friday Night Social", style: "Ballroom", place: "Brainerd", time: "Fri 7:00 PM", tag: "Social" },
            { title: "Beginner Line Dancing", style: "Country", place: "Baxter", time: "Sat 2:00 PM", tag: "Class" },
            { title: "Swing Night", style: "Swing", place: "Nisswa", time: "Sun 6:30 PM", tag: "Social" },
          ].map((e) => (
            <div key={e.title} className="group glass rounded-2xl p-6 hover:border-cyan-500/30 transition border border-transparent">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400">{e.tag}</span>
                <span className="text-xs text-slate-500">{e.style}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-300 transition">{e.title}</h3>
              <p className="text-slate-400 text-sm">{e.place} • {e.time}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
