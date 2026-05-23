"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "error";
  className?: string;
}

const variants = {
  default: "bg-cream text-deep-orange",
  gold: "bg-gold text-text-on-gold",
  success: "bg-[var(--color-success)] text-white",
  error: "bg-[var(--color-error)] text-white",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-body font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
