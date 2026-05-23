"use client";

import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { TEAM_FLAGS } from "@/lib/constants";
import { Calendar, MapPin } from "lucide-react";

interface GroupBreakdownProps {
  team: string;
  group?: string;
  opponents?: string[];
  prediction?: string;
  nextMatch?: {
    opponent: string;
    date: string;
    time: string;
    venue: string;
    city: string;
  };
}

export function GroupBreakdown({
  team,
  group,
  opponents,
  prediction,
  nextMatch,
}: GroupBreakdownProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 text-deep-orange">
          Group {group || "?"} Breakdown
        </h3>
        <Badge variant="gold">Group {group}</Badge>
      </div>

      {opponents && opponents.length > 0 && (
        <div className="space-y-2 mb-4">
          {opponents.map((opp) => (
            <div
              key={opp}
              className="flex items-center justify-between py-2 border-b border-[var(--color-border-light)] last:border-0"
            >
              <div className="flex items-center gap-2">
                <span>{TEAM_FLAGS[team] || "🏳️"}</span>
                <span className="text-sm font-body font-medium text-text-primary">
                  {team}
                </span>
                <span className="text-xs text-text-tertiary">vs</span>
                <span>{TEAM_FLAGS[opp] || "🏳️"}</span>
                <span className="text-sm font-body font-medium text-text-primary">
                  {opp}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {nextMatch && (
        <div className="bg-cream rounded-lg p-3 mb-4">
          <p className="text-caption text-orange mb-1">Next Match</p>
          <p className="text-sm font-body font-medium text-text-primary">
            {team} vs {nextMatch.opponent}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {nextMatch.date} &middot; {nextMatch.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {nextMatch.venue}, {nextMatch.city}
            </span>
          </div>
        </div>
      )}

      {prediction && (
        <div className="flex items-start gap-2">
          <span className="text-sm">🤖</span>
          <p className="text-sm text-text-secondary font-body italic">
            {prediction}
          </p>
        </div>
      )}
    </Card>
  );
}
