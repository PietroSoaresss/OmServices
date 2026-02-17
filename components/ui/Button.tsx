"use client";

import clsx from "clsx";
import { ReactElement, ReactNode, cloneElement, isValidElement } from "react";

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  type = "button",
  loading,
  disabled,
  asChild,
  onClick
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-md font-medium transition",
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
    variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800",
    variant === "secondary" && "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    variant === "danger" && "bg-rose-600 text-white hover:bg-rose-500",
    (loading || disabled) && "opacity-70 pointer-events-none",
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>; 
    return cloneElement(child, {
      className: clsx(classes, child.props.className)
    });
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled || loading}>
      {loading ? "..." : children}
    </button>
  );
}
