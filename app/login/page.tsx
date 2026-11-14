import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-3xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">LD</div>
          <span className="text-xl font-semibold">Lakes Dance</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-slate-400 mb-8">Sign in to post events and connect with the community.</p>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          <input type="password" placeholder="Password" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500" />
          <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-medium transition">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          New here? <Link href="/signup" className="text-cyan-400 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
