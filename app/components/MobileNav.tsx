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
        onClick={() => setOpen(!open)}
        className="p-2 text-slate-200"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full glass border-b border-white/10 px-4 py-3 space-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-slate-200 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          {signedIn ? (
            <form action={signOut}>
              <button type="submit" className="block w-full text-left py-2 text-slate-300">
                Sign Out
              </button>
            </form>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="block py-2 text-cyan-400">
              Sign In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
