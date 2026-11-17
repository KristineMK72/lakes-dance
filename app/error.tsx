"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-6">{error.message || "Please try again."}</p>
        <button
          onClick={() => reset()}
          className="bg-cyan-500 hover:bg-cyan-400 text-white px-5 py-2.5 rounded-full text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
