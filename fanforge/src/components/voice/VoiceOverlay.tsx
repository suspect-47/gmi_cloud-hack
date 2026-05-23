"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "listening" | "thinking" | "speaking";

interface VoiceOverlayProps {
  open: boolean;
  onClose: () => void;
  onResult: (transcript: string) => void;
}

export function VoiceOverlay({ open, onClose, onResult }: VoiceOverlayProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<any>(null);
  const phaseRef = useRef<Phase>("idle");
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const setPhaseSync = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const cleanup = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
  }, []);

  const startListening = useCallback(async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    cleanup();
    setTranscript("");
    setResponse("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        setVolume(avg / 128);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // mic volume visualization optional
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e: any) => {
      const results = e.results[0];
      setTranscript(results[0].transcript);
      if (results.isFinal) {
        const text = results[0].transcript;
        setPhaseSync("thinking");
        cancelAnimationFrame(animFrameRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setVolume(0);

        setTimeout(() => {
          onResult(text);
          speak(getReply(text));
        }, 800);
      }
    };

    recognition.onerror = () => setPhaseSync("idle");
    recognition.onend = () => {
      if (phaseRef.current === "listening") setPhaseSync("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setPhaseSync("listening");
  }, [cleanup, setPhaseSync, onResult]);

  const speak = useCallback(
    (text: string) => {
      setResponse(text);
      setPhaseSync("speaking");

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        utterance.onend = () => setPhaseSync("idle");
        utterance.onerror = () => setPhaseSync("idle");
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPhaseSync("idle"), 3000);
      }
    },
    [setPhaseSync]
  );

  const handleClose = useCallback(() => {
    cleanup();
    window.speechSynthesis?.cancel();
    setPhaseSync("idle");
    setTranscript("");
    setResponse("");
    setVolume(0);
    onClose();
  }, [cleanup, setPhaseSync, onClose]);

  useEffect(() => {
    if (open) {
      startListening();
    }
    return cleanup;
  }, [open, startListening, cleanup]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open) return null;

  const ringScale = 1 + volume * 0.4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center voice-overlay-backdrop animate-fade-in">
      {/* Close */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col items-center gap-8">
        {/* Mascot with animated rings */}
        <div className="relative">
          {/* Outer pulse ring */}
          <div
            className={cn(
              "absolute inset-0 rounded-full transition-transform duration-100",
              phase === "listening" && "voice-ring-listening",
              phase === "speaking" && "voice-ring-speaking",
              phase === "thinking" && "voice-ring-thinking"
            )}
            style={{
              width: 200,
              height: 200,
              top: -20,
              left: -20,
              transform: phase === "listening" ? `scale(${ringScale})` : undefined,
            }}
          />

          {/* Middle ring */}
          <div
            className={cn(
              "absolute rounded-full",
              phase === "listening" && "voice-ring-mid-listening",
              phase === "speaking" && "voice-ring-mid-speaking"
            )}
            style={{ width: 180, height: 180, top: -10, left: -10 }}
          />

          {/* Mascot */}
          <div
            className={cn(
              "relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl z-10",
              phase === "idle" && "mascot-idle",
              phase === "listening" && "mascot-listening",
              phase === "thinking" && "mascot-thinking",
              phase === "speaking" && "mascot-speaking"
            )}
          >
            <img
              src="/mascot.png"
              alt="Forgie"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Expression overlays */}
          {phase === "listening" && (
            <div className="absolute -top-2 -right-2 z-20 text-2xl animate-bounce">
              👂
            </div>
          )}
          {phase === "thinking" && (
            <div className="absolute -top-2 -right-2 z-20 text-2xl voice-thinking-emoji">
              🤔
            </div>
          )}
          {phase === "speaking" && (
            <div className="absolute -bottom-1 right-2 z-20 text-2xl mascot-speaking">
              💬
            </div>
          )}
        </div>

        {/* Status label */}
        <div className="text-center">
          <p className="text-white font-body font-bold text-lg mb-1">
            {phase === "idle" && "Tap the mic to talk to Forgie"}
            {phase === "listening" && "Forgie is listening..."}
            {phase === "thinking" && "Forgie is thinking..."}
            {phase === "speaking" && "Forgie is speaking..."}
          </p>

          {/* Transcript */}
          {transcript && (
            <p className="text-white/80 font-body text-sm max-w-md animate-fade-in">
              &ldquo;{transcript}&rdquo;
            </p>
          )}

          {/* Response */}
          {response && phase === "speaking" && (
            <p className="text-gold font-body text-sm max-w-md mt-3 animate-fade-in">
              {response}
            </p>
          )}
        </div>

        {/* Mic button */}
        <button
          onClick={
            phase === "listening"
              ? () => recognitionRef.current?.stop()
              : phase === "idle"
                ? startListening
                : undefined
          }
          disabled={phase === "thinking" || phase === "speaking"}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            phase === "listening"
              ? "bg-red-500 hover:bg-red-600 scale-110"
              : "bg-white/20 hover:bg-white/30",
            (phase === "thinking" || phase === "speaking") && "opacity-50 cursor-not-allowed"
          )}
        >
          {phase === "listening" ? (
            <MicOff size={28} className="text-white" />
          ) : (
            <Mic size={28} className="text-white" />
          )}
        </button>

        {/* Volume bars */}
        {phase === "listening" && (
          <div className="flex items-end gap-1 h-8">
            {Array.from({ length: 12 }).map((_, i) => {
              const h = Math.max(4, Math.min(32, volume * 40 + Math.sin(Date.now() / 200 + i) * 8));
              return (
                <div
                  key={i}
                  className="w-1 rounded-full bg-gold/80 transition-all duration-75"
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getReply(text: string): string {
  const lower = text.toLowerCase();
  const teams = ["brazil", "argentina", "france", "germany", "japan", "united states", "england", "spain", "mexico", "portugal"];
  const found = teams.find((t) => lower.includes(t));

  if (found) {
    const name = found.charAt(0).toUpperCase() + found.slice(1);
    const replies = [
      `${name}! Great pick. I'm firing up the content engine right now. Posters, social copy, hype reel — the works. Check the dashboard in a few seconds!`,
      `Ooh, ${name}! Solid choice. Let me cook up something special for you. Your fan kit is on the way!`,
      `${name} fan? I respect that! Generating your full fan kit now — matchday poster, social captions, voice hype, the whole package!`,
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }

  return "I didn't quite catch a team name there. Try saying something like 'I support Brazil' or 'Let's go Japan!' — any of the 48 World Cup teams!";
}
