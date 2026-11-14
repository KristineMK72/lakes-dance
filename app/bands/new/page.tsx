import Link from "next/link";
import { createBand } from "../../bands/actions";

export default function NewBandPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 glass">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/bands" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold">Lakes Dance</span>
          </Link>
          <Link href="/bands" className="text-sm text-slate-400 hover:text-white">← Back</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-2">Share a Band</h1>
        <p className="text-slate-400 mb-8">Tell the community about a band playing around the Lakes.</p>

        <form action={createBand} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-slate-300">Band Name</label>
            <input name="name" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Genre</label>
            <input name="genre" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Country, Rock, Jazz..." />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Website</label>
            <input name="website" type="url" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="https://" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Description</label>
            <textarea name="description" rows={4} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          </div>
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-4 rounded-xl font-medium text-lg transition">
            Share Band
          </button>
        </form>
      </main>
    </div>
  );
}
