"use client";

import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { useClipboard } from "@/hooks/useClipboard";
import { useToast } from "@/components/shared/Toast";
import { Copy, Check, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialCopyProps {
  instagram?: string;
  hashtags?: string[];
  twitter?: string;
  hotTake?: string;
}

type Tab = "instagram" | "twitter" | "hottake";

export function SocialCopy({
  instagram,
  hashtags,
  twitter,
  hotTake,
}: SocialCopyProps) {
  const [activeTab, setActiveTab] = useState<Tab>("instagram");
  const { copied, copy } = useClipboard();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    copy(text);
    toast("Copied to clipboard!");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "instagram", label: "Instagram", icon: <Instagram size={14} /> },
    { id: "twitter", label: "Twitter/X", icon: <Twitter size={14} /> },
    { id: "hottake", label: "Hot Take", icon: <span>🔥</span> },
  ];

  const content: Record<Tab, string> = {
    instagram: instagram || "Caption generating...",
    twitter: twitter || "Post generating...",
    hottake: hotTake || "Prediction generating...",
  };

  return (
    <Card>
      <h3 className="text-h3 text-deep-orange mb-4">Social Copy</h3>

      <div className="flex gap-1 mb-4 border-b border-[var(--color-border-light)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-body font-medium transition-all border-b-2",
              activeTab === tab.id
                ? "border-gold text-deep-orange"
                : "border-transparent text-text-tertiary hover:text-text-secondary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-sm text-text-primary font-body leading-relaxed whitespace-pre-wrap">
          {content[activeTab]}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={() => handleCopy(content[activeTab])}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </Button>

        {activeTab === "instagram" && hashtags && hashtags.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleCopy(hashtags.join(" "))}
          >
            <Copy size={14} />
            Copy hashtags
          </Button>
        )}
      </div>

      {activeTab === "instagram" && hashtags && hashtags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-orange font-body bg-cream px-2 py-0.5 rounded-pill"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
