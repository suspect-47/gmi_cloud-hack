"use client";

import { useState } from "react";
import { Settings, Palette, Volume2, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
  const [voiceId, setVoiceId] = useState("Carter");
  const [imageStyle, setImageStyle] = useState("cinematic");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="px-8 py-6 max-w-3xl">
      <div className="mb-8">
        <p className="text-caption text-text-tertiary mb-1">Preferences</p>
        <h1 className="text-h1 text-deep-orange">Settings</h1>
        <p className="text-sm text-text-secondary font-body mt-1">
          Customize your FanForge experience.
        </p>
      </div>

      <div className="space-y-6">
        {/* Voice */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 size={18} className="text-orange" />
            <h2 className="text-h3 text-text-primary">Voice Settings</h2>
          </div>
          <label className="block mb-2 text-sm font-body text-text-secondary">
            Narrator Voice
          </label>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/50 border border-white/60 text-sm font-body text-text-primary focus:outline-none focus:border-gold/40"
          >
            <option value="Alex">Alex — Energetic male</option>
            <option value="Carter">Carter — Radio announcer</option>
            <option value="Dennis">Dennis — Smooth male</option>
            <option value="Luna">Luna — Warm female</option>
            <option value="Ashley">Ashley — Natural female</option>
          </select>
        </div>

        {/* Image style */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={18} className="text-orange" />
            <h2 className="text-h3 text-text-primary">Image Style</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "cinematic", label: "Cinematic" },
              { id: "retro", label: "Retro" },
              { id: "minimalist", label: "Minimalist" },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setImageStyle(style.id)}
                className={`px-4 py-3 rounded-lg border text-sm font-body transition-all ${
                  imageStyle === style.id
                    ? "border-gold bg-gold/10 text-deep-orange font-semibold"
                    : "border-white/50 text-text-secondary hover:border-gold/30"
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe size={18} className="text-orange" />
            <h2 className="text-h3 text-text-primary">Language</h2>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/50 border border-white/60 text-sm font-body text-text-primary focus:outline-none focus:border-gold/40"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="pt">Português</option>
            <option value="ar">العربية</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-orange" />
              <h2 className="text-h3 text-text-primary">Notifications</h2>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? "bg-gold" : "bg-cream"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-warm-sm transition-transform ${
                  notifications ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <p className="text-xs text-text-tertiary font-body mt-2">
            Get notified when your kit is ready.
          </p>
        </div>
      </div>
    </div>
  );
}
