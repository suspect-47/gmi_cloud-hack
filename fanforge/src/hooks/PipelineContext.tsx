"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type PipelineStatus = "idle" | "submitting" | "processing" | "complete" | "error";

export interface Kit {
  kit_id: string;
  team: string;
  created_at: string;
  status: string;
  team_profile: any;
  creative: any;
  assets: {
    matchday_poster: { prompt?: string; url: string | null };
    fan_hype_card: { prompt?: string; url: string | null };
    social_cover: { prompt?: string; url: string | null };
    voice_hype: { script?: string; url: string | null };
    social_copy: {
      instagram_caption?: string;
      hashtags?: string[];
      twitter_post?: string;
      hot_take?: string;
    };
    group_breakdown: {
      group?: string;
      opponents?: string[];
      ai_prediction?: string;
    };
    watch_party: {
      dishes?: { name: string; description: string }[];
      drink?: string;
    };
  };
}

interface PipelineContextValue {
  status: PipelineStatus;
  kit: Kit | null;
  error: string | null;
  generate: (input: {
    team: string;
    message?: string;
    transcript?: string;
  }) => Promise<Kit | null>;
  reset: () => void;
}

const Ctx = createContext<PipelineContextValue | null>(null);

export function PipelineProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PipelineStatus>("idle");
  const [kit, setKit] = useState<Kit | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (input: { team: string; message?: string; transcript?: string }) => {
      setStatus("submitting");
      setError(null);

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Pipeline failed");
        }

        const data = await res.json();
        setKit(data.kit);
        setStatus("complete");
        return data.kit as Kit;
      } catch (err: any) {
        setError(err.message);
        setStatus("error");
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setKit(null);
    setError(null);
  }, []);

  return (
    <Ctx.Provider value={{ status, kit, error, generate, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePipelineContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePipelineContext must be used within PipelineProvider");
  return ctx;
}
