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
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-400">Profile not found.</p>
      </div>
    );
  }

  const { data: posts } = await supabase
    .from("lakes_wall_posts")
    .select("*")
    .eq("author_id", id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="glass rounded-3xl mb-6">
          <div className="h-28 sm:h-36 rounded-t-3xl overflow-hidden bg-gradient-to-r from-cyan-600/40 to-blue-600/40">
            {profile.cover_url && (
              <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="px-5 sm:px-8 pb-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-bold overflow-hidden border-4 border-slate-900 ring-4 ring-slate-900/80 -mt-10 mb-3">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (profile.full_name?.[0] || "?").toUpperCase()
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{profile.full_name || "Dancer"}</h1>
            {profile.bio && <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">{profile.bio}</p>}
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        <div className="space-y-4">
          {(posts || []).map((post: any) => {
            const isVideo = post.image_url && /\.(mp4|webm|mov|m4v)$/i.test(post.image_url);
            return (
              <div key={post.id} className="glass rounded-2xl p-4 sm:p-5">
                <div className="text-xs text-slate-400 mb-2">{format(new Date(post.created_at), "MMM d, yyyy")}</div>
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
          {(!posts || posts.length === 0) && (
            <div className="glass rounded-2xl p-8 text-center text-slate-400 text-sm">No posts yet.</div>
          )}
        </div>
      </main>
    </div>
  );
}
