"use client";

import { usePipelineContext } from "@/hooks/PipelineContext";
import { KitGallery } from "@/components/kit/KitGallery";
import { TEAM_FLAGS } from "@/lib/constants";
import { Image, Sparkles } from "lucide-react";

export default function KitsPage() {
  const { kit } = usePipelineContext();

  return (
    <div className="px-8 py-6 max-w-6xl">
      <div className="mb-8">
        <p className="text-caption text-text-tertiary mb-1">Collection</p>
        <h1 className="text-h1 text-deep-orange">My Kits</h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          All your generated fan content kits in one place.
        </p>
      </div>

      {kit ? (
        <div className="space-y-6">
          <div className="glass-card p-4 flex items-center gap-4">
            <span className="text-3xl">{TEAM_FLAGS[kit.team]}</span>
            <div>
              <h2 className="text-h3 text-text-primary">{kit.team} Fan Kit</h2>
              <p className="text-xs text-text-tertiary font-body">
                Generated {new Date(kit.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <KitGallery kit={kit} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-cream flex items-center justify-center mb-6">
            <Image size={36} className="text-text-tertiary" strokeWidth={1.5} />
          </div>
          <h2 className="text-h2 text-text-primary mb-2">No kits yet</h2>
          <p className="text-sm text-text-secondary font-body max-w-md mb-6">
            Use the chat panel to generate your first fan kit. Tell us which
            World Cup team you support and we'll create posters, social copy,
            and more.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-tertiary font-body">
            <Sparkles size={14} />
            <span>Kits are generated using 5 AI models in parallel</span>
          </div>
        </div>
      )}
    </div>
  );
}
