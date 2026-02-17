import clsx from "clsx";
import { ReactNode } from "react";

export function Badge({
  children,
  variant = "default"
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        variant === "default" && "bg-slate-100 text-slate-700",
        variant === "success" && "bg-emerald-100 text-emerald-700",
        variant === "warning" && "bg-amber-100 text-amber-700"
      )}
    >
      {children}
    </span>
  );
}
