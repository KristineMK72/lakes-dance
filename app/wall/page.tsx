import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { postToWall, deleteWallPost } from "./actions";
import { signOut } from "../auth/actions";

export default async function WallPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("lakes_wall_posts")
    .select("*, author:lakes_profiles!author_id(full_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 glass">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
            <span className="text-xl font-semibold">Lakes Dance</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-300 hover:text-white">Home</Link>
            {user && (
              <form action={signOut}>
                <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  Sign Out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Community Wall</h1>

        {params?.message && (
          <p className="mb-4 text-sm text-cyan-400">{params.message}</p>
        )}

        {user ? (
          <form action={postToWall} encType="multipart/form-data" className="glass rounded-2xl p-6 mb-8 space-y-3">
            <textarea
              name="content"
              placeholder="Share something with the Lakes Dance community..."
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 min-h-[100px]"
              required
            />
            <input
              name="image_file"
              type="file"
              accept="image/*,video/*"
              className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
            />
            <input
              name="image_url"
              type="url"
              placeholder="Or paste an image/video URL"
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm"
            />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2 rounded-full text-sm font-medium">
              Post
            </button>
          </form>
        ) : (
          <div className="glass rounded-2xl p-6 mb-8 text-center">
            <p className="text-slate-400 mb-3">Sign in to post on the wall.</p>
            <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
          </div>
        )}

        <div className="space-y-4">
          {(posts || []).map((post: any) => {
            const isVideo = post.image_url && /\.(mp4|webm|mov)$/i.test(post.image_url);
            const isOwn = user && post.author_id === user.id;
            return (
              <div key={post.id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.author_id}`} className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-sm font-medium overflow-hidden">
                      {post.author?.avatar_url ? (
                        <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        (post.author?.full_name || "D")[0]
                      )}
                    </Link>
                    <div>
                      <Link href={`/profile/${post.author_id}`} className="font-medium hover:text-cyan-300">{post.author?.full_name || "Dancer"}</Link>
                      <div className="text-xs text-slate-400">{format(new Date(post.created_at), "MMM d, h:mm a")}</div>
                    </div>
                  </div>
                  {isOwn && (
                    <form action={deleteWallPost}>
                      <input type="hidden" name="post_id" value={post.id} />
                      <button type="submit" className="text-xs text-slate-500 hover:text-red-400 transition">Delete</button>
                    </form>
                  )}
                </div>
                <p className="text-slate-200">{post.content}</p>
                {post.image_url && (
                  isVideo ? (
                    <video src={post.image_url} controls className="mt-3 rounded-xl max-h-80 w-full" />
                  ) : (
                    <img src={post.image_url} alt="" className="mt-3 rounded-xl max-h-80 object-cover w-full" />
                  )
                )}
              </div>
            );
          })}
          {(!posts || posts.length === 0) && (
            <div className="glass rounded-2xl p-10 text-center text-slate-400">No posts yet. Be the first!</div>
          )}
        </div>
      </main>
    </div>
  );
}
