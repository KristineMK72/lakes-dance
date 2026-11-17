export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Privacy</h1>

        <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
          <p>
            Lakes Dance is a community space for dance events in the Brainerd Lakes area.
            We keep things simple and private.
          </p>

          <div>
            <h2 className="text-white font-semibold mb-2">What we collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>The email you use to sign in</li>
              <li>The name and bio you choose to share</li>
              <li>Photos, videos, and posts you upload</li>
              <li>Events you create or RSVP to</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-2">How we protect it</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>The site uses encrypted connections (HTTPS)</li>
              <li>Passwords are securely hashed and never stored in plain text</li>
              <li>You can only edit or delete your own posts, events, and profile</li>
              <li>We do not sell your information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-2">Your choices</h2>
            <p>
              You can update your profile or delete your posts and events anytime.
              If you want your account removed, email the site owner and we’ll take care of it.
            </p>
          </div>

          <p className="text-slate-400 text-xs pt-4">
            Last updated November 2026
          </p>
        </div>
      </main>
    </div>
  );
}
