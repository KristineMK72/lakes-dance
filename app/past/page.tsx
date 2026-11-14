import Link from "next/link";
import { format } from "date-fns";
import { uploadEventPhoto } from "./actions";
import { createClient } from "@/lib/supabase/server";

export default async function PastEventsPage() {
  let pastEvents: any[] = [];
  let user: any = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      user = u;

      const { data } = await supabase
        .from("lakes_events")
        .select("*, lakes_event_photos(*)")
        .lt("start_time", new Date().toISOString())
        .order("start_time", { ascending: false })
        .limit(20);
      pastEvents = data || [];
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 glass">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold tracking-tight gradient-text">Lakes Dance</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/calendar" className="text-slate-300 hover:text-white transition">Calendar</Link>
            <Link href="/wall" className="text-slate-300 hover:text-white transition">Wall</Link>
            <Link href="/past" className="text-cyan-300">Past Events</Link>
            <Link href="/profile" className="text-slate-300 hover:text-white transition">Profile</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold gradient-text mb-2">Past Events</h1>
        <p className="text-slate-400 mb-10">Photos and memories from previous dances</p>

        {pastEvents.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-slate-400">
            No past events yet. Check back after the next dance!
          </div>
        ) : (
          <div className="space-y-12">
            {pastEvents.map((event) => (
              <div key={event.id}>
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">{event.title}</h2>
                  <p className="text-slate-400 text-sm">
                    {format(new Date(event.start_time), "MMMM d, yyyy")} • {event.location}
                  </p>
                </div>

                {user && (
                  <form action={uploadEventPhoto} encType="multipart/form-data" className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <input type="hidden" name="event_id" value={event.id} />
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs text-slate-400 mb-1">Add a photo</label>
                      <input name="photo" type="file" accept="image/*" required className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-cyan-500/20 file:text-cyan-300" />
                    </div>
                    <div className="flex-1 min-w-[160px]">
                      <label className="block text-xs text-slate-400 mb-1">Caption (optional)</label>
                      <input name="caption" type="text" placeholder="Great night!" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-cyan-500" />
                    </div>
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Share
                    </button>
                  </form>
                )}

                {event.lakes_event_photos && event.lakes_event_photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {event.lakes_event_photos.map((photo: any) => (
                      <div key={photo.id} className="aspect-square rounded-xl overflow-hidden glass">
                        <img src={photo.photo_url} alt={photo.caption || "Event photo"} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No photos yet for this event.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
