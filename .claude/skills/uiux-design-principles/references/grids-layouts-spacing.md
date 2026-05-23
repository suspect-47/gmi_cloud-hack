# Grids, Layouts & Spacing

## Core Concept

Grids provide invisible structure that makes visible content feel organized. Consistent spacing creates rhythm — the visual equivalent of a steady beat. When spacing is arbitrary, the interface feels unprofessional even if no individual element is "wrong."

## Grid Systems

**Column grids** — The most common layout system. Define a number of columns (4 for mobile, 8 for tablet, 12 for desktop), gutters between them, and margins on the edges. Content aligns to column boundaries.

- Mobile: 4 columns, 16px gutters, 16px margins
- Tablet: 8 columns, 24px gutters, 24px margins  
- Desktop: 12 columns, 24px gutters, variable margins (content max-width ~1200px)

**Baseline grids** — All text and spacing aligns to a consistent vertical rhythm (commonly 4px or 8px increments). This creates a sense of visual order even when element heights vary.

**Modular grids** — Columns + rows, creating a matrix of cells. Useful for dashboards, galleries, and card layouts where both horizontal and vertical alignment matter.

## The Spacing Scale

Use a mathematical scale, not arbitrary values. The 4px base scale is the most common:

```
4px  — Hairline spacing (between icon and label)
8px  — Tight spacing (within a compact component)
12px — Related element spacing (between form fields)
16px — Standard spacing (between sections within a card)
24px — Group spacing (between distinct groups)
32px — Section spacing (between major sections)
48px — Large section spacing
64px — Page-level separation
```

The key: pick a scale and never deviate. Arbitrary values (13px, 17px, 22px) break the rhythm.

## Spacing Principles

**Proximity = Relationship.** Elements that are close together are perceived as related (Gestalt). A label 4px above an input clearly belongs to it. A label 24px above could belong to anything.

**Consistent internal padding.** Cards, buttons, inputs, and containers should use the same padding rules. If cards have 16px padding, all cards have 16px padding.

**Outer spacing > Inner spacing.** The space between groups should always be larger than the space between items within a group. This is how you visually communicate structure without borders or dividers.

**White space is intentional.** Generous spacing makes content more readable and the interface more breathable. Resist the urge to fill every pixel. Cramped interfaces feel overwhelming; spacious interfaces feel premium.

## Layout Patterns

**Stack (vertical):** The default mobile pattern. Elements stack top-to-bottom in a single column. Use consistent vertical spacing between items.

**Split (two-column):** Content on one side, supporting info or actions on the other. Common for detail views, settings, and forms on desktop.

**Grid (multi-column):** Cards, tiles, or thumbnails in a repeating grid. Use consistent gap values. Ensure items wrap gracefully at smaller viewports.

**Sidebar + Content:** Navigation or filters in a fixed sidebar, main content in the remaining space. Sidebar collapses to a drawer on mobile.

## Responsive Behavior

- Columns reduce at breakpoints (12 → 8 → 4), but the base spacing unit stays constant
- Elements reflow — side-by-side on desktop becomes stacked on mobile
- Touch targets grow on mobile (more padding, taller rows)
- Margins can be fluid, but gutters and component padding should stay fixed

## Common Failures

- Mixing spacing values with no system (16px here, 18px there, 22px somewhere else)
- Insufficient space between groups — everything looks like one undifferentiated blob
- Content touching the screen edge on mobile (no margin)
- Ignoring the grid for "just one element" — the eye notices misalignment instantly
- Over-reliance on borders/dividers instead of spacing to create separation
