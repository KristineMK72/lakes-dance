"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "../auth/actions";

export default function MobileNav({ signedIn }: { signedIn: boolean }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/calendar", label: "Calendar" },
    { href: "/wall", label: "Wall" },
    { href: "/bands", label: "Bands" },
    { href: "/past", label: "Past" },
    { href: "/post", label: "Post Event" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-slate-200"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 max-w-[80vw] glass border-l border-white/10 z-50 p-6 flex flex-col">
            <div className="flex justify-end mb-6">
              <button onClick={() => setOpen(false)} className="text-slate-300" aria-label="Close">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-slate-200 hover:text-white text-lg"
                >
                  {l.label}
                </Link>
              ))}
              {signedIn ? (
                <form action={signOut}>
                  <button type="submit" className="block w-full text-left py-3 text-slate-400">
                    Sign Out
                  </button>
                </form>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)} className="block py-3 text-cyan-400 text-lg">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
