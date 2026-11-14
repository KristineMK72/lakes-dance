import Link from "next/link";
import { updateProfile } from "./actions";

export default async function ProfilePage() {
  let profile: any = null;
  let user: any = null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      user = u;
      if (u) {
        const { data } = await supabase.from("lakes_profiles").select("*").eq("id", u.id).single();
        profile = data;
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Please sign in to view your profile.</p>
          <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
        </div>
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
        <h1 className="text-4xl font-bold mb-8 gradient-text">Your Profile</h1>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-bold overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name?.[0] || "?").toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{profile?.full_name || "Dancer"}</h2>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>

          <form action={updateProfile} encType="multipart/form-data" className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-slate-300">Full Name</label>
              <input name="full_name" defaultValue={profile?.full_name || ""} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-300">Bio</label>
              <textarea name="bio" defaultValue={profile?.bio || ""} rows={3} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" placeholder="Tell the community a little about yourself..." />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-300">Profile Photo</label>
              <input name="avatar_file" type="file" accept="image/*" className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30" />
              <p className="text-xs text-slate-500 mt-1">Or paste an image URL below</p>
              <input name="avatar_url" defaultValue={profile?.avatar_url || ""} className="w-full mt-2 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-medium transition">
              Save Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
