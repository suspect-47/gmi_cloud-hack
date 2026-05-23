"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";
import { Play, Pause, Download, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string | null;
  script?: string;
  duration?: number;
}

export function AudioPlayer({ audioUrl, script, duration }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100
    );
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Volume2 size={18} className="text-deep-orange" />
        <h3 className="text-h3 text-deep-orange">Voice Hype Reel</h3>
      </div>

      {audioUrl ? (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              setPlaying(false);
              setProgress(0);
            }}
          />
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-text-on-gold hover:bg-orange transition-colors"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="flex-1 h-1.5 bg-cream rounded-full overflow-hidden">
              <div
                className="h-full bg-deep-orange rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-text-tertiary font-body">
              {duration ? `0:${duration.toString().padStart(2, "0")}` : "0:28"}
            </span>
          </div>
          <Button size="sm">
            <Download size={14} />
            Download MP3
          </Button>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
              <Play size={18} className="text-text-tertiary" />
            </div>
            <div className="flex-1 h-1.5 bg-cream rounded-full" />
            <span className="text-xs text-text-tertiary">--:--</span>
          </div>
          {script && (
            <p className="text-xs text-text-tertiary italic leading-relaxed">
              &ldquo;{script.slice(0, 200)}...&rdquo;
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
