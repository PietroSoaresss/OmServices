"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function Sidebar({
  user
}: {
  user: { name?: string | null; email?: string | null; role?: string | null };
}) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <aside className="min-h-screen w-64 bg-slate-950 px-6 py-8 text-slate-100">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Ocorrencias</h1>
        <p className="text-xs text-slate-400">{user.email}</p>
        <button
          className="w-full rounded-md border border-white/20 px-3 py-2 text-left text-sm transition hover:bg-white/10"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sair
        </button>
      </div>
      <nav className="mt-8 space-y-3 text-sm">
        <Link
          className={clsx(
            "block rounded-md px-3 py-2 transition",
            isActive("/dashboard") ? "bg-slate-800 text-white" : "hover:bg-white/10"
          )}
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className={clsx(
            "block rounded-md px-3 py-2 transition",
            isActive("/ocorrencias") ? "bg-slate-800 text-white" : "hover:bg-white/10"
          )}
          href="/ocorrencias"
        >
          Ocorrencias
        </Link>
        {user.role === "ADMIN" ? (
          <Link
            className={clsx(
              "block rounded-md px-3 py-2 transition",
              isActive("/usuarios") ? "bg-slate-800 text-white" : "hover:bg-white/10"
            )}
            href="/usuarios"
          >
            Usuarios
          </Link>
        ) : null}
      </nav>
    </aside>
  );
}
