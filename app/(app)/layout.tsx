import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar user={session.user} />
        <main className="flex-1">
          <div className="container-page py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}


