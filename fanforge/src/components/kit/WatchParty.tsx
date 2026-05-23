"use client";

import { Card } from "@/components/shared/Card";
import { TEAM_FLAGS } from "@/lib/constants";
import { Utensils } from "lucide-react";

interface WatchPartyProps {
  team: string;
  dishes?: { name: string; description: string }[];
  drink?: string;
}

export function WatchParty({ team, dishes, drink }: WatchPartyProps) {
  const flag = TEAM_FLAGS[team] || "🏳️";

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Utensils size={18} className="text-deep-orange" />
        <h3 className="text-h3 text-deep-orange">Watch Party Kit</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {(dishes || []).map((dish) => (
          <div
            key={dish.name}
            className="bg-cream rounded-lg p-3 text-center"
          >
            <span className="text-lg">{flag}</span>
            <p className="font-display font-medium text-sm text-text-primary mt-1">
              {dish.name}
            </p>
            <p className="text-xs text-text-secondary mt-0.5 font-body">
              {dish.description}
            </p>
          </div>
        ))}
      </div>

      {drink && (
        <div className="flex items-center gap-2 text-sm">
          <span>🍹</span>
          <span className="text-text-secondary font-body">Pair with:</span>
          <span className="font-body font-medium text-text-primary">
            {drink}
          </span>
        </div>
      )}
    </Card>
  );
}
