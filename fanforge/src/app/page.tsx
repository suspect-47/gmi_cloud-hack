"use client";

import { TEAMS, TEAM_FLAGS } from "@/lib/constants";
import { usePipelineContext } from "@/hooks/PipelineContext";
import { KitGallery } from "@/components/kit/KitGallery";
import { ProgressRing } from "@/components/shared/ProgressRing";
import {
  Sparkles,
  TrendingUp,
  Users,
  Image,
  Calendar,
  Globe,
  Zap,
  ArrowLeft,
} from "lucide-react";

const FEATURED_TEAMS = [
  "Brazil",
  "Argentina",
  "France",
  "Germany",
  "Japan",
  "United States",
  "England",
  "Spain",
  "Mexico",
  "South Korea",
  "Portugal",
  "Netherlands",
];

export default function Home() {
  const { status, kit, error, reset } = usePipelineContext();
  const isProcessing = status === "submitting" || status === "processing";

  if (isProcessing) {
    return (
      <div className="px-8 py-6 max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <ProgressRing size={80} stroke={4} />
          <h2 className="text-h2 text-deep-orange mt-8 mb-2">
            Building your kit...
          </h2>
          <p className="text-text-secondary font-body max-w-md text-center">
            AI pipeline running — generating images, voice, and copy across
            parallel nodes.
          </p>
          <div className="flex flex-col gap-2 mt-8 text-sm font-body text-text-tertiary">
            <Step label="Intent extraction" done />
            <Step label="Team enrichment" done={status !== "submitting"} />
            <Step label="Creative direction" />
            <Step label="Image generation (3x)" />
            <Step label="Voice synthesis" />
            <Step label="Assembling kit" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "complete" && kit) {
    return (
      <div className="px-8 py-6 max-w-6xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-caption text-text-tertiary mb-1">Fan Kit</p>
            <h1 className="text-h1 text-deep-orange flex items-center gap-3">
              <span className="text-3xl">{TEAM_FLAGS[kit.team]}</span>
              {kit.team} Fan Kit
            </h1>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/50 text-sm font-body text-text-secondary hover:bg-gold/10 transition-all hover:border-gold/30"
          >
            <ArrowLeft size={16} />
            New Kit
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        <KitGallery kit={kit} />
      </div>
    );
  }

  return (
    <div className="px-8 py-6 max-w-6xl mx-auto">
      {/* Hero header */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/mascot.png"
            alt="Forgie"
            className="w-14 h-14 rounded-2xl object-cover shadow-warm-md"
          />
          <div>
            <p className="text-caption text-text-tertiary mb-1">Dashboard</p>
            <h1 className="text-h1 text-deep-orange">Welcome to FanForge</h1>
          </div>
        </div>
        <p className="text-sm text-text-secondary font-body">
          FIFA World Cup 2026 — 19 days to kickoff. Chat with Forgie to generate your fan kit.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 card-stagger">
        {[
          { label: "Teams Supported", value: "48", icon: Globe, color: "from-gold to-orange" },
          { label: "Kits Generated", value: "0", icon: Image, color: "from-orange to-deep-orange" },
          { label: "AI Models", value: "5", icon: Zap, color: "from-deep-orange to-orange" },
          { label: "Days to Kickoff", value: "19", icon: Calendar, color: "from-gold to-deep-orange" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 group hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={16} className="text-white" />
              </div>
              <TrendingUp size={14} className="text-text-tertiary group-hover:text-gold transition-colors" />
            </div>
            <p className="text-2xl font-bold text-text-primary font-body">
              {stat.value}
            </p>
            <p className="text-xs text-text-tertiary font-body mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="glass-card p-8 mb-10 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-gold" />
          <h2 className="text-h3 text-text-primary">How It Works</h2>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Tell Forgie your team",
              desc: "Type or speak your team name in the chat panel. Forgie understands natural language.",
              icon: "💬",
            },
            {
              step: "02",
              title: "AI generates in parallel",
              desc: "5 AI models run simultaneously — images, voice, social copy, match analysis.",
              icon: "⚡",
            },
            {
              step: "03",
              title: "Get your full kit",
              desc: "Matchday posters, hype reels, Instagram captions, watch party menus — all custom.",
              icon: "🎨",
            },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-orange flex items-center justify-center mx-auto mb-4 shadow-warm-sm group-hover:shadow-gold-glow transition-shadow duration-300">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="text-sm font-bold text-text-primary font-body mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary font-body leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured teams */}
      <div className="glass-card p-8 mb-8 animate-slide-up" style={{ animationDelay: "350ms" }}>
        <div className="flex items-center gap-2 mb-6">
          <Users size={18} className="text-gold" />
          <h2 className="text-h3 text-text-primary">Pick Your Team</h2>
          <span className="ml-auto text-[10px] text-text-tertiary font-body">
            {TEAMS.length} teams qualified
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_TEAMS.map((team, i) => (
            <div
              key={team}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/40 hover:border-gold/40 hover:bg-gold/5 hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              style={{ animationDelay: `${400 + i * 50}ms` }}
            >
              <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                {TEAM_FLAGS[team]}
              </span>
              <span className="text-xs font-semibold text-text-primary font-body">
                {team}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full transition-colors ${done ? "bg-[var(--color-success)]" : "bg-[var(--color-border-medium)]"}`}
      />
      <span className={done ? "text-text-secondary" : ""}>{label}</span>
    </div>
  );
}
