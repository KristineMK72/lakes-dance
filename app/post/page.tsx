import { createEvent } from "../events/actions";

export default async function PostEventPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Post a Dance Event</h1>
        <p className="text-slate-400 mb-8">Share an upcoming social, class, or gathering with the community.</p>
        {params?.message && (
          <p className="mb-4 text-sm text-cyan-400">{params.message}</p>
        )}

        <form action={createEvent} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-slate-300">Event Title</label>
            <input name="title" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Friday Night Social" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-sm mb-2 text-slate-300">Venue / Place Name</label>
            <input name="location" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Eagles Club, Brainerd" />
          </div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Street Address</label>
            <input name="address" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="123 Main St, Brainerd, MN 56401" />
            <p className="text-xs text-slate-500 mt-1">People can click the event for driving directions to this address.</p>
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
