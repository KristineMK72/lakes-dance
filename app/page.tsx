import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-900">Lakes Dance</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/calendar" className="hover:text-blue-600">Calendar</Link>
            <Link href="/post" className="hover:text-blue-600">Post Event</Link>
            <Link href="/login" className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700">Sign In</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Dance Happening in the Lakes</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Find local dance events, socials, classes, and workshops. Post your own and connect with the Brainerd Lakes dance community.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/post" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
            Post an Event
          </Link>
          <Link href="/calendar" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50">
            View Calendar
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h3 className="text-xl font-semibold mb-6">Upcoming Events</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Placeholder cards - will be replaced with real data from Supabase */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h4 className="font-medium">Friday Night Social</h4>
            <p className="text-sm text-gray-600">Ballroom • Brainerd • This Friday 7pm</p>
          </div>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h4 className="font-medium">Line Dancing Class</h4>
            <p className="text-sm text-gray-600">Beginner • Baxter • Saturday 2pm</p>
          </div>
        </div>
      </section>
    </main>
  );
}
