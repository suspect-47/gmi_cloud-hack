"use client";

import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Download, Share2, ImageIcon } from "lucide-react";

interface ImageAssetProps {
  title: string;
  imageUrl: string | null;
  prompt?: string;
}

export function ImageAsset({ title, imageUrl, prompt }: ImageAssetProps) {
  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="aspect-square bg-cream flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-text-tertiary p-6">
            <ImageIcon size={40} strokeWidth={1.5} />
            <p className="text-xs text-center font-body leading-relaxed max-w-[200px]">
              {prompt
                ? prompt.slice(0, 120) + "..."
                : "Image generating..."}
            </p>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-h3 text-deep-orange mb-3">{title}</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            <Download size={14} />
            Download
          </Button>
          <Button variant="secondary" size="sm" disabled={!imageUrl}>
            <Share2 size={14} />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
}
