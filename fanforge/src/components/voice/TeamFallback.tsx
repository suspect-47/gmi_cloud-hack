"use client";

import { useState, useMemo } from "react";
import { TEAMS, TEAM_FLAGS } from "@/lib/constants";
import { Button } from "@/components/shared/Button";
import { Search } from "lucide-react";

interface TeamFallbackProps {
  onSubmit: (team: string, message: string) => void;
  disabled?: boolean;
}

export function TeamFallback({ onSubmit, disabled }: TeamFallbackProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return [...TEAMS];
    return TEAMS.filter((t) =>
      t.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSelect = (team: string) => {
    setSelected(team);
    setQuery(team);
    setShowDropdown(false);
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
        />
        <input
          type="text"
          placeholder="Search 48 World Cup teams..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected("");
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-9 pr-4 py-2.5 rounded-md border border-[var(--color-border-medium)] bg-bg-secondary font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold focus:shadow-gold-glow transition-all"
        />
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute top-full mt-1 left-0 right-0 bg-bg-secondary border border-[var(--color-border-medium)] rounded-lg shadow-warm-lg max-h-48 overflow-y-auto z-20">
            {filtered.map((team) => (
              <li key={team}>
                <button
                  type="button"
                  onClick={() => handleSelect(team)}
                  className="w-full text-left px-4 py-2 text-sm font-body hover:bg-cream transition-colors flex items-center gap-2"
                >
                  <span>{TEAM_FLAGS[team] || ""}</span>
                  <span>{team}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="text-lg">{TEAM_FLAGS[selected]}</span>
            <span className="font-medium text-text-primary">{selected}</span>
          </div>
          <textarea
            placeholder={`Hype up ${selected}! Name your favorite player, make a prediction...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-md border border-[var(--color-border-medium)] bg-bg-secondary font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-gold resize-none"
          />
          <Button
            onClick={() => onSubmit(selected, message)}
            disabled={disabled}
            size="lg"
            className="w-full"
          >
            Generate Fan Kit
          </Button>
        </div>
      )}
    </div>
  );
}
