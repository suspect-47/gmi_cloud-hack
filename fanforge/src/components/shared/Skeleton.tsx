"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "image" | "card";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const base = "animate-pulse bg-cream rounded-md";

  const variants = {
    text: "h-4 w-3/4",
    image: "aspect-square w-full rounded-lg",
    card: "h-48 w-full rounded-lg",
  };

  return <div className={cn(base, variants[variant], className)} />;
}
