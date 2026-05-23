/* ─── Routes ────────────────────────────────────────────────── */

export const ROUTES = {
  HOME:     "/",
  GENERATE: "/generate",
  KIT:      (id: string) => `/kit/${id}`,
  SHARE:    (id: string) => `/kit/${id}/share`,
} as const;

/* ─── FIFA World Cup 2026 — All 48 qualified teams ─────────── */

export const TEAMS = [
  "Argentina", "Australia", "Austria", "Belgium",
  "Bolivia", "Brazil", "Cameroon", "Canada",
  "Chile", "Colombia", "Costa Rica", "Croatia",
  "Czech Republic", "Denmark", "Ecuador", "Egypt",
  "England", "France", "Germany", "Ghana",
  "Indonesia", "Iran", "Iraq", "Italy",
  "Ivory Coast", "Jamaica", "Japan", "Mexico",
  "Morocco", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Panama", "Paraguay", "Peru",
  "Poland", "Portugal", "Qatar", "Saudi Arabia",
  "Scotland", "Senegal", "Serbia", "South Africa",
  "South Korea", "Spain", "Switzerland", "Trinidad and Tobago",
  "Tunisia", "Türkiye", "Ukraine", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Wales",
] as const;

export type TeamName = (typeof TEAMS)[number];

/* ─── Team emoji flags (subset for display) ─────────────────── */

export const TEAM_FLAGS: Record<string, string> = {
  Argentina: "🇦🇷", Australia: "🇦🇺", Austria: "🇦🇹", Belgium: "🇧🇪",
  Bolivia: "🇧🇴", Brazil: "🇧🇷", Cameroon: "🇨🇲", Canada: "🇨🇦",
  Chile: "🇨🇱", Colombia: "🇨🇴", "Costa Rica": "🇨🇷", Croatia: "🇭🇷",
  "Czech Republic": "🇨🇿", Denmark: "🇩🇰", Ecuador: "🇪🇨", Egypt: "🇪🇬",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", France: "🇫🇷", Germany: "🇩🇪", Ghana: "🇬🇭",
  Indonesia: "🇮🇩", Iran: "🇮🇷", Iraq: "🇮🇶", Italy: "🇮🇹",
  "Ivory Coast": "🇨🇮", Jamaica: "🇯🇲", Japan: "🇯🇵", Mexico: "🇲🇽",
  Morocco: "🇲🇦", Netherlands: "🇳🇱", "New Zealand": "🇳🇿", Nigeria: "🇳🇬",
  Norway: "🇳🇴", Panama: "🇵🇦", Paraguay: "🇵🇾", Peru: "🇵🇪",
  Poland: "🇵🇱", Portugal: "🇵🇹", Qatar: "🇶🇦", "Saudi Arabia": "🇸🇦",
  Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", Senegal: "🇸🇳", Serbia: "🇷🇸", "South Africa": "🇿🇦",
  "South Korea": "🇰🇷", Spain: "🇪🇸", Switzerland: "🇨🇭",
  "Trinidad and Tobago": "🇹🇹", Tunisia: "🇹🇳", "Türkiye": "🇹🇷",
  Ukraine: "🇺🇦", "United States": "🇺🇸", Uruguay: "🇺🇾",
  Uzbekistan: "🇺🇿", Venezuela: "🇻🇪", Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

/* ─── Kit asset types ───────────────────────────────────────── */

export const ASSET_TYPES = {
  MATCHDAY_POSTER: "matchday_poster",
  FAN_HYPE_CARD:   "fan_hype_card",
  SOCIAL_COVER:    "social_cover",
  VOICE_HYPE:      "voice_hype",
  SOCIAL_COPY:     "social_copy",
  GROUP_BREAKDOWN: "group_breakdown",
  WATCH_PARTY:     "watch_party",
} as const;
