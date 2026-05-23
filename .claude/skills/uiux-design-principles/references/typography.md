# Typography & Font Sizing

## Core Concept

Typography carries 90%+ of the information in most interfaces. It's not decoration — it's the primary communication channel. Good typography is invisible (users read the content, not the font). Bad typography is immediately felt (fatigue, confusion, distrust).

## The Type Scale

A type scale defines the size steps available in your system. Use a mathematical ratio rather than arbitrary sizes. Common ratios:

- **1.125 (Major Second):** Subtle steps, good for dense data UIs
- **1.200 (Minor Third):** Moderate contrast, versatile for most apps
- **1.250 (Major Third):** Strong contrast, good for marketing/content
- **1.333 (Perfect Fourth):** Dramatic steps, good for editorial

Example scale at 1.250 ratio with 16px base:

```
Caption:    12px / 0.75rem
Body Small: 14px / 0.875rem
Body:       16px / 1rem (base)
Subheading: 20px / 1.25rem
Heading 3:  25px / 1.563rem
Heading 2:  31px / 1.953rem
Heading 1:  39px / 2.441rem
Display:    49px / 3.052rem
```

Limit to 6–8 sizes. If you need more, the hierarchy is probably unclear.

## Font Selection

**Two families maximum.** One for headings (can be expressive), one for body (must be highly readable). Using a single family with weight variation is also a clean approach.

**Body text requirements:** High x-height, open counters, clear distinction between similar characters (Il1, O0), good rendering at 14–16px. Sans-serifs dominate screen typography for good reason.

**Heading text:** Can afford more personality. Serifs, geometric sans-serifs, or display fonts work here because they're rendered at larger sizes where readability is less constrained.

**Avoid:** Fonts with poor hinting at small sizes, overly decorative fonts for UI text, fonts with limited weight ranges (you need at least regular, medium, semibold, bold).

## Line Height (Leading)

- **Body text:** 1.4–1.6× the font size. 16px body → 22–26px line height.
- **Headings:** 1.1–1.3× the font size. Tighter because large text has more inherent visual space.
- **Captions/Labels:** 1.3–1.4× the font size.
- **Single-line UI elements** (buttons, nav items): Match line height to the component height for vertical centering.

## Measure (Line Length)

The optimal line length for body text is 45–75 characters per line (including spaces). Shorter feels choppy; longer causes the eye to lose its place when jumping to the next line.

- Mobile naturally constrains line length — usually fine at full width minus margins
- Desktop needs explicit max-width constraints on text blocks (e.g., `max-width: 65ch`)
- Wide monitors with full-width text are the most common readability failure on the web

## Weight as Hierarchy

Use font weight to create hierarchy within a single size:

- **Bold (700):** Titles, emphasis, key data points
- **Semibold (600):** Subheadings, labels, navigation items
- **Medium (500):** Secondary emphasis, button text
- **Regular (400):** Body text, descriptions, supporting content

Avoid using more than 3 weights on a single screen. Weight differences should be at least 2 steps apart to be perceptible (400 vs 600, not 400 vs 500).

## Color & Contrast

- Primary text: High contrast (87–100% opacity against background)
- Secondary text: Medium contrast (60–70% opacity) — used for descriptions, timestamps, metadata
- Disabled/placeholder text: Low contrast (38–45% opacity) — visually recessive
- Minimum: WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold)

## Common Failures

- Too many font sizes with no scale — every element has a bespoke size
- Body text too small (below 14px on mobile is straining for most users)
- Insufficient contrast between hierarchy levels (all text looks the same weight/size)
- Line length uncontrolled on desktop — text spanning 120+ characters per line
- Using all-caps for long strings (fine for short labels, unreadable for sentences)
- Letter-spacing too tight on body text or too loose on headings
