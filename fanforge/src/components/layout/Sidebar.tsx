"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Sparkles,
  Image,
  Trophy,
  Settings,
  Search,
  HelpCircle,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/generate", label: "Generate", icon: Sparkles },
  { href: "#kits", label: "My Kits", icon: Image },
  { href: "#leaderboard", label: "Leaderboard", icon: Trophy },
];

const BOTTOM_ITEMS = [
  { href: "#settings", label: "Settings", icon: Settings },
  { href: "#help", label: "Help", icon: HelpCircle },
];

export function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "glass-sidebar shrink-0 flex flex-col py-5 transition-all duration-300 ease-[var(--ease-out)] h-screen sticky top-0",
        expanded ? "w-sidebar-expanded px-4" : "w-sidebar-collapsed px-2 items-center"
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Brand */}
      <Link
        href="/"
        className={cn(
          "flex items-center gap-3 mb-5",
          expanded ? "px-3" : "justify-center"
        )}
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-orange flex items-center justify-center text-white font-display font-bold text-base shrink-0 shadow-warm-sm">
          F
        </div>
        {expanded && (
          <span className="font-body font-bold text-deep-orange text-[15px] tracking-tight">
            FanForge
          </span>
        )}
      </Link>

      {/* Search */}
      {expanded && (
        <div className="relative mb-4 px-1">
          <Search
            size={14}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-white/50 border border-white/60 text-xs font-body text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold/40 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary bg-white/60 px-1.5 py-0.5 rounded font-body">
            /
          </kbd>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-item",
                active && "active",
                !expanded && "justify-center px-0 py-2.5"
              )}
              title={!expanded ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" strokeWidth={active ? 2.2 : 1.8} />
              {expanded && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="flex flex-col gap-0.5 mt-2 pt-3 border-t border-white/30">
        {BOTTOM_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "nav-item",
              !expanded && "justify-center px-0 py-2.5"
            )}
            title={!expanded ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" strokeWidth={1.8} />
            {expanded && <span>{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* User avatar */}
      <div
        className={cn(
          "flex items-center gap-3 mt-3 pt-3 border-t border-white/30",
          expanded ? "px-3" : "justify-center"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange to-deep-orange flex items-center justify-center text-white font-body font-bold text-[10px] shrink-0">
          FF
        </div>
        {expanded && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-primary truncate">Fan User</p>
            <p className="text-[10px] text-text-tertiary truncate">Free plan</p>
          </div>
        )}
      </div>
    </aside>
  );
}
