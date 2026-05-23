"use client";

import { useState, useRef, useEffect } from "react";
import { TEAMS, TEAM_FLAGS } from "@/lib/constants";
import { usePipeline, Kit } from "@/hooks/usePipeline";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/components/shared/Toast";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { Send, Mic, MicOff, Sparkles, ChevronDown, Copy, Check, Download, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  kit?: Kit;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! Tell me which World Cup team you support, and I'll generate a complete fan content kit — posters, social copy, hype reels, and more.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [showTeams, setShowTeams] = useState(false);
  const { status, kit, error, generate } = usePipeline();
  const speech = useSpeechRecognition();
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (speech.state === "processing" && speech.transcript) {
      setInput(speech.transcript);
      speech.reset();
    }
  }, [speech.state, speech.transcript, speech]);

  const addMessage = (
    role: Message["role"],
    content: string,
    kit?: Kit
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date(), kit },
    ]);
  };

  const detectTeam = (text: string): string | null => {
    const lower = text.toLowerCase();
    return TEAMS.find((t) => lower.includes(t.toLowerCase())) || null;
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || status === "submitting" || status === "processing") return;

    addMessage("user", trimmed);
    setInput("");

    const team = detectTeam(trimmed);
    if (!team) {
      addMessage(
        "assistant",
        'I couldn\'t identify a team from that. Try mentioning one of the 48 World Cup teams — like "Brazil", "Japan", or "United States".'
      );
      return;
    }

    const flag = TEAM_FLAGS[team] || "";
    addMessage(
      "assistant",
      `${flag} ${team} — great choice! Generating your fan kit now...`
    );

    const result = await generate({ team, message: trimmed });
    if (result) {
      addMessage(
        "assistant",
        `Your ${team} fan kit is ready! Here's what I made:`,
        result
      );
      toast(`${flag} ${team} kit generated!`);
    } else {
      addMessage(
        "assistant",
        "Something went wrong generating your kit. Check the console for details and try again."
      );
    }
  };

  const handleTeamSelect = (team: string) => {
    setInput(`Let's go ${team}!`);
    setShowTeams(false);
    inputRef.current?.focus();
  };

  const handleVoice = () => {
    if (speech.state === "listening") {
      speech.stop();
    } else {
      speech.start();
    }
  };

  const isProcessing = status === "submitting" || status === "processing";

  return (
    <aside
      className="w-chat-panel shrink-0 h-screen sticky top-0 flex flex-col glass-sidebar border-l border-r-0"
      style={{
        borderRight: "none",
        borderLeft: "1px solid rgba(255,255,255,0.40)",
        boxShadow: "-4px 0 24px rgba(44,24,16,0.04)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-orange flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-text-primary font-body">
            FanForge AI
          </h2>
          <p className="text-[10px] text-text-tertiary">
            World Cup 2026 Content Engine
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "chat-bubble",
                  msg.role === "user"
                    ? "chat-bubble-user"
                    : "chat-bubble-assistant"
                )}
              >
                {msg.content}
              </div>
            </div>
            {msg.kit && <KitPreview kit={msg.kit} />}
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="chat-bubble chat-bubble-assistant flex items-center gap-2">
              <ProgressRing size={18} stroke={2} />
              <span className="text-text-tertiary text-xs">
                {status === "submitting"
                  ? "Sending to pipeline..."
                  : "Generating kit..."}
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Team quick-select */}
      {showTeams && (
        <div className="px-4 pb-2">
          <div className="glass-card p-3 max-h-40 overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {TEAMS.map((team) => (
                <button
                  key={team}
                  onClick={() => handleTeamSelect(team)}
                  className="text-left px-2 py-1.5 rounded-md text-xs font-body hover:bg-gold/10 transition-colors flex items-center gap-1.5 truncate"
                >
                  <span className="text-sm">{TEAM_FLAGS[team]}</span>
                  <span className="truncate">{team}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        {speech.error && (
          <p className="text-[10px] text-red-500 mb-1 font-body">
            {speech.error}
          </p>
        )}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              speech.state === "listening"
                ? "Listening..."
                : "Tell me your team..."
            }
            disabled={isProcessing}
            className="chat-input pr-24"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {speech.isSupported && (
              <button
                onClick={handleVoice}
                disabled={isProcessing}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  speech.state === "listening"
                    ? "bg-deep-orange text-white"
                    : "hover:bg-gold/10 text-text-tertiary hover:text-text-secondary"
                )}
                title={
                  speech.state === "listening" ? "Stop listening" : "Voice input"
                }
              >
                {speech.state === "listening" ? (
                  <MicOff size={14} />
                ) : (
                  <Mic size={14} />
                )}
              </button>
            )}
            <button
              onClick={() => setShowTeams(!showTeams)}
              className="p-1.5 rounded-md hover:bg-gold/10 text-text-tertiary hover:text-text-secondary transition-colors"
              title="Browse teams"
            >
              <ChevronDown size={14} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="p-1.5 rounded-md bg-gold text-text-on-gold disabled:opacity-40 hover:bg-orange transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-text-tertiary text-center mt-2 font-body">
          Powered by RocketRide + GMI Cloud + Google AI Studio
        </p>
      </div>
    </aside>
  );
}

function KitPreview({ kit }: { kit: Kit }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const copyText = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const social = kit.assets.social_copy;
  const group = kit.assets.group_breakdown;
  const party = kit.assets.watch_party;
  const poster = kit.assets.matchday_poster;
  const hypeCard = kit.assets.fan_hype_card;
  const socialCover = kit.assets.social_cover;
  const voice = kit.assets.voice_hype;

  const images = [
    { label: "Matchday Poster", asset: poster },
    { label: "Fan Hype Card", asset: hypeCard },
    { label: "Social Cover", asset: socialCover },
  ].filter((img) => img.asset?.url);

  return (
    <div className="mt-2 space-y-2 animate-fade-in">
      {/* Generated images */}
      {images.length > 0 && (
        <div className="space-y-2">
          {images.map((img) => (
            <div key={img.label} className="glass-card p-2 overflow-hidden">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-caption text-orange">{img.label}</span>
                <a
                  href={img.asset!.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded hover:bg-gold/10 text-text-tertiary transition-colors"
                  download
                >
                  <Download size={12} />
                </a>
              </div>
              <img
                src={img.asset!.url!}
                alt={img.label}
                className="w-full rounded-lg object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Voice hype audio */}
      {voice?.url && (
        <div className="glass-card p-3">
          <span className="text-caption text-orange">Voice Hype</span>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={toggleAudio}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-orange flex items-center justify-center text-white shrink-0"
            >
              {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-tertiary font-body line-clamp-2">
                {voice.script}
              </p>
            </div>
            <a
              href={voice.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-gold/10 text-text-tertiary transition-colors shrink-0"
              download
            >
              <Download size={12} />
            </a>
          </div>
          <audio
            ref={audioRef}
            src={voice.url}
            onEnded={() => setPlaying(false)}
            preload="none"
          />
        </div>
      )}

      {/* Social copy */}
      {social?.instagram_caption && (
        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-orange">Instagram</span>
            <CopyBtn
              onClick={() => copyText(social.instagram_caption!, "ig")}
              copied={copiedField === "ig"}
            />
          </div>
          <p className="text-xs text-text-primary font-body leading-relaxed">
            {social.instagram_caption}
          </p>
          {social.hashtags && social.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {social.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] bg-gold/10 text-deep-orange px-1.5 py-0.5 rounded-full font-body"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {social?.twitter_post && (
        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-orange">X / Twitter</span>
            <CopyBtn
              onClick={() => copyText(social.twitter_post!, "tw")}
              copied={copiedField === "tw"}
            />
          </div>
          <p className="text-xs text-text-primary font-body">
            {social.twitter_post}
          </p>
        </div>
      )}

      {social?.hot_take && (
        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-orange">Hot Take</span>
            <CopyBtn
              onClick={() => copyText(social.hot_take!, "ht")}
              copied={copiedField === "ht"}
            />
          </div>
          <p className="text-xs text-text-primary font-body italic">
            {social.hot_take}
          </p>
        </div>
      )}

      {/* Group breakdown */}
      {group?.group && (
        <div className="glass-card p-3">
          <span className="text-caption text-orange">
            Group {group.group}
          </span>
          {group.opponents && group.opponents.length > 0 && (
            <div className="flex gap-2 mt-2">
              {group.opponents.map((opp) => (
                <span
                  key={opp}
                  className="text-[11px] bg-cream/60 px-2 py-1 rounded-md font-body"
                >
                  {opp}
                </span>
              ))}
            </div>
          )}
          {group.ai_prediction && (
            <p className="text-xs text-text-secondary font-body mt-2">
              {group.ai_prediction}
            </p>
          )}
        </div>
      )}

      {/* Watch party */}
      {party?.dishes && party.dishes.length > 0 && (
        <div className="glass-card p-3">
          <span className="text-caption text-orange">Watch Party</span>
          <div className="space-y-1.5 mt-2">
            {party.dishes.map((dish, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-sm">{(dish as any).emoji || "🍽️"}</span>
                <div>
                  <span className="text-xs font-semibold text-text-primary font-body">
                    {dish.name}
                  </span>
                  <p className="text-[10px] text-text-tertiary font-body">
                    {dish.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {party.drink && (
            <p className="text-xs text-text-secondary font-body mt-2">
              🍹 {party.drink}
            </p>
          )}
        </div>
      )}

      {/* Poster prompt fallback (when no image URL) */}
      {poster?.prompt && !poster.url && (
        <div className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption text-orange">Poster Prompt</span>
            <CopyBtn
              onClick={() => copyText(poster.prompt!, "poster")}
              copied={copiedField === "poster"}
            />
          </div>
          <p className="text-[10px] text-text-tertiary font-body leading-relaxed line-clamp-3">
            {poster.prompt}
          </p>
        </div>
      )}
    </div>
  );
}

function CopyBtn({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <button
      onClick={onClick}
      className="p-1 rounded hover:bg-gold/10 text-text-tertiary transition-colors"
    >
      {copied ? (
        <Check size={12} className="text-green-600" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  );
}
