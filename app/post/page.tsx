import Link from "next/link";
import { createEvent } from "../events/actions";

export default function PostEventPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 glass">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold">Lakes Dance</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">← Back</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Post a Dance Event</h1>
        <p className="text-slate-400 mb-8">Share an upcoming social, class, or gathering with the community.</p>
        {searchParams?.message && (
          <p className="mb-4 text-sm text-cyan-400">{searchParams.message}</p>
        )}

        <form action={createEvent} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-slate-300">Event Title</label>
            <input name="title" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Friday Night Social" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-slate-300">Date & Time</label>
              <input name="start_time" type="datetime-local" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-300">Dance Style</label>
              <input name="dance_style" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Ballroom, Line, Swing..." />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Location</label>
            <input name="location" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Venue or address" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Description</label>
            <textarea name="description" rows={4} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Tell people what to expect..." />
          </div>
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-4 rounded-xl font-medium text-lg transition">
            Publish Event
          </button>
        </form>
      </main>
    </div>
  );
}
