"use client";

import { TEAMS, TEAM_FLAGS } from "@/lib/constants";
import {
  Sparkles,
  TrendingUp,
  Users,
  Image,
  Trophy,
  Calendar,
  Globe,
  Zap,
} from "lucide-react";

const FEATURED_TEAMS = ["Brazil", "Argentina", "France", "Germany", "Japan", "United States"];

const RECENT_KITS = [
  { team: "Brazil", type: "Matchday Poster", time: "2 min ago" },
  { team: "Japan", type: "Social Copy Pack", time: "15 min ago" },
  { team: "Argentina", type: "Full Fan Kit", time: "1 hr ago" },
];

export default function Home() {
  return (
    <div className="px-8 py-6 max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-caption text-text-tertiary mb-1">Dashboard</p>
        <h1 className="text-h1 text-deep-orange">Welcome to FanForge</h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          FIFA World Cup 2026 — 19 days to kickoff
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 card-stagger">
        {[
          { label: "Teams Supported", value: "48", icon: Globe, color: "text-gold" },
          { label: "Kits Generated", value: "0", icon: Image, color: "text-orange" },
          { label: "AI Models", value: "5", icon: Zap, color: "text-deep-orange" },
          { label: "Days to Kickoff", value: "19", icon: Calendar, color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
              <TrendingUp size={14} className="text-text-tertiary" />
            </div>
            <p className="text-2xl font-bold text-text-primary font-body">{stat.value}</p>
            <p className="text-xs text-text-tertiary font-body mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* How it works */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-gold" />
            <h2 className="text-h3 text-text-primary">How It Works</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Tell us your team",
                desc: "Type or speak your team name in the chat panel.",
              },
              {
                step: "02",
                title: "AI generates",
                desc: "5 AI models process your request across parallel nodes.",
              },
              {
                step: "03",
                title: "Get your kit",
                desc: "Posters, social copy, group analysis, and watch party kits.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-orange flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-xs font-body">{item.step}</span>
                </div>
                <h3 className="text-sm font-semibold text-text-primary font-body mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={18} className="text-gold" />
            <h2 className="text-h3 text-text-primary">Recent Kits</h2>
          </div>
          {RECENT_KITS.length > 0 ? (
            <div className="space-y-3">
              {RECENT_KITS.map((kit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gold/5 transition-colors"
                >
                  <span className="text-xl">{TEAM_FLAGS[kit.team]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary font-body truncate">
                      {kit.team}
                    </p>
                    <p className="text-[10px] text-text-tertiary font-body">{kit.type}</p>
                  </div>
                  <span className="text-[10px] text-text-tertiary font-body whitespace-nowrap">
                    {kit.time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-tertiary font-body text-center py-6">
              No kits generated yet. Use the chat panel to get started!
            </p>
          )}
        </div>
      </div>

      {/* Featured teams */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Users size={18} className="text-gold" />
          <h2 className="text-h3 text-text-primary">Featured Teams</h2>
          <span className="ml-auto text-[10px] text-text-tertiary font-body">
            {TEAMS.length} teams qualified
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FEATURED_TEAMS.map((team) => (
            <div
              key={team}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/50 hover:border-gold/30 hover:bg-gold/5 transition-all cursor-pointer group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {TEAM_FLAGS[team]}
              </span>
              <span className="text-xs font-semibold text-text-primary font-body">{team}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by footer inline */}
      <div className="flex items-center justify-center gap-6 text-text-tertiary text-xs font-body py-4">
        <span>Powered by</span>
        <span className="font-bold text-text-secondary">RocketRide</span>
        <span>&times;</span>
        <span className="font-bold text-text-secondary">GMI Cloud</span>
        <span>&times;</span>
        <span className="font-bold text-text-secondary">Google AI Studio</span>
      </div>
    </div>
  );
}
