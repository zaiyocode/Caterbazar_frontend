import React from "react";
import Footer from "@/components/Footer";
import SuperAdminNavbar from "@/components/SuperAdminNavbar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperAdminNavbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}