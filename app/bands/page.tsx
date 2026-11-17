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
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Bands</h1>
            <p className="text-slate-400 mt-2">Share and discover bands playing around the Lakes</p>
          </div>
          <Link href="/bands/new" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">Share a Band</Link>
        </div>

        {bands.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-slate-400">
            No bands shared yet. Be the first!
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bands.map((b) => (
              <div key={b.id} className="glass rounded-2xl p-5 sm:p-6">
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
