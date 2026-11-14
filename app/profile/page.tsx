import Link from "next/link";
import { format } from "date-fns";
import { updateProfile } from "./actions";
import { postToWall } from "../wall/actions";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  let profile: any = null;
  let user: any = null;
  let posts: any[] = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      user = u;
      if (u) {
        const { data } = await supabase.from("lakes_profiles").select("*").eq("id", u.id).single();
        profile = data;

        const { data: userPosts } = await supabase
          .from("lakes_wall_posts")
          .select("*")
          .eq("author_id", u.id)
          .order("created_at", { ascending: false })
          .limit(20);
        posts = userPosts || [];
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
        <div className="glass rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
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
              {profile?.bio && <p className="text-slate-300 text-sm mt-1">{profile.bio}</p>}
            </div>
          </div>

          <details className="mb-4">
            <summary className="text-sm text-cyan-400 cursor-pointer">Edit profile</summary>
            <form action={updateProfile} encType="multipart/form-data" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm mb-1 text-slate-300">Full Name</label>
                <input name="full_name" defaultValue={profile?.full_name || ""} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300">Bio</label>
                <textarea name="bio" defaultValue={profile?.bio || ""} rows={2} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-slate-300">Profile Photo</label>
                <input name="avatar_file" type="file" accept="image/*" className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300" />
                <input name="avatar_url" defaultValue={profile?.avatar_url || ""} className="w-full mt-2 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Or paste image URL" />
              </div>
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-medium">Save</button>
            </form>
          </details>
        </div>

        <form action={postToWall} encType="multipart/form-data" className="glass rounded-2xl p-5 mb-8 space-y-3">
          <textarea name="content" placeholder="Share a photo or video from a dance..." className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 min-h-[80px]" required />
          <input name="image_file" type="file" accept="image/*,video/*" className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300" />
          <input name="image_url" type="url" placeholder="Or paste a media URL" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-full text-sm font-medium">Post</button>
        </form>

        <h3 className="text-lg font-semibold mb-4">Your Posts</h3>
        <div className="space-y-4">
          {posts.map((post: any) => {
            const isVideo = post.image_url && /\.(mp4|webm|mov)$/i.test(post.image_url);
            return (
              <div key={post.id} className="glass rounded-2xl p-5">
                <div className="text-xs text-slate-400 mb-2">{format(new Date(post.created_at), "MMM d, yyyy")}</div>
                {post.content && <p className="text-slate-200 mb-3">{post.content}</p>}
                {post.image_url && (
                  isVideo ? (
                    <video src={post.image_url} controls className="w-full rounded-xl max-h-96" />
                  ) : (
                    <img src={post.image_url} alt="" className="w-full rounded-xl max-h-96 object-cover" />
                  )
                )}
              </div>
            );
          })}
          {posts.length === 0 && <div className="glass rounded-2xl p-8 text-center text-slate-400">No posts yet. Share something above!</div>}
        </div>
      </main>
    </div>
  );
}
