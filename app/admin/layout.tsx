import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Dashboard — Moonboy",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = verifyAdminSession(cookies().get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink md:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
