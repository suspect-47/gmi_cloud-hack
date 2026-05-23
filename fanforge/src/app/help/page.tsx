"use client";

import { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Mic,
  Image,
  Volume2,
  ChevronDown,
  ChevronRight,
  Zap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How does FanForge work?",
    a: "Type your team name in the chat panel. Our AI pipeline uses 5 models in parallel — DeepSeek for creative direction, Seedream for images, Inworld for voice synthesis, and Gemini for live World Cup data. Your complete fan kit generates in about 30 seconds.",
  },
  {
    q: "Which teams are supported?",
    a: "All 48 teams qualified for FIFA World Cup 2026 are supported. This includes the expanded format with teams from 6 confederations across North America.",
  },
  {
    q: "Can I use voice input?",
    a: "Yes! Click the microphone icon in the chat panel. Speak your team name and it'll be transcribed automatically. Works in Chrome, Edge, and Safari.",
  },
  {
    q: "What's in a fan kit?",
    a: "Each kit includes: 3 AI-generated images (matchday poster, fan hype card, social cover), a voice hype reel narration, Instagram/Twitter social copy with hashtags, a group stage analysis with AI predictions, and a themed watch party menu.",
  },
  {
    q: "Can I download the images?",
    a: "Yes. Every generated image and audio file has a download button. Images are 1024x1024 PNG. Audio is MP3 format.",
  },
  {
    q: "How is the data sourced?",
    a: "Team data comes from Google Gemini with Search grounding — it pulls live FIFA rankings, match schedules, and group information. Creative content is generated fresh each time by DeepSeek V3.",
  },
];

const FEATURES = [
  { icon: MessageSquare, label: "Chat-first", desc: "Natural language team input" },
  { icon: Mic, label: "Voice input", desc: "Speak your team name" },
  { icon: Image, label: "3 AI images", desc: "Poster, hype card, social cover" },
  { icon: Volume2, label: "Voice hype", desc: "AI-narrated hype reel" },
  { icon: Zap, label: "5 AI models", desc: "Parallel pipeline execution" },
  { icon: Globe, label: "Live data", desc: "Real-time World Cup info" },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="px-8 py-6 max-w-3xl">
      <div className="mb-8">
        <p className="text-caption text-text-tertiary mb-1">Support</p>
        <h1 className="text-h1 text-deep-orange">Help Center</h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          Everything you need to know about FanForge.
        </p>
      </div>

      {/* Feature overview */}
      <div className="glass-card p-6 mb-8">
        <h2 className="text-h3 text-text-primary mb-4">What FanForge Does</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center shrink-0">
                <f.icon size={16} className="text-deep-orange" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary font-body">
                  {f.label}
                </p>
                <p className="text-xs text-text-tertiary font-body">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={18} className="text-orange" />
          <h2 className="text-h3 text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>
        {FAQS.map((faq, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <span className="text-sm font-semibold text-text-primary font-body">
                {faq.q}
              </span>
              {open === i ? (
                <ChevronDown size={16} className="text-text-tertiary shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-text-tertiary shrink-0" />
              )}
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all",
                open === i ? "max-h-40 pb-4 px-4" : "max-h-0"
              )}
            >
              <p className="text-sm text-text-secondary font-body leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="glass-card p-6 mt-8 text-center">
        <h2 className="text-h3 text-text-primary mb-2">Still need help?</h2>
        <p className="text-sm text-text-secondary font-body">
          Reach out to the team on the chat panel — our AI assistant can
          answer most questions about your kits.
        </p>
      </div>
    </div>
  );
}
