import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("lakes_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 glass">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold">Lakes Dance</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">← Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold overflow-hidden mb-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              (profile.full_name?.[0] || "?").toUpperCase()
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{profile.full_name || "Dancer"}</h1>
          {profile.bio && <p className="text-slate-300 max-w-md mx-auto">{profile.bio}</p>}
        </div>
      </main>
    </div>
  );
}
