import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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

  const { data: posts } = await supabase
    .from("lakes_wall_posts")
    .select("*")
    .eq("author_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

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
        <div className="glass rounded-3xl p-8 text-center mb-8">
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

        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="space-y-4">
          {(posts || []).map((post: any) => {
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
          {(!posts || posts.length === 0) && (
            <div className="glass rounded-2xl p-8 text-center text-slate-400">No posts yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}
