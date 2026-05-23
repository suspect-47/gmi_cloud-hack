# Dark Mode

## Core Concept

Dark mode is not `filter: invert(1)`. It requires a parallel design system with its own color decisions, contrast relationships, and elevation model. Inverting a light theme produces washed-out text, vibrating colors, and broken hierarchy. Dark mode must be designed from the ground up.

## Surface Colors

Use dark grays, not pure black:

```
Background:      #121212 (Material baseline) or #0F0F0F–#1A1A1A
Surface 1:       #1E1E1E (cards, bottom sheets)
Surface 2:       #252525 (elevated cards, dropdowns)
Surface 3:       #2C2C2C (dialogs, modals)
Surface 4:       #333333 (highest elevation)
```

Why not pure black (#000000)? On OLED screens, pure black next to any color creates a smearing effect during scroll. On LCD screens, pure black feels like a void rather than a surface. Dark gray maintains the sense of a physical material.

## Text on Dark Surfaces

- **Primary text:** White at 87% opacity (#DEDEDE) — not pure white (#FFFFFF), which is too harsh and causes halation (glow around text)
- **Secondary text:** White at 60% opacity (#999999)
- **Disabled text:** White at 38% opacity (#616161)

Test at multiple brightness levels. Dark mode users often use their devices in low-light environments where even small contrast differences are magnified.

## Color Adjustments

**Reduce saturation.** Fully saturated colors that work on light backgrounds vibrate and cause eye strain on dark surfaces. Desaturate by 10–20% or use lighter tints of the same hue.

**Lighten primary colors.** A primary blue that's #1976D2 in light mode might need to shift to #64B5F6 (lighter, less saturated) in dark mode to maintain the same perceptual prominence.

**Semantic colors need adjustment too.** Error red, success green, warning yellow — all need lighter, desaturated variants for dark mode. The standard light-mode red on a dark background is a searing visual alarm.

**Avoid large areas of saturated color.** A blue header bar that works in light mode becomes an overwhelming glow in dark mode. Use it sparingly or desaturate.

## Elevation Model

In light mode, elevation is communicated through shadows (higher = more shadow). In dark mode, shadows on dark surfaces are nearly invisible. Instead, elevation is communicated through **surface lightness** — higher surfaces are lighter.

```
Elevation 0:  #121212 (base background)
Elevation 1:  #1E1E1E (1dp — cards)
Elevation 2:  #222222 (2dp — app bars)
Elevation 4:  #272727 (4dp — dropdowns)
Elevation 8:  #2C2C2C (8dp — dialogs)
Elevation 16: #333333 (16dp — modals)
```

This replaces shadow-based hierarchy with value-based hierarchy.

## Borders and Dividers

Borders and dividers in dark mode should be subtle — white at 12–15% opacity or a very dark gray (#2A2A2A–#333333). Heavy borders on dark backgrounds create a wireframe/caged feeling.

## Images and Media

- Images generally look fine on dark backgrounds but may need slightly reduced brightness or a subtle overlay if they're very bright and dominate the dark interface
- Icons should use the same color tokens as text (primary, secondary, disabled)
- Illustrations may need a dark-mode variant if they contain light backgrounds

## Implementation

- Define all colors as semantic tokens, not raw hex values. `--color-surface`, `--color-text-primary`, `--color-border` — swapped at the theme level.
- Test both modes independently. Don't just QA in light mode and assume dark mode works.
- Provide a system-preference-following option (prefers-color-scheme) plus a manual toggle
- Persist the user's choice across sessions

## Common Failures

- Inverting the light theme and calling it done — produces broken contrast and hierarchy
- Pure black backgrounds with pure white text — maximum contrast creates eye strain
- Unchanged saturated colors that vibrate against dark surfaces
- Using shadows for elevation — they're invisible in dark mode
- Forgetting to test error/warning/success states in dark mode
- Light mode screenshots and media that blind users when the rest of the UI is dark
