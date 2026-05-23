# Color Theory

## Core Concept

Color is not decoration. In UI, color communicates meaning, establishes hierarchy, signals interactivity, and creates emotional context. A thoughtful palette with 5–7 purposeful colors will outperform a palette of 20 colors applied inconsistently.

## Building a Palette

A functional UI palette has these layers:

**Primary** — The brand color. Used for primary CTAs, active states, key highlights. Should be the most saturated and attention-grabbing color in the system.

**Secondary** — A complementary or analogous color to the primary. Used for secondary actions, accents, or to differentiate categories. Should not compete with primary for attention.

**Neutral scale** — A gray ramp from near-white to near-black (typically 8–10 steps). This is the backbone — backgrounds, text, borders, dividers, disabled states. Most of the interface is neutral.

**Semantic colors** — Functional colors mapped to meaning:
- **Red / Destructive:** Errors, deletions, critical warnings
- **Green / Success:** Confirmations, completions, positive states
- **Yellow-Orange / Warning:** Caution, attention needed, non-critical alerts
- **Blue / Info:** Informational messages, links, neutral highlights

**Surface colors** — Background tints for cards, sections, and containers. Subtle variations of the neutral scale or very desaturated tints of the primary/secondary.

## Color Relationships

**Complementary** (opposite on the color wheel) — Maximum contrast, high energy. Use for accent-against-neutral, not for large adjacent areas (visual vibration).

**Analogous** (adjacent on the wheel) — Harmonious and calm. Good for related categories or gradients. Low inherent contrast — needs value differences to create hierarchy.

**Triadic** (evenly spaced on the wheel) — Balanced and vibrant. Works for multi-category systems (charts, tags) but requires careful saturation management.

**Monochromatic** (single hue, varying lightness/saturation) — Elegant and unified. Strong for minimal interfaces. Add a single complementary accent for action elements.

## The 60-30-10 Rule

A practical distribution for any interface:
- **60% Neutral** — Backgrounds, containers, body text
- **30% Secondary** — Cards, sections, secondary UI elements
- **10% Primary/Accent** — CTAs, active states, key highlights

This prevents color overload while ensuring the accent actually stands out.

## Accessibility

**WCAG AA Contrast Ratios (minimum):**
- Normal text (< 18px): 4.5:1 against background
- Large text (≥ 18px or ≥ 14px bold): 3:1 against background
- UI components and graphical objects: 3:1 against adjacent colors

**Color should never be the sole indicator.** Pair color with icons, text labels, or patterns. Red error text should also have an error icon. Green success should also say "Success." ~8% of men have some form of color vision deficiency.

**Test your palette** with a colorblindness simulator (protanopia, deuteranopia, tritanopia). If two functional colors become indistinguishable, add a secondary differentiator.

## Applying Color to UI

- **Interactive elements** get the primary color. Non-interactive text stays neutral.
- **Backgrounds** should be the lightest or most neutral. Avoid tinting large backgrounds with saturated color — it fatigues the eye.
- **Data visualization** needs its own sub-palette: 5–8 distinct, accessible colors for charts. These can differ from the UI palette.
- **Status indicators** always use semantic colors. Don't repurpose red for a non-error meaning or green for something that isn't positive.
- **Hover/Focus states** darken or lighten the base color by 10–15%, not swap to an entirely different color.

## Common Failures

- Using brand color everywhere — primary CTAs, headers, backgrounds, icons — until it means nothing
- Insufficient neutral range — too few gray steps, so borders look like backgrounds and disabled looks like active
- Semantic color collision — using red as a brand accent when red also means "error"
- Pure black (#000000) text on pure white (#FFFFFF) — too harsh for extended reading. Use off-black (#1A1A1A–#333333) on off-white (#F8F8F8–#FFFFFF) for body text.
- Relying on opacity for color variants instead of defining explicit color tokens — opacity interacts unpredictably with different backgrounds
