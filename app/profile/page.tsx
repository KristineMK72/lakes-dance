import Link from "next/link";
import { format } from "date-fns";
import { updateProfile } from "./actions";
import { postToWall, deleteWallPost } from "../wall/actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
          .limit(30);
        posts = userPosts || [];
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Please sign in to view your wall.</p>
          <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-lg sm:text-xl font-semibold">Lakes Dance</span>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white">Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="glass rounded-3xl p-5 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-4 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-bold overflow-hidden flex-shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                (profile?.full_name?.[0] || "?").toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold">{profile?.full_name || "Your Wall"}</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
              {profile?.bio && <p className="text-slate-300 text-sm mt-2">{profile.bio}</p>}
            </div>
          </div>

          <details className="mb-2">
            <summary className="text-sm text-cyan-400 cursor-pointer">Edit profile</summary>
            <form action={updateProfile} encType="multipart/form-data" className="space-y-3 mt-3">
              <input name="full_name" defaultValue={profile?.full_name || ""} placeholder="Full name" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
              <textarea name="bio" defaultValue={profile?.bio || ""} rows={2} placeholder="Bio" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
              <input name="avatar_file" type="file" accept="image/*" className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300" />
              <input name="avatar_url" defaultValue={profile?.avatar_url || ""} placeholder="Or paste image URL" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-medium">Save</button>
            </form>
          </details>
        </div>

        <form action={postToWall} encType="multipart/form-data" className="glass rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
          <textarea name="content" placeholder="What's happening at the dance?" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 min-h-[80px]" required />
          <div>
            <label className="block text-xs text-slate-400 mb-1">Add a photo or video</label>
            <input name="image_file" type="file" accept="image/*,video/*" className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-cyan-500/20 file:text-cyan-300" />
          </div>
          <input name="image_url" type="url" placeholder="Or paste a photo/video URL" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500" />
          <button type="submit" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-full text-sm font-medium">Post to your wall</button>
        </form>

        <h2 className="text-lg font-semibold mb-4">Your Wall</h2>
        <div className="space-y-4">
          {posts.map((post: any) => {
            const isVideo = post.image_url && /\.(mp4|webm|mov|m4v)$/i.test(post.image_url);
            return (
              <div key={post.id} className="glass rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-slate-400">{format(new Date(post.created_at), "MMM d, yyyy")}</div>
                  <form action={deleteWallPost}>
                    <input type="hidden" name="post_id" value={post.id} />
                    <button type="submit" className="text-xs text-slate-500 hover:text-red-400">Delete</button>
                  </form>
                </div>
                {post.content && <p className="text-slate-200 mb-3 text-sm sm:text-base">{post.content}</p>}
                {post.image_url && (
                  isVideo ? (
                    <video src={post.image_url} controls playsInline className="w-full rounded-xl max-h-[70vh]" />
                  ) : (
                    <img src={post.image_url} alt="" className="w-full rounded-xl max-h-[70vh] object-cover" />
                  )
                )}
              </div>
            );
          })}
          {posts.length === 0 && <div className="glass rounded-2xl p-8 text-center text-slate-400 text-sm">No posts yet. Share a photo or video above!</div>}
        </div>
      </main>
    </div>
  );
}
