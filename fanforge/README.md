# FanForge — AI World Cup Content Engine

> Speak your team. Get a complete FIFA World Cup 2026 fan content kit in seconds.

Built at the GDG Newport Beach × RocketRide × GMI Cloud hackathon.

---

## Quick start

```bash
# 1. Clone and install
cd fanforge
npm install

# 2. Set up API keys
cp .env.template .env.local
# Then edit .env.local with your keys:
#   GMI_CLOUD_API_KEY    → from https://console.gmicloud.ai
#   GOOGLE_AI_STUDIO_KEY → from https://aistudio.google.com/apikey

# 3. Run
npm run dev
# Open http://localhost:3000
```

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS 3 + CSS custom properties |
| Fonts | Playfair Display + DM Sans |
| Orchestration | RocketRide Server |
| Voice AI | Nemotron 3 Nano Omni (GMI Cloud) |
| Image Gen | FLUX (GMI Cloud) |
| Reasoning | Gemini 3 Flash (Google AI Studio) |
| Creative | DeepSeek V3.2 (GMI Cloud) |
| TTS | Minimax (GMI Cloud) |

## Project structure

```
fanforge/
├── CLAUDE.md               ← Coding agent reads this automatically
├── specs/
│   ├── FANFORGE_SPEC.md    ← Full architecture + design system
│   ├── design-ref-*.png    ← UI reference screenshots
│   └── color-palette.png   ← Yellow Sunset palette
├── src/
│   ├── app/                ← Pages + API routes (Next.js App Router)
│   ├── components/         ← React components
│   ├── hooks/              ← Custom hooks
│   └── lib/                ← API clients + constants
└── tailwind.config.ts      ← Theme tokens matching design system
```

## License

Built for hackathon demonstration purposes.
