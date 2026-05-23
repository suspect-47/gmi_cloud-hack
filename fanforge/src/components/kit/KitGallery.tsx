"use client";

import { ImageAsset } from "./ImageAsset";
import { AudioPlayer } from "./AudioPlayer";
import { SocialCopy } from "./SocialCopy";
import { GroupBreakdown } from "./GroupBreakdown";
import { WatchParty } from "./WatchParty";
import type { Kit } from "@/hooks/PipelineContext";

interface KitGalleryProps {
  kit: Kit;
}

export function KitGallery({ kit }: KitGalleryProps) {
  const { assets, team, team_profile } = kit;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ImageAsset
            title="Matchday Poster"
            imageUrl={assets.matchday_poster?.url}
            prompt={assets.matchday_poster?.prompt}
          />
        </div>
        <div>
          <GroupBreakdown
            team={team}
            group={assets.group_breakdown?.group}
            opponents={assets.group_breakdown?.opponents}
            prediction={assets.group_breakdown?.ai_prediction}
            nextMatch={team_profile?.next_match}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ImageAsset
          title="Fan Hype Card"
          imageUrl={assets.fan_hype_card?.url}
          prompt={assets.fan_hype_card?.prompt}
        />
        <ImageAsset
          title="Social Cover"
          imageUrl={assets.social_cover?.url}
          prompt={assets.social_cover?.prompt}
        />
        <AudioPlayer
          audioUrl={assets.voice_hype?.url}
          script={assets.voice_hype?.script}
        />
      </div>

      <SocialCopy
        instagram={assets.social_copy?.instagram_caption}
        hashtags={assets.social_copy?.hashtags}
        twitter={assets.social_copy?.twitter_post}
        hotTake={assets.social_copy?.hot_take}
      />

      <WatchParty
        team={team}
        dishes={assets.watch_party?.dishes}
        drink={assets.watch_party?.drink}
      />
    </div>
  );
}
