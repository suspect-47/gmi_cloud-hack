---
name: uiux-design-principles
description: >
  Core UI/UX design principles for building intuitive, polished interfaces.
  Covers affordances & signifiers, visual hierarchy, grids/layouts/spacing,
  typography, color theory, dark mode, shadows & elevation, icons & buttons,
  feedback & states, micro-interactions, overlays, and mobile-specific design.
  Use this skill whenever building, reviewing, or improving any user interface —
  web or mobile — and you need principled design reasoning, not just aesthetic
  execution. Also trigger when the user asks for UI/UX feedback, design audits,
  component reviews, accessibility checks on interactive elements, or when
  generating Flutter/React/HTML layouts that need to feel professional and
  intuitive. This skill complements the frontend-design skill: frontend-design
  handles bold aesthetic direction and code output; this skill provides the
  foundational design logic underneath.
---

# UI/UX Design Principles

A decision-making reference for building interfaces that feel intuitive, polished, and professional. Consult this skill to apply principled reasoning — not guesswork — when designing or reviewing UI.

## How to use this skill

Each principle below has a one-paragraph summary. For deeper guidance, implementation patterns, do/don't examples, and platform-specific notes, read the linked reference file in `references/`.

**Read the reference file when:**
- You're actively building or modifying a component that touches that principle
- The user asks for a design review or audit
- You need to resolve a specific design decision (e.g., "should this be a modal or a bottom sheet?")

**Don't read the reference file when:**
- You just need a quick sanity check — the summaries below are enough
- The principle isn't relevant to the current task

---

## 1. Affordances & Signifiers

Elements should communicate what they do through their form. An affordance is what an element *can* do; a signifier is the visual cue that *tells the user* it can do it. Buttons look pressable, text fields look typeable, draggable items have grab handles. If a user needs instructions to understand your UI, the affordances are broken.

→ `references/affordances-signifiers.md`

## 2. Visual Hierarchy

Guide the user's eye to what matters most, then second-most, then third. Hierarchy is established through size, weight, color, contrast, spacing, and position. Every screen should have one clear focal point. If everything is bold, nothing is bold.

→ `references/visual-hierarchy.md`

## 3. Grids, Layouts & Spacing

Consistent spatial structure creates visual rhythm and reduces cognitive load. Use grid systems to align elements. Spacing should follow a scale (4px, 8px, 12px, 16px, 24px, 32px, 48px). White space is a feature, not wasted space — it groups related elements and separates unrelated ones.

→ `references/grids-layouts-spacing.md`

## 4. Typography & Font Sizing

Type is the primary carrier of information. Use a type scale with clear hierarchy (display → heading → subheading → body → caption). Limit to 2 font families max. Line height should be 1.4–1.6× for body text. Measure (line length) should be 45–75 characters for readability.

→ `references/typography.md`

## 5. Color Theory

Color communicates meaning, establishes mood, and creates hierarchy. Build a palette with a primary, secondary, and accent color plus neutrals. Use color functionally: red for destructive, green for success, yellow for warning, blue for info. Ensure 4.5:1 contrast ratio minimum for text (WCAG AA).

→ `references/color-theory.md`

## 6. Dark Mode

Dark mode is not an inverted light mode. It requires its own color system: use dark grays (#121212–#1E1E1E) not pure black, reduce saturation on colors to avoid vibration, use elevation through lighter surfaces rather than shadows, and test all states independently.

→ `references/dark-mode.md`

## 7. Shadows & Elevation

Shadows create depth and communicate layered structure. Higher elevation = more important or more interactive. Use consistent shadow scales that map to semantic levels (e.g., card, dropdown, modal, dialog). Avoid decorative shadows that don't map to a spatial model.

→ `references/shadows-elevation.md`

## 8. Icons & Buttons

Icons should be instantly recognizable or paired with labels. Buttons are the primary action affordance — their visual weight should match their importance (filled > outlined > text). Maintain minimum touch targets (48×48dp mobile, 44×44pt iOS). Group related actions; isolate destructive ones.

→ `references/icons-buttons.md`

## 9. Feedback & States

Every interactive element needs visible states: default, hover, focused, active, disabled, loading, error, and success. Users should never wonder "did that work?" Provide immediate visual feedback for every action. Loading states should appear within 100ms; use skeleton screens over spinners for content.

→ `references/feedback-states.md`

## 10. Micro-Interactions

Small, purposeful animations that confirm actions, reveal state changes, or guide attention. Structure: trigger → rules → feedback → loops/modes. Keep them 120–220ms for UI responses. They should feel *functional*, not decorative. Respect `prefers-reduced-motion` for accessibility.

→ `references/micro-interactions.md`

## 11. Overlays

Modals, bottom sheets, dialogs, drawers, tooltips, and popovers. Choose based on the complexity and urgency of the content. Modals interrupt flow — use sparingly for confirmations and critical decisions. Bottom sheets are the preferred mobile pattern for non-blocking secondary content. Always provide a clear dismiss path.

→ `references/overlays.md`

## 12. Mobile Design

Mobile is not "desktop but smaller." It has its own constraints: thumb-driven input, limited viewport, variable connectivity, platform conventions (Material Design / HIG). Bottom-centric navigation, 48×48dp minimum touch targets, progressive disclosure, and offline-first thinking are foundational.

→ `references/mobile-design.md`

---

## Quick Decision Framework

When making any UI decision, run through this checklist:

1. **Is the purpose clear?** (Affordances & Signifiers)
2. **Is the most important thing the most visible?** (Visual Hierarchy)
3. **Is the spacing consistent and intentional?** (Grids & Spacing)
4. **Is the text readable and well-scaled?** (Typography)
5. **Does the color serve a function?** (Color Theory)
6. **Does it work in both light and dark?** (Dark Mode)
7. **Does depth communicate structure?** (Shadows & Elevation)
8. **Are actions obvious and tappable?** (Icons & Buttons)
9. **Does the user always know what's happening?** (Feedback & States)
10. **Do animations serve the interaction?** (Micro-Interactions)
11. **Is layered content presented appropriately?** (Overlays)
12. **Does it work under a thumb on a 6" screen?** (Mobile Design)
