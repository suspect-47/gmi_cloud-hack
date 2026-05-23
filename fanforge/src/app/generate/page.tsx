"use client";

import { TopBar } from "@/components/layout/TopBar";
import { TeamFallback } from "@/components/voice/TeamFallback";
import { usePipelineContext } from "@/hooks/PipelineContext";
import { useToast } from "@/components/shared/Toast";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { KitGallery } from "@/components/kit/KitGallery";
import { MessageSquare } from "lucide-react";

export default function GeneratePage() {
  const { status, kit, error, generate } = usePipelineContext();
  const { toast } = useToast();

  const handleTextSubmit = async (team: string, message: string) => {
    const result = await generate({ team, message });
    if (result) {
      toast("Kit generated!");
    }
  };

  const isProcessing = status === "submitting" || status === "processing";

  return (
    <div>
      <TopBar
        title="Generate Fan Kit"
        subtitle="Use the chat panel on the right, or type your team below"
      />

      <div className="max-w-3xl mx-auto px-8 py-10">
        {status === "complete" && kit ? (
          <KitGallery kit={kit} />
        ) : (
          <div className="flex flex-col items-center gap-8">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-6 py-16 animate-fade-in">
                <ProgressRing size={80} stroke={4} />
                <div className="text-center">
                  <h2 className="text-h2 text-deep-orange mb-2">
                    Building your kit...
                  </h2>
                  <p className="text-text-secondary font-body max-w-md">
                    AI pipeline running — generating images, voice, and copy.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="glass-card p-6 w-full flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-orange flex items-center justify-center shrink-0">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary font-body">
                      Fastest way: use the chat panel
                    </p>
                    <p className="text-xs text-text-tertiary font-body">
                      Type your team in the chat on the right — voice input
                      supported too.
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  <p className="text-caption text-text-tertiary mb-3">
                    Or search below
                  </p>
                  <TeamFallback
                    onSubmit={handleTextSubmit}
                    disabled={isProcessing}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-body w-full">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
