import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaintenancePage from "@/app/maintenance/page";

/**
 * ── Maintenance Mode ─────────────────────────────────────────────────────────
 * When NEXT_PUBLIC_MAINTENANCE_MODE=true (set in .env.local or your hosting
 * environment), every public route under (site)/ will render the maintenance
 * page instead of its normal content — without touching Navbar or Footer.
 *
 * To enable  →  NEXT_PUBLIC_MAINTENANCE_MODE=true   (then restart / redeploy)
 * To disable →  NEXT_PUBLIC_MAINTENANCE_MODE=false  (or remove the variable)
 * ─────────────────────────────────────────────────────────────────────────────
 */
const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // When maintenance mode is active, skip the normal shell entirely and
  // render the full-screen maintenance page for every public route.
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
