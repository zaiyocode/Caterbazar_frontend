import React from "react";
import Footer from "@/components/Footer";
import VendorDashboardNavbar from "@/components/VendorNavbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <VendorDashboardNavbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
