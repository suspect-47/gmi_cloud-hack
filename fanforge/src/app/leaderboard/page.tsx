"use client";

import { TEAMS, TEAM_FLAGS } from "@/lib/constants";
import { Trophy, TrendingUp, Flame } from "lucide-react";

const LEADERBOARD = [
  { team: "Brazil", kits: 1247, trend: "+12%" },
  { team: "Argentina", kits: 1183, trend: "+8%" },
  { team: "France", kits: 982, trend: "+15%" },
  { team: "Germany", kits: 876, trend: "+5%" },
  { team: "United States", kits: 834, trend: "+22%" },
  { team: "Japan", kits: 721, trend: "+18%" },
  { team: "England", kits: 698, trend: "+7%" },
  { team: "Spain", kits: 654, trend: "+9%" },
  { team: "Mexico", kits: 612, trend: "+14%" },
  { team: "Portugal", kits: 589, trend: "+6%" },
  { team: "Netherlands", kits: 543, trend: "+11%" },
  { team: "South Korea", kits: 487, trend: "+19%" },
];

export default function LeaderboardPage() {
  return (
    <div className="px-8 py-6 max-w-6xl">
      <div className="mb-8">
        <p className="text-caption text-text-tertiary mb-1">Community</p>
        <h1 className="text-h1 text-deep-orange">Leaderboard</h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          Most popular teams by fan kit generation.
        </p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {LEADERBOARD.slice(0, 3).map((entry, i) => (
          <div
            key={entry.team}
            className="glass-card p-6 text-center relative overflow-hidden"
          >
            {i === 0 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-orange" />
            )}
            <div className="text-4xl mb-3">{TEAM_FLAGS[entry.team]}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              <Trophy
                size={16}
                className={
                  i === 0
                    ? "text-gold"
                    : i === 1
                      ? "text-text-tertiary"
                      : "text-deep-orange"
                }
              />
              <span className="text-sm font-bold text-text-primary font-body">
                #{i + 1}
              </span>
            </div>
            <h3 className="text-h3 text-text-primary mb-1">{entry.team}</h3>
            <p className="text-2xl font-bold text-deep-orange font-body">
              {entry.kits.toLocaleString()}
            </p>
            <p className="text-xs text-text-tertiary font-body">kits generated</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600 font-body">
              <TrendingUp size={12} />
              {entry.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/30 flex items-center gap-2">
          <Flame size={18} className="text-orange" />
          <h2 className="text-h3 text-text-primary">All Teams</h2>
        </div>
        <div className="divide-y divide-white/20">
          {LEADERBOARD.map((entry, i) => (
            <div
              key={entry.team}
              className="flex items-center gap-4 px-6 py-3 hover:bg-gold/5 transition-colors"
            >
              <span className="w-8 text-sm font-bold text-text-tertiary font-body text-center">
                {i + 1}
              </span>
              <span className="text-xl">{TEAM_FLAGS[entry.team]}</span>
              <span className="flex-1 text-sm font-medium text-text-primary font-body">
                {entry.team}
              </span>
              <span className="text-sm font-bold text-text-primary font-body">
                {entry.kits.toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-body w-12 text-right">
                {entry.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
