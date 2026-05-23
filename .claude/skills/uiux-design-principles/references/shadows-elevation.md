# Shadows & Elevation

## Core Concept

Shadows simulate physical depth. They tell users which elements float above others, which are interactive, and what the spatial structure of the interface is. Shadows should be part of a system — not applied ad hoc for decoration.

## The Elevation Scale

Define a set of elevation levels mapped to semantic use cases:

```
Level 0 (0dp)   — Flat on the surface. Body content, backgrounds.
Level 1 (1-2dp) — Slightly raised. Cards, list items, input fields.
Level 2 (4dp)   — Elevated. App bars, search bars, snackbars.
Level 3 (8dp)   — Floating. Dropdowns, menus, bottom navigation.
Level 4 (16dp)  — Overlay. Dialogs, bottom sheets, modals.
Level 5 (24dp)  — Highest. Popovers, toasts, FAB pressed state.
```

Higher elevation = more visual prominence = more likely to be interactive or temporary.

## Shadow Anatomy

A shadow has four properties: X offset, Y offset, blur radius, and color/opacity. Effective UI shadows combine 2–3 shadow layers:

**Key shadow** — A small, sharp, directional shadow. Simulates direct light. Creates crispness and definition. Small blur, slight Y offset.

**Ambient shadow** — A large, soft, diffuse shadow. Simulates ambient/environmental light. Creates the sense of floating. Large blur, no or minimal offset.

**Example (Level 2 card):**
```css
box-shadow:
  0 1px 3px rgba(0, 0, 0, 0.12),   /* key shadow */
  0 4px 12px rgba(0, 0, 0, 0.08);  /* ambient shadow */
```

## Shadow Scale Examples

```css
/* Level 1 — Cards, inputs */
box-shadow: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.10);

/* Level 2 — Elevated cards, app bars */
box-shadow: 0 2px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08);

/* Level 3 — Dropdowns, menus */
box-shadow: 0 4px 6px rgba(0,0,0,0.07), 0 12px 24px rgba(0,0,0,0.10);

/* Level 4 — Dialogs, modals */
box-shadow: 0 8px 16px rgba(0,0,0,0.08), 0 20px 40px rgba(0,0,0,0.12);

/* Level 5 — Maximum elevation */
box-shadow: 0 12px 28px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.14);
```

## Principles

**Light direction is consistent.** All shadows in the interface should suggest the same light source (typically top or top-left). Mixed light directions look unnatural.

**Elevation changes on interaction.** A card at Level 1 can rise to Level 2 on hover. A FAB at Level 3 rises to Level 5 on press. This physical metaphor reinforces interactivity.

**Higher elevation = less permanent.** Modals and dropdowns float high because they're temporary. Cards sit low because they're persistent content. This maps to users' spatial intuition.

**Shadows are subtle.** The best shadows are barely noticed — they just make the interface feel "right." If a shadow is the first thing you notice about a component, it's too heavy.

## Dark Mode Considerations

Shadows are nearly invisible on dark surfaces. In dark mode, elevation is communicated through surface color instead (lighter = higher). See `dark-mode.md` for the elevation-to-surface color mapping.

You can still use very subtle shadows in dark mode for a small amount of edge definition, but they shouldn't be the primary elevation signal.

## Common Failures

- Using only one shadow value for everything — no elevation hierarchy
- Shadows with visible hard edges (insufficient blur)
- Colored shadows (blue shadow on a blue card) — looks unnatural in most contexts
- Shadows on elements that shouldn't be elevated (body text, inline labels)
- Missing shadow transitions — elevation should animate smoothly on state change
- Inconsistent light direction — some shadows go down, others go right
