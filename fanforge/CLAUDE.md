# FanForge — AI World Cup Content Engine

## What is this?

FanForge is a voice-first AI app that generates personalized FIFA World Cup 2026 fan content kits. A user speaks their team → AI produces matchday posters, fan hype cards, social media copy, voice narrations, and watch party kits — all styled to the team's visual identity.

## Read before coding

- **Full spec:** `specs/FANFORGE_SPEC.md` — architecture, pipeline design, component specs, page wireframes, and build priority. This is the single source of truth.
- **Design references:** `specs/design-ref-*.png` — UI inspiration for sidebar nav, card layouts, and overall dashboard feel.
- **Color palette:** `specs/color-palette.png` — Yellow Sunset palette: `#f6e7a1`, `#f1c40f`, `#e67e22`, `#d35400`

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS 3 + CSS variables defined in `src/app/globals.css`
- **Fonts:** Playfair Display (headings) + DM Sans (body) via Google Fonts
- **AI orchestration:** RocketRide Server (pipeline engine)
- **AI models (all via GMI Cloud, OpenAI-compatible):**
  - Voice understanding: `nvidia/NVIDIA-Nemotron-3-Nano-Omni`
  - Image generation: FLUX (Black Forest Labs)
  - Creative copy: `deepseek-ai/DeepSeek-V3.2`
  - Voice synthesis: `minimax-tts-speech-2.6-hd`
- **Google AI Studio:** Gemini 3 Flash with Search grounding for live World Cup data
- **GMI Cloud base URL:** `https://api.gmi-serving.com/v1` (OpenAI SDK drop-in)

## Architecture

```
React Frontend → Next.js API Routes → RocketRide Pipeline → GMI Cloud + Google AI Studio
```

Pipeline nodes (see spec Section 4 for full detail):
1. Voice Understanding (Nemotron Omni)
2. Knowledge Enrichment (Gemini + Search)
3. Creative Director (DeepSeek/Qwen)
4A. Image Generation (FLUX) ─┐
4B. Voice Synthesis (Minimax) ├─ parallel
4C. Social Copy Assembly     ─┘
5. Composer (assembles final kit)

## Design system

- **Aesthetic:** "Stadium luxury editorial" — premium matchday program meets Instagram
- **Palette:** Warm golden tones from Yellow Sunset (#f6e7a1 → #d35400) with warm brown neutrals
- **All CSS variables** are in `src/app/globals.css` — never hardcode colors
- **All Tailwind extensions** are in `tailwind.config.ts` — use theme tokens
- **Sidebar nav:** Collapsible icon-rail (64px collapsed → 240px expanded), inspired by specs/design-ref-nopeo.png
- **Cards:** 14px border-radius, 24px padding, warm shadow, hover lifts to larger shadow
- **Typography rules:** Playfair never below 18px. DM Sans for everything else.

## Code conventions

- One component per file, named exports
- `camelCase` vars, `PascalCase` components, `kebab-case` CSS
- Every API call in try/catch with user-friendly Toast on error
- No speculative abstractions — if it's used once, inline it
- Comments explain "why", never "what"
- Verify each feature works before moving to the next (see spec Section 11)

## Build priority (hackathon)

1. Voice recorder or text fallback with team dropdown
2. API route that triggers the pipeline
3. RocketRide pipeline: Nodes 1→2→3→4A minimum
4. Kit view page showing matchday poster + social copy
5. Copy-to-clipboard for captions/hashtags
6. Sponsor footer (RocketRide + GMI Cloud + Google AI Studio logos)

Then if time: voice synthesis, additional images, group breakdown, watch party kit.

## Key files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Complete design system (CSS vars, typography, animations) |
| `src/lib/gmi.ts` | GMI Cloud client (wraps OpenAI SDK) |
| `src/lib/gemini.ts` | Google AI Studio client |
| `src/lib/rocketride.ts` | RocketRide SDK client (build this) |
| `src/lib/constants.ts` | Team data, model IDs, 48-team list |
| `src/app/api/generate/route.ts` | POST endpoint — triggers pipeline |
| `src/app/api/results/[id]/route.ts` | GET endpoint — fetch kit assets |
