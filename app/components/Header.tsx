import Link from "next/link";
import { signOut } from "../auth/actions";
import MobileNav from "./MobileNav";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  let user: any = null;
  try {
    const supabase = await createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    user = u;
  } catch {
    user = null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 glass">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
          <span className="text-lg sm:text-xl font-semibold tracking-tight gradient-text">Lakes Dance</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/calendar" className="text-slate-300 hover:text-white">Calendar</Link>
          <Link href="/wall" className="text-slate-300 hover:text-white">Wall</Link>
          <Link href="/bands" className="text-slate-300 hover:text-white">Bands</Link>
          <Link href="/past" className="text-slate-300 hover:text-white">Past</Link>
          <Link href="/post" className="text-slate-300 hover:text-white">Post</Link>
          <Link href="/profile" className="text-slate-300 hover:text-white">Profile</Link>
          {user ? (
            <form action={signOut}>
              <button type="submit" className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Sign Out
              </button>
            </form>
          ) : (
            <Link href="/login" className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-medium">Sign In</Link>
          )}
        </nav>

        <MobileNav signedIn={!!user} />
      </div>
    </header>
  );
}
