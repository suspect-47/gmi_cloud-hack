"use client";

import { useState, useCallback } from "react";

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

export function usePipeline() {
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

  return { status, kit, error, generate, reset };
}
