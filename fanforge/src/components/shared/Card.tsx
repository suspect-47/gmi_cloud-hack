"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn("card", !hover && "hover:shadow-[var(--shadow-md)] hover:translate-y-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}
