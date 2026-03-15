/**
 * @file MaintenancePage
 * @route /maintenance
 * @description Full-screen maintenance page displayed when the site is under scheduled
 *              downtime. It is also mounted globally in (site)/layout.tsx when
 *              NEXT_PUBLIC_MAINTENANCE_MODE=true, replacing all public routes.
 *
 * ─── HOW TO ENABLE SITE-WIDE MAINTENANCE MODE ─────────────────────────────────
 *  1. Open `.env.local` (or set the variable in your hosting dashboard).
 *  2. Add / change:  NEXT_PUBLIC_MAINTENANCE_MODE=true
 *  3. Restart the dev server or redeploy — every public page will show this screen.
 *  4. To disable:    NEXT_PUBLIC_MAINTENANCE_MODE=false   (or delete the variable).
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * Design tokens used (Tailwind):
 *  • Background : orange-600 → orange-700 → red-900 diagonal gradient
 *  • Card       : white/10 frosted-glass + white/20 border
 *  • Text       : white, white/80, orange-100, orange-200
 *  • Accents    : animated spinning gears, pulsing status dot
 */

import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-600 via-orange-700 to-red-900 relative overflow-hidden">

      {/* ── Decorative ambient blobs ─────────────────────────────────────────── */}
      {/* Top-left warm glow */}
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-orange-400/25 rounded-full blur-3xl pointer-events-none" />
      {/* Bottom-right deep glow */}
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-red-900/50 rounded-full blur-3xl pointer-events-none" />
      {/* Center radial highlight */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-orange-300/10 rounded-full blur-3xl" />
      </div>


      {/* ── Main content card ─────────────────────────────────────────────────── */}
      <main className=" relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-10 max-w-6xl w-full text-center shadow-2xl">

          {/* Animated dual-gear icon — communicates maintenance visually */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {/* Large slow-spinning gear (clockwise) */}
            <svg
              className="w-12 h-12 text-orange-200 animate-spin [animation-duration:8s]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843z"
                clipRule="evenodd"
              />
            </svg>
            {/* Smaller fast counter-spinning gear */}
            <svg
              className="w-7 h-7 text-white/50 animate-spin [animation-duration:4s] [animation-direction:reverse]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* ── Headline ──────────────────────────────────────────────────────── */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            We're Cooking Something
            <br />
            <span className="text-orange-200">Special for You!</span>
          </h1>

          {/* ── Decorative divider ────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-orange-300" />
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-orange-300" />
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* ── Description ───────────────────────────────────────────────────── */}
          <p className="text-white/80 text-base leading-relaxed">
            Our platform is currently down for scheduled maintenance to bring you
            a better experience. We appreciate your patience and will be back
            with exciting updates very soon.
          </p>

          {/* ── Live status badge ─────────────────────────────────────────────── */}
          {/* Pulsing dot signals the system is actively being worked on */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/15 border border-white/25 text-orange-100 text-sm font-medium px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-orange-300 animate-pulse" />
            Maintenance in progress — check back soon
          </div>

          {/* ── Contact information ───────────────────────────────────────────── */}
          <div className="mt-8 space-y-3">
            <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">
              Need urgent help? Reach us at
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Email */}
              <a
                href="mailto:itcaterbazar@gmail.com"
                className="flex items-center gap-2 text-orange-100 hover:text-white text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                itcaterbazar@gmail.com
              </a>
              {/* Phone */}
              <a
                href="tel:+917655802071"
                className="flex items-center gap-2 text-orange-100 hover:text-white text-sm font-medium transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                +91 7655 802 071
              </a>
            </div>
          </div>


        </div>
      </main>

      {/* ── Bottom copyright strip ────────────────────────────────────────────── */}
      <footer className="relative z-10 text-center pb-8 pt-4">
        <p className="text-white/35 text-xs">
          &copy; {new Date().getFullYear()} Caterbazar. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
