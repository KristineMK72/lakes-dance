import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BandsPage() {
  let bands: any[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data } = await supabase
        .from("lakes_bands")
        .select("*")
        .order("created_at", { ascending: false });
      bands = data || [];
    } catch (e) {
      console.error("Bands fetch failed:", e);
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
            <Link href="/bands" className="text-cyan-300">Bands</Link>
            <Link href="/post" className="text-slate-300 hover:text-white transition">Post Event</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text">Bands</h1>
            <p className="text-slate-400 mt-2">Share and discover bands playing around the Lakes</p>
          </div>
          <Link href="/bands/new" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm">Share a Band</Link>
        </div>

        {bands.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-slate-400">
            No bands shared yet. Be the first!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bands.map((b) => (
              <div key={b.id} className="glass rounded-2xl p-6">
                <div className="text-xs text-cyan-400 mb-2">{b.genre || "Band"}</div>
                <h3 className="text-xl font-semibold mb-2">{b.name}</h3>
                <p className="text-slate-400 text-sm">{b.description}</p>
                {b.website && (
                  <a href={b.website} target="_blank" className="text-cyan-400 text-sm mt-3 inline-block hover:underline">Website →</a>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
