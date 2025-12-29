import React from "react";
import Footer from "@/components/Footer";
import AdminNavbar from "@/components/Admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
