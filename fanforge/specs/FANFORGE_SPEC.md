# FanForge — AI World Cup Content Engine

## Coding Agent Master Prompt & Architecture Specification

> **What is this document?** A complete, executable specification for a coding agent (Claude Code, Cursor, etc.) to build FanForge end-to-end. Every section is structured as a directive. Follow sequentially.

---

## 1. Project overview

**FanForge** is a voice-first AI application that generates personalized FIFA World Cup 2026 fan content kits. A user speaks their team allegiance into a microphone, and the system produces a suite of visual and audio assets — matchday posters, fan hype cards, social media carousels, voice narrations, group stage breakdowns, and watch party kits — all styled to the team's visual identity.

**Hackathon context:** Built for the GDG Newport Beach + RocketRide + GMI Cloud hackathon (May 23, 2026). All three sponsor products must be used. The World Cup begins June 11, 2026 — 19 days away. 48 teams, 104 matches, 16 host cities across the US, Canada, and Mexico.

**Core loop (10 seconds to explain):**
1. Fan speaks → "I support Brazil, Vinícius is going to destroy it in Dallas"
2. AI extracts team, player, emotion, language
3. Pipeline fans out: image generation, copy generation, voice synthesis — all in parallel
4. Fan receives a complete content kit, share-ready for Instagram, X, TikTok

---

## 2. Tech stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | Next.js 14 (App Router) + TypeScript | Full-stack React framework, API routes built in |
| **Styling** | Tailwind CSS 3 + custom CSS vars | Design system implementation |
| **Font** | Playfair Display (Google Fonts) | Display headings, titles, card headlines |
| **Body font** | DM Sans or Source Sans 3 | Body text, labels, UI chrome |
| **Orchestration** | RocketRide Server | Pipeline engine — connects all AI nodes |
| **Voice understanding** | NVIDIA Nemotron 3 Nano Omni via GMI Cloud | Audio transcription + emotion/intent extraction |
| **Image generation** | FLUX (Black Forest Labs) via GMI Cloud | Matchday posters, fan cards, social art |
| **Text reasoning** | Google Gemini 3 via Google AI Studio | Search grounding for live stats, schedule data |
| **Creative copy** | DeepSeek V3.2 or Qwen3 via GMI Cloud | Captions, hashtags, prompt engineering |
| **Voice synthesis** | Minimax TTS or ElevenLabs via GMI Cloud | Narrated hype reels |
| **API layer** | Next.js API Routes | Built-in server routes — no separate backend needed |

### API endpoints & keys required

```env
# .env — fill in at hackathon registration
GMI_CLOUD_API_KEY=your_gmi_key
GMI_BASE_URL=https://api.gmi-serving.com/v1
GOOGLE_AI_STUDIO_KEY=your_gemini_key
ROCKETRIDE_HOST=localhost
ROCKETRIDE_PORT=5565
```

### GMI Cloud API pattern (OpenAI-compatible)

All GMI Cloud model calls use the same interface:

```python
import openai

client = openai.OpenAI(
    api_key=GMI_CLOUD_API_KEY,
    base_url="https://api.gmi-serving.com/v1"
)

response = client.chat.completions.create(
    model="deepseek-ai/DeepSeek-V3.2",  # swap model ID as needed
    messages=[{"role": "user", "content": prompt}],
    max_tokens=1000,
    temperature=0.7
)
```

### Google AI Studio pattern

```python
import google.generativeai as genai

genai.configure(api_key=GOOGLE_AI_STUDIO_KEY)
model = genai.GenerativeModel("gemini-3-flash")

response = model.generate_content(
    "What is Argentina's World Cup 2026 group, schedule, and key players?",
    tools=[{"google_search": {}}]  # grounding with live search
)
```

---

## 3. Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)                                        │
│                                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │ Voice    │  │ Team Selector│  │ Content Kit Gallery     │   │
│  │ Recorder │  │ (fallback)   │  │ (posters, cards, audio) │   │
│  └────┬─────┘  └──────┬───────┘  └────────────▲────────────┘   │
│       │               │                       │                  │
│       └───────┬───────┘                       │                  │
│               ▼                               │                  │
│         POST /api/generate                    │                  │
│               │                        GET /api/results/{id}     │
└───────────────┼───────────────────────────────┼──────────────────┘
                │                               │
                ▼                               │
┌──────────────────────────────────────────────────────────────────┐
│  API LAYER (FastAPI)                                             │
│                                                                  │
│  • Receives audio blob or text input                             │
│  • Submits pipeline run to RocketRide                            │
│  • Polls/streams results back to frontend                        │
│  • Stores generated assets in /outputs                           │
└───────────────┬──────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────┐
│  ROCKETRIDE PIPELINE ENGINE                                      │
│                                                                  │
│  ┌─────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │ SOURCE:     │───▶│ NODE 1:          │───▶│ NODE 2:        │  │
│  │ Audio/Text  │    │ Voice Understand │    │ Knowledge      │  │
│  │ Input       │    │ (Nemotron Omni   │    │ Enrichment     │  │
│  │             │    │  via GMI Cloud)  │    │ (Gemini +      │  │
│  └─────────────┘    └──────────────────┘    │  Search)       │  │
│                                              └───────┬────────┘  │
│                                                      │           │
│                                                      ▼           │
│                                     ┌────────────────────────┐   │
│                                     │ NODE 3:                │   │
│                                     │ Creative Director      │   │
│                                     │ (DeepSeek/Qwen on GMI) │   │
│                                     │                        │   │
│                                     │ Generates:             │   │
│                                     │ • Image prompts        │   │
│                                     │ • Social copy          │   │
│                                     │ • Voice script         │   │
│                                     │ • Hashtags             │   │
│                                     └──────────┬─────────────┘   │
│                                                │                  │
│                          ┌─────────────────────┼───────────┐     │
│                          ▼                     ▼           ▼     │
│                   ┌────────────┐     ┌───────────┐  ┌─────────┐ │
│                   │ NODE 4A:   │     │ NODE 4B:  │  │NODE 4C: │ │
│                   │ Image Gen  │     │ Voice TTS │  │Social   │ │
│                   │ (FLUX via  │     │ (Minimax  │  │Copy     │ │
│                   │  GMI Cloud)│     │ via GMI)  │  │Assembly │ │
│                   └─────┬──────┘     └─────┬─────┘  └────┬────┘ │
│                         │                  │             │       │
│                         └──────────┬───────┴─────────────┘       │
│                                    ▼                             │
│                          ┌──────────────────┐                    │
│                          │ NODE 5:          │                    │
│                          │ Composer         │                    │
│                          │ (Assembles kit)  │                    │
│                          └──────────────────┘                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. RocketRide pipeline design

### Pipeline definition (conceptual — adapt to RocketRide's node format)

The pipeline has 6 stages. Stages 4A/4B/4C run in parallel (fan-out), then converge at the Composer (fan-in).

#### Node 1: Voice understanding

- **Input:** Audio blob (WebM/WAV from browser MediaRecorder)
- **Model:** `nvidia/NVIDIA-Nemotron-3-Nano-Omni` on GMI Cloud
- **Extracts:**
  - `team_name` — the national team (e.g., "Brazil")
  - `player_mentions` — specific players named (e.g., ["Vinícius Jr"])
  - `fan_emotion` — intensity level: `casual`, `passionate`, `die-hard`
  - `language` — detected spoken language (for output localization)
  - `raw_transcript` — full text of what was said
- **Fallback:** If voice fails or user prefers, accept a text input with a team dropdown selector.

#### Node 2: Knowledge enrichment

- **Input:** `team_name`, `player_mentions` from Node 1
- **Model:** Gemini 3 Flash via Google AI Studio, with Google Search grounding enabled
- **Fetches (live, real-time):**
  - World Cup 2026 group assignment and opponents
  - Next match date, time, venue, and host city
  - Team's FIFA ranking and recent form
  - Key player stats (goals, assists, caps)
  - Team colors (hex codes), crest description, nickname
  - Cultural keywords (e.g., "samba", "tango", "three lions")
- **Output:** Structured JSON blob — the "team profile"

```json
{
  "team": "Brazil",
  "group": "G",
  "group_opponents": ["Serbia", "Switzerland", "Cameroon"],
  "next_match": {
    "opponent": "Serbia",
    "date": "June 15, 2026",
    "time": "4:00 PM ET",
    "venue": "SoFi Stadium",
    "city": "Los Angeles"
  },
  "colors": { "primary": "#FFDF00", "secondary": "#009739", "accent": "#002776" },
  "nickname": "A Seleção",
  "cultural_keywords": ["samba", "jogo bonito", "carnival"],
  "key_players": [
    { "name": "Vinícius Jr", "position": "LW", "goals": 15, "club": "Real Madrid" }
  ],
  "fifa_ranking": 3,
  "fun_fact": "Brazil is the only team to have played in every World Cup."
}
```

#### Node 3: Creative director

- **Input:** Team profile JSON + fan emotion + player mentions
- **Model:** `deepseek-ai/DeepSeek-V3.2` or `Qwen/Qwen3-235B-A22B-FP8` on GMI Cloud
- **Generates:**

  **a) Image generation prompts** (3 prompts, each tailored for FLUX):
  - Matchday poster prompt (cinematic, stadium atmosphere, team colors)
  - Fan hype card prompt (personalized, dramatic lighting, jersey textures)
  - Social carousel cover prompt (bold typography area, clean composition)

  **b) Social copy package:**
  - Instagram caption (with emoji, CTA, 280 chars max)
  - 10 hashtags (mix of broad + niche: #WorldCup2026 #BrazilWC #ViniJr)
  - Twitter/X post (short, punchy, 180 chars)
  - A hot take / prediction (e.g., "Brazil 3-1 Serbia. Vinícius brace.")

  **c) Voice hype script:**
  - 30-second narration script
  - Written in the fan's detected language
  - Tone adapts to `fan_emotion`: casual = chill narrator, die-hard = stadium announcer energy

  **d) Watch party details:**
  - 3 dishes from the team's national cuisine (name + one-line description)
  - A suggested drink pairing

- **System prompt for this node:**

```
You are a world-class sports creative director. Given a team profile and fan context,
generate compelling visual prompts, social media copy, and a narration script.

Rules:
- Image prompts must be detailed, cinematic, and specify: lighting, camera angle,
  color palette (use exact hex codes), atmosphere, and composition.
- NEVER mention real player likenesses in image prompts — use abstract/symbolic
  representations (jersey number, silhouette, iconic celebration pose).
- Social copy must feel like a real fan wrote it, not a brand.
- Voice script should give chills. Build tension, then release.
- All output in valid JSON matching the schema below.
```

#### Node 4A: Image generation (parallel)

- **Input:** 3 image prompts from Node 3
- **Model:** FLUX (Black Forest Labs) via GMI Cloud (`black-forest-labs/FLUX`)
- **Output:** 3 images (base64 or URL)
- **Settings:** 1024x1024, high quality, 30 inference steps

#### Node 4B: Voice synthesis (parallel)

- **Input:** Voice hype script from Node 3
- **Model:** `minimax-tts-speech-2.6-hd` via GMI Cloud
- **Output:** Audio file (MP3/WAV), 15-30 seconds
- **Voice selection:** Match energy to `fan_emotion`

#### Node 4C: Social copy assembly (parallel)

- **Input:** Social copy package from Node 3 + team profile
- **Processing:** Format text into structured social media post objects with:
  - Platform-specific formatting (IG carousel JSON, X post, TikTok caption)
  - Team colors applied as metadata for frontend rendering

#### Node 5: Composer

- **Input:** All outputs from 4A, 4B, 4C
- **Processing:** Assembles the final content kit JSON:

```json
{
  "kit_id": "uuid",
  "team": "Brazil",
  "created_at": "2026-05-23T14:30:00Z",
  "assets": {
    "matchday_poster": { "url": "...", "width": 1024, "height": 1024 },
    "fan_hype_card": { "url": "...", "width": 1024, "height": 1024 },
    "social_cover": { "url": "...", "width": 1024, "height": 1024 },
    "voice_hype": { "url": "...", "duration_seconds": 28 },
    "social_copy": {
      "instagram": { "caption": "...", "hashtags": [...] },
      "twitter": { "text": "..." },
      "prediction": "Brazil 3-1 Serbia. Vinícius brace."
    },
    "group_breakdown": {
      "group": "G",
      "opponents": [...],
      "ai_prediction": "Brazil tops group with 7 points"
    },
    "watch_party": {
      "dishes": [...],
      "drink": "Caipirinha"
    }
  },
  "team_profile": { ... }
}
```

---

## 5. Design system

### 5.1 Design philosophy

**Aesthetic direction: "Stadium luxury editorial"** — the feeling of a premium matchday program you'd get in a VIP box, blended with the kinetic energy of social media. Think high-end sports magazine meets Instagram Stories. Warm, golden, dramatic.

**Reference dashboards provided by user:**
- Image 1 (Nopeo): Clean sidebar navigation, minimal chrome, generous whitespace, card-based sections with soft shadows
- Image 2 (Learn.io): Warm tones, card grid layout, avatar bar, progress widgets, friendly and energetic
- Image 3 (Yellow Sunset): The mandated color palette

**Key design takeaways to incorporate:**
- Sidebar navigation (collapsed icon rail + expanded labels, like Nopeo)
- Card-based content grid (like Learn.io's course cards)
- Warm, golden atmosphere throughout (from the Yellow Sunset palette)
- Progress/status indicators with soft rounded corners
- Generous padding inside cards (24px+)
- Soft shadows, no harsh borders

### 5.2 Color palette

```css
:root {
  /* Primary palette — Yellow Sunset (user-provided) */
  --color-cream:       #f6e7a1;   /* Lightest — backgrounds, hover states */
  --color-gold:        #f1c40f;   /* Primary accent — CTAs, highlights, active states */
  --color-orange:      #e67e22;   /* Secondary accent — icons, badges, emphasis */
  --color-deep-orange: #d35400;   /* Deepest — headings on light bg, strong emphasis */

  /* Extended neutrals (derived to complement the warm palette) */
  --color-bg-primary:    #fefcf4; /* Off-white with warm tint — page background */
  --color-bg-secondary:  #faf5e4; /* Warm cream — card backgrounds */
  --color-bg-tertiary:   #f5ecd0; /* Deeper cream — sidebar, header */
  --color-surface-dark:  #2c1810; /* Dark warm brown — dark mode or contrast panels */

  --color-text-primary:   #1a0f07; /* Near-black warm — primary text */
  --color-text-secondary: #5c4a3a; /* Warm gray — secondary text, labels */
  --color-text-tertiary:  #8b7355; /* Muted warm — hints, placeholders */
  --color-text-on-gold:   #1a0f07; /* Dark text on gold backgrounds */
  --color-text-on-dark:   #f6e7a1; /* Cream text on dark backgrounds */

  /* Borders */
  --color-border-light:  rgba(213, 52, 0, 0.08);  /* Subtle warm border */
  --color-border-medium: rgba(213, 52, 0, 0.15);  /* Card borders */
  --color-border-strong: rgba(213, 52, 0, 0.25);  /* Active borders */

  /* Semantic colors */
  --color-success:  #27ae60;
  --color-error:    #c0392b;
  --color-info:     #2980b9;

  /* Shadows */
  --shadow-sm:  0 1px 3px rgba(44, 24, 16, 0.06);
  --shadow-md:  0 4px 12px rgba(44, 24, 16, 0.08);
  --shadow-lg:  0 8px 24px rgba(44, 24, 16, 0.12);
  --shadow-xl:  0 16px 48px rgba(44, 24, 16, 0.16);

  /* Layout */
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  14px;
  --radius-xl:  20px;
  --radius-pill: 999px;

  /* Spacing scale (8px base) */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Transitions */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}
```

### 5.3 Typography

```css
/* Import from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

:root {
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;
}

/* Type scale */
.text-display   { font: 700 48px/1.1  var(--font-display); letter-spacing: -0.02em; }
.text-h1        { font: 600 32px/1.2  var(--font-display); letter-spacing: -0.01em; }
.text-h2        { font: 600 24px/1.3  var(--font-display); }
.text-h3        { font: 500 20px/1.3  var(--font-display); }
.text-body      { font: 400 16px/1.6  var(--font-body); }
.text-body-sm   { font: 400 14px/1.5  var(--font-body); }
.text-caption    { font: 500 12px/1.4  var(--font-body); letter-spacing: 0.02em; text-transform: uppercase; }
.text-label     { font: 500 14px/1.4  var(--font-body); }
```

**Rules:**
- Playfair Display for ALL headings, card titles, hero text, team names, and poster typography
- DM Sans for ALL body text, labels, buttons, navigation, captions, metadata
- Never use Playfair below 18px — it loses legibility
- Headings use `--color-deep-orange` or `--color-text-primary`
- Body text uses `--color-text-primary` at 400 weight
- Secondary labels use `--color-text-secondary` at 500 weight

### 5.4 Component specifications

#### Sidebar navigation (inspired by Nopeo reference)

```
┌──────┐
│ 🏟️  │  ← Logo icon (collapsed state)
│      │
│ 🏠  │  Home
│ ⚽  │  Generate
│ 🖼️  │  My Kits
│ 📊  │  Leaderboard
│ ⚙️  │  Settings
│      │
│      │
│ 👤  │  ← User avatar at bottom
└──────┘
```

- **Collapsed:** 64px wide, icon-only, tooltip on hover
- **Expanded:** 240px wide, icon + label, smooth slide transition (300ms, ease-out)
- Background: `--color-bg-tertiary`
- Active item: `--color-gold` left border (3px), `--color-cream` background
- Hover: `--color-cream` background with 150ms transition
- Icons: 20px, `--color-text-secondary`, active = `--color-deep-orange`

#### Voice recorder widget

- **Idle state:** Large circular button (80px), gold border, microphone icon, pulsing glow animation
- **Recording state:** Button fills `--color-deep-orange`, audio waveform visualization around the circle, elapsed time counter
- **Processing state:** Circular progress ring, "Analyzing your team allegiance..." text
- **Fallback:** Below the mic button, a text link: "Or type your team →" that reveals a search input + dropdown of all 48 teams

#### Content kit card

- 320px wide (desktop grid: 3 columns), responsive down to full-width on mobile
- Background: `--color-bg-secondary`
- Border: `--color-border-medium`
- Border radius: `--radius-lg` (14px)
- Padding: `--space-6` (24px)
- Shadow: `--shadow-md`, hover escalates to `--shadow-lg` with 250ms transition
- Image fills top of card with `--radius-lg` on top corners, aspect ratio 1:1
- Title in Playfair Display 20px, `--color-deep-orange`
- Subtitle in DM Sans 14px, `--color-text-secondary`
- Action buttons: "Download" (filled gold) + "Share" (outlined)

#### Social media preview cards

- Rendered as phone-screen mockups (375px viewport inside a rounded device frame)
- Instagram: square image + caption below
- Twitter/X: image card + tweet text
- Each with a "Copy" button and platform-specific share deeplink

#### Watch party kit card

- Split layout: left 60% food images (or styled text cards), right 40% invite graphic
- Each dish: name in Playfair, description in DM Sans, flag emoji of country
- "Generate invite" button → produces a shareable graphic with team colors, date, and location prompt

---

## 6. Page structure

### 6.1 Pages

```
/                     → Landing / Home — hero CTA + recent kits gallery
/generate             → Voice recorder + team selector → triggers pipeline
/kit/:id              → Full kit view — all generated assets in a gallery
/kit/:id/share        → Public shareable view (subset of assets)
/leaderboard          → Community wall of generated kits (stretch goal)
```

### 6.2 Main layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Sidebar │                    Main Content                       │
│  (64px) │                                                       │
│         │  ┌───────────────────────────────────────────────────┐ │
│  Logo   │  │  Top bar: Page title (Playfair) + search + user  │ │
│         │  └───────────────────────────────────────────────────┘ │
│  Nav    │                                                       │
│  items  │  ┌─────────────────────────────────────────────────┐  │
│         │  │                                                 │  │
│         │  │           Page Content Area                     │  │
│         │  │           (scrollable)                          │  │
│         │  │                                                 │  │
│         │  └─────────────────────────────────────────────────┘  │
│         │                                                       │
│  User   │  ┌─────────────────────────────────────────────────┐  │
│  avatar │  │  Footer: "Built with RocketRide + GMI Cloud     │  │
│         │  │          + Google AI Studio" (sponsor logos)     │  │
└─────────┴──┴─────────────────────────────────────────────────┘  │
```

### 6.3 Home page layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  HERO SECTION                                              │  │
│  │                                                            │  │
│  │  "Your team.                         ┌──────────────────┐  │  │
│  │   Your voice.                        │                  │  │  │
│  │   Your content."                     │   🎙️ Speak now   │  │  │
│  │                                      │                  │  │  │
│  │  (Playfair Display, 48px,            │   (Gold circle   │  │  │
│  │   deep-orange on cream bg)           │    button)       │  │  │
│  │                                      └──────────────────┘  │  │
│  │  "Generate a complete World Cup fan kit in seconds"        │  │
│  │  (DM Sans, 16px, text-secondary)                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ── Recent kits ──────────────────────────── View all →          │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Brazil   │  │ Germany  │  │ Japan    │  │ Mexico   │        │
│  │ kit card │  │ kit card │  │ kit card │  │ kit card │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ── How it works ─────────────────────────────────               │
│                                                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐                   │
│  │ 1. Speak  │  │ 2. AI     │  │ 3. Share  │                   │
│  │ your team │→ │ generates │→ │ everywhere│                   │
│  └───────────┘  └───────────┘  └───────────┘                   │
│                                                                  │
│  ── Powered by ───────────────────────────────────               │
│  [RocketRide logo]  [GMI Cloud logo]  [Google AI Studio logo]   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.4 Kit view page (`/kit/:id`)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ← Back to kits         🇧🇷 Brazil Fan Kit         ↗ Share      │
│                         Generated 2 min ago                       │
│                                                                   │
│  ┌─────────────────────────────────┐  ┌────────────────────────┐ │
│  │                                 │  │  GROUP G BREAKDOWN     │ │
│  │    MATCHDAY POSTER              │  │                        │ │
│  │    (hero image, large)          │  │  Brazil vs Serbia      │ │
│  │                                 │  │  Jun 15 · Los Angeles  │ │
│  │    1024x1024, dominant          │  │                        │ │
│  │                                 │  │  Brazil vs Switzerland │ │
│  │    [Download] [Share to IG]     │  │  Jun 20 · Houston      │ │
│  │                                 │  │                        │ │
│  └─────────────────────────────────┘  │  AI Prediction:        │ │
│                                        │  "Brazil tops group"   │ │
│  ┌──────────────┐  ┌──────────────┐   └────────────────────────┘ │
│  │  FAN HYPE    │  │  SOCIAL      │                              │
│  │  CARD        │  │  COVER       │   ┌────────────────────────┐ │
│  │              │  │              │   │  🔊 VOICE HYPE REEL   │ │
│  │  (image)     │  │  (image)     │   │                        │ │
│  │              │  │              │   │  ▶ ━━━━━━━━━━━ 0:28   │ │
│  │  [Download]  │  │  [Download]  │   │                        │ │
│  └──────────────┘  └──────────────┘   │  [Download MP3]        │ │
│                                        └────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  SOCIAL COPY                                                │ │
│  │                                                             │ │
│  │  Instagram  │  Twitter/X  │  Hot Take                       │ │
│  │  ─────────────────────────────────                          │ │
│  │  "🇧🇷 A Seleção is ready to paint    │  [Copy]  [Open IG]  │ │
│  │   Los Angeles yellow and green..."   │                      │ │
│  │                                                             │ │
│  │  #WorldCup2026 #Brazil #ViniJr ...   │  [Copy hashtags]     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  🍽️ WATCH PARTY KIT                                        │ │
│  │                                                             │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐   🍹 Pair with:    │ │
│  │  │Feijoada │  │Pão de   │  │Brigadeiro│   Caipirinha       │ │
│  │  │Black    │  │Queijo   │  │Chocolate │                    │ │
│  │  │bean stew│  │Cheese   │  │truffles  │   [Generate        │ │
│  │  │         │  │bread    │  │          │    invite card]     │ │
│  │  └─────────┘  └─────────┘  └─────────┘                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. File structure

```
fanforge/
├── CLAUDE.md                           # Auto-read by Claude Code
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .env.template
├── .gitignore
│
├── specs/                              # Reference docs (not deployed)
│   ├── FANFORGE_SPEC.md                # This document
│   ├── design-ref-nopeo.png            # Sidebar/nav reference
│   ├── design-ref-learnio.png          # Card layout reference
│   └── color-palette.png               # Yellow Sunset palette
│
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
└── src/
    ├── app/
    │   ├── globals.css                 # Design system (CSS vars, typography, animations)
    │   ├── layout.tsx                  # Root layout + sidebar shell
    │   ├── page.tsx                    # Home — hero + recent kits
    │   ├── generate/
    │   │   └── page.tsx                # Voice recorder + pipeline trigger
    │   ├── kit/
    │   │   └── [id]/
    │   │       ├── page.tsx            # Full kit gallery
    │   │       └── share/
    │   │           └── page.tsx        # Public shareable view (SSR)
    │   └── api/
    │       ├── generate/
    │       │   └── route.ts            # POST — triggers RocketRide pipeline
    │       ├── results/
    │       │   └── [id]/
    │       │       └── route.ts        # GET — fetch kit status/assets
    │       └── health/
    │           └── route.ts            # GET — health check
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx             # Collapsible icon-rail nav
    │   │   ├── TopBar.tsx              # Page title + search + user
    │   │   └── SponsorFooter.tsx       # Sponsor logo bar
    │   ├── voice/
    │   │   ├── VoiceRecorder.tsx       # Mic button + waveform + states
    │   │   ├── AudioVisualizer.tsx     # Real-time waveform canvas
    │   │   └── TeamFallback.tsx        # Text search + 48-team dropdown
    │   ├── kit/
    │   │   ├── KitCard.tsx             # Single kit preview card
    │   │   ├── KitGrid.tsx             # Responsive card grid
    │   │   ├── KitGallery.tsx          # Full kit view with all assets
    │   │   ├── ImageAsset.tsx          # Image card with download/share
    │   │   ├── AudioPlayer.tsx         # Voice hype reel player
    │   │   ├── SocialCopy.tsx          # Tabbed copy section
    │   │   ├── GroupBreakdown.tsx       # Group stage visual bracket
    │   │   └── WatchParty.tsx          # Food cards + invite generator
    │   └── shared/
    │       ├── Button.tsx              # Primary/secondary/ghost variants
    │       ├── Card.tsx                # Base card wrapper
    │       ├── Badge.tsx               # Team badge / status pill
    │       ├── ProgressRing.tsx        # Circular progress for loading
    │       ├── Skeleton.tsx            # Loading skeleton
    │       └── Toast.tsx               # Copy confirmation toasts
    │
    ├── hooks/
    │   ├── useVoiceRecorder.ts         # MediaRecorder API wrapper
    │   ├── usePipeline.ts              # API polling for pipeline status
    │   └── useClipboard.ts             # Copy to clipboard utility
    │
    └── lib/
        ├── gmi.ts                      # GMI Cloud client (OpenAI SDK wrapper)
        ├── gemini.ts                   # Google AI Studio client
        ├── rocketride.ts              # RocketRide TypeScript SDK client
        ├── constants.ts                # 48 teams, flags, routes, model IDs
        └── utils.ts                    # Formatters, date helpers
```

---

## 8. Code conventions

### General

- **Language:** TypeScript throughout — frontend components and API routes in the same codebase. No separate backend.
- **Naming:** `camelCase` for variables/functions, `PascalCase` for components and types, `kebab-case` for CSS classes and file paths.
- **Imports:** Group by: (1) external libraries, (2) internal absolute paths, (3) relative paths. Blank line between groups.
- **Components:** One component per file. Named exports. Props destructured in function signature.
- **State:** React `useState` + `useReducer` for local state. No global state library needed at hackathon scale — prop drill or use React Context for the kit data.
- **Error handling:** Every API call wrapped in try/catch. Display user-friendly error in a Toast component. Log the raw error to console.
- **Comments:** Only where the "why" isn't obvious from the code. Never comment "what" — the code should say that.

### CSS / Tailwind

- Use CSS variables from the design system (Section 5.2) as Tailwind theme extensions in `tailwind.config.js`.
- Prefer Tailwind utility classes for layout (flex, grid, padding, margin).
- Use custom CSS for: animations, complex gradients, the voice recorder waveform, card hover effects.
- Never hardcode colors — always reference CSS variables or Tailwind theme tokens.

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cream:        'var(--color-cream)',
        gold:         'var(--color-gold)',
        orange:       'var(--color-orange)',
        'deep-orange': 'var(--color-deep-orange)',
        'bg-primary':  'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  'var(--radius-sm)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
};
```

### Next.js API Routes

- All API logic lives in `src/app/api/` using the App Router convention.
- Each route exports `GET`, `POST`, etc. as named async functions.
- Use `NextRequest` / `NextResponse` from `next/server`.
- Validate inputs at the top of each handler — return 400 early for bad data.
- No ORM — hackathon uses in-memory `Map<string, Kit>` for generated kits.

### Karpathy guidelines (apply throughout)

1. **Think before coding:** State assumptions before implementing. If a node's behavior is ambiguous, add a comment explaining the chosen interpretation.
2. **Simplicity first:** No speculative abstractions. If a function is used once, inline it. If a config value is used once, hardcode it.
3. **Surgical changes:** When iterating on a component, only touch what's broken. Don't reformat adjacent code.
4. **Goal-driven execution:** Every task should have a verifiable outcome:
   - "Voice recorder works" → verify: click mic, speak, see waveform, get transcript
   - "Pipeline runs" → verify: submit team name, get JSON response with all 5 asset types
   - "Kit renders" → verify: navigate to /kit/:id, see all cards populated with real data

---

## 9. Hackathon demo script (3 minutes)

**Minute 1 — The hook:**
"The World Cup starts in 19 days. 48 teams. Billions of fans. Every single one of them wants to post something on Instagram, but most fans aren't designers. FanForge fixes that."
*[Click mic button, say: "Let's go Mexico, Memo Ochoa forever, we're winning it in Azteca!"]*

**Minute 2 — The magic:**
*[Show the RocketRide pipeline executing in real-time — nodes lighting up as they process]*
"In under 30 seconds, our voice went through Nemotron Omni for understanding, Gemini for live World Cup data, DeepSeek for creative direction, FLUX for image generation, and Minimax for voice synthesis — all orchestrated by RocketRide."
*[Kit gallery loads with all assets]*

**Minute 3 — The business:**
"Every sponsor activation at the World Cup needs custom content for 48 teams across 16 cities. We replace a design agency with one API call. White-label this for Coca-Cola, Adidas, or any sponsor — every generated image carries their watermark. That's earned media at scale."
*[Show the share flow — one tap to Instagram]*

---

## 10. Build priority (for hackathon time constraints)

### Must-have (MVP — build first)

1. Voice recorder component (or text fallback with team dropdown)
2. API endpoint that triggers the pipeline
3. RocketRide pipeline with Nodes 1-3 + 4A (skip 4B voice synth if tight on time)
4. Kit view page showing the matchday poster + social copy
5. Working "Copy to clipboard" for captions and hashtags
6. Sponsor footer with logos

### Should-have (build if time permits)

7. Voice synthesis (Node 4B) with audio player
8. Fan hype card and social cover (additional FLUX generations)
9. Group breakdown component with AI predictions
10. Watch party kit section

### Nice-to-have (stretch goals)

11. Animated voice recorder waveform
12. Social media preview mockups (phone frames)
13. Share-to-platform deeplinks
14. Community leaderboard of generated kits
15. Dark mode toggle

---

## 11. Testing verification checklist

After each build stage, verify:

```
□ Voice recorder captures audio and sends blob to API
□ Text fallback dropdown lists all 48 World Cup teams
□ API returns a kit_id immediately and begins pipeline
□ Node 1 returns team_name + fan_emotion from audio/text
□ Node 2 returns accurate group/schedule data from Gemini
□ Node 3 returns valid JSON with image prompts + social copy
□ Node 4A returns at least 1 generated image from FLUX
□ Composer assembles a complete kit JSON
□ Frontend renders the kit view with real generated assets
□ Download button saves the poster image to device
□ Copy button copies caption text to clipboard
□ Sponsor logos are visible on every page
□ Entire flow completes in under 60 seconds
```

---

*This document is the single source of truth. Build exactly what's specified. When in doubt, favor simplicity and a working demo over feature completeness.*
