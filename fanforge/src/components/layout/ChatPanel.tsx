"use client";

import { useState, useRef, useEffect } from "react";
import { TEAMS, TEAM_FLAGS } from "@/lib/constants";
import { usePipelineContext } from "@/hooks/PipelineContext";
import { useToast } from "@/components/shared/Toast";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { VoiceOverlay } from "@/components/voice/VoiceOverlay";
import { Send, Mic, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey there! I'm Forgie — your World Cup sidekick. Tell me which team you're backing and I'll whip up a full fan kit: posters, hype reels, social captions, the works. Let's go!",
};

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [showTeams, setShowTeams] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const { status, generate } = usePipelineContext();
  const { toast } = useToast();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const addMessage = (role: Message["role"], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content },
    ]);
  };

  const detectTeam = (text: string): string | null => {
    const lower = text.toLowerCase();
    return TEAMS.find((t) => lower.includes(t.toLowerCase())) || null;
  };

  const handleSubmit = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || status === "submitting" || status === "processing") return;

    addMessage("user", trimmed);

    const team = detectTeam(trimmed);
    if (!team) {
      addMessage(
        "assistant",
        "Hmm, I didn't catch a team name in there. Try something like \"Brazil\", \"Japan\", or \"United States\" — any of the 48 World Cup squads!"
      );
      return;
    }

    const flag = TEAM_FLAGS[team] || "";
    addMessage(
      "assistant",
      `${flag} ${team}! Love it. Firing up the content engine — sit tight while I craft your kit...`
    );

    const result = await generate({ team, message: trimmed });
    if (result) {
      addMessage(
        "assistant",
        `Boom! Your ${team} fan kit just dropped on the dashboard — posters, social copy, the whole nine yards. Go check it out!`
      );
      toast(`${flag} ${team} kit generated!`);
    } else {
      addMessage(
        "assistant",
        "Oof, something went sideways on that one. Mind giving it another shot?"
      );
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    handleSubmit(trimmed);
  };

  const handleVoiceResult = (transcript: string) => {
    handleSubmit(transcript);
  };

  const handleTeamSelect = (team: string) => {
    setInput(`Let's go ${team}!`);
    setShowTeams(false);
    inputRef.current?.focus();
  };

  const isProcessing = status === "submitting" || status === "processing";

  return (
    <>
      <VoiceOverlay
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onResult={handleVoiceResult}
      />

      <aside className="w-chat-panel shrink-0 h-screen sticky top-0 flex items-center pr-4 py-4">
        <div className="flex flex-col h-full w-full rounded-2xl glass-card border border-white/50 shadow-warm-lg overflow-hidden">
          {/* Header with mascot */}
          <div className="px-5 py-4 border-b border-white/20 flex items-center gap-3">
            <img
              src="/mascot.png"
              alt="Forgie"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-gold/30"
            />
            <div>
              <h2 className="text-sm font-bold text-text-primary font-body">
                Forgie
              </h2>
              <p className="text-[10px] text-text-tertiary font-body">
                Your World Cup content sidekick
              </p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2 animate-slide-up",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <img
                    src="/mascot.png"
                    alt=""
                    className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
                  />
                )}
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
            ))}

            {isProcessing && (
              <div className="flex gap-2 justify-start animate-slide-up">
                <img
                  src="/mascot.png"
                  alt=""
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
                />
                <div className="chat-bubble chat-bubble-assistant flex items-center gap-2">
                  <ProgressRing size={18} stroke={2} />
                  <span className="text-text-tertiary text-xs">
                    {status === "submitting"
                      ? "Cooking up something good..."
                      : "Building your kit..."}
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
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tell Forgie your team..."
                disabled={isProcessing}
                className="chat-input pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => setVoiceOpen(true)}
                  disabled={isProcessing}
                  className="p-1.5 rounded-md hover:bg-gold/10 text-text-tertiary hover:text-deep-orange transition-colors"
                  title="Talk to Forgie"
                >
                  <Mic size={14} />
                </button>
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
          </div>
        </div>
      </aside>
    </>
  );
}
