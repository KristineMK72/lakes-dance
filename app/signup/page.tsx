import Link from "next/link";
import { signup } from "../auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-3xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
          <span className="text-xl font-semibold">Lakes Dance</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Join the community</h1>
        <p className="text-slate-400 mb-8">Create an account to post events and stay in the loop.</p>
        {params?.message && (
          <p className="mb-4 text-sm text-cyan-400">{params.message}</p>
        )}
        <form action={signup} className="space-y-4">
          <input name="full_name" type="text" placeholder="Full name" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          <input name="email" type="email" placeholder="Email" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          <input name="password" type="password" placeholder="Password" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-medium transition">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account? <Link href="/login" className="text-cyan-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
