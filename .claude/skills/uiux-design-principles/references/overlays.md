# Overlays

## Core Concept

Overlays are UI layers that appear above the base content: modals, bottom sheets, dialogs, drawers, tooltips, popovers, snackbars, and toasts. They interrupt or supplement the current flow. The choice of overlay type should match the content's urgency, complexity, and relationship to the underlying screen.

## Overlay Types

### Modal / Dialog
**Purpose:** Require user attention and decision before proceeding.
**When to use:** Confirmations ("Delete this item?"), critical input (login, payment), blocking decisions the user can't defer.
**Behavior:** Blocks interaction with the content behind (scrim/overlay). Requires explicit dismissal (button, not just tapping outside for destructive actions). Traps focus for keyboard navigation.
**Sizing:** Content-sized, never full-screen on desktop. Centered vertically and horizontally. Max-width ~480–560px for simple dialogs, ~640–800px for complex ones.

### Bottom Sheet
**Purpose:** Present secondary content or actions without leaving the current context.
**When to use:** Filters, sort options, share menus, quick actions, detail previews on mobile. The preferred mobile pattern for non-blocking overlays.
**Behavior:** Slides up from the bottom. Can be dismissed by swiping down or tapping the scrim. May have snap points (peek, half, full). Content behind remains partially visible.
**Sizing:** Width = screen width on mobile. Height varies by content, with snap points at ~30%, ~50%, ~90% of screen height. On desktop, bottom sheets are less common — consider a side panel or popover instead.

### Drawer / Side Panel
**Purpose:** Navigation or contextual tools that persist alongside content.
**When to use:** App navigation (hamburger menu), settings panels, detail views in master-detail layouts, filters on desktop.
**Behavior:** Slides in from the left (navigation) or right (detail/context). Can be persistent (always visible) or temporary (over content with scrim). Push layout or overlay — choose based on whether the content behind needs to remain interactive.

### Tooltip
**Purpose:** Brief explanatory text for a single element.
**When to use:** Explaining icon-only buttons, abbreviations, truncated text, or non-obvious UI elements. Desktop-primary (hover-triggered).
**Behavior:** Appears on hover (desktop) or long-press (mobile) after a short delay (~300ms). Disappears when the trigger is removed. Non-interactive — users can't click into a tooltip.
**Content:** 1–2 short sentences maximum. No links, no actions, no complex content. If you need more, use a popover.

### Popover
**Purpose:** Contextual content or actions anchored to a trigger element.
**When to use:** Dropdown menus, date pickers, color pickers, rich tooltips with interactive content.
**Behavior:** Appears on click/tap, anchored to the trigger element. Dismisses on outside click or Escape. Can contain interactive content (buttons, links, inputs).
**Positioning:** Auto-positions to stay within the viewport (flip top/bottom, shift left/right). Arrow points to the trigger element.

### Snackbar / Toast
**Purpose:** Brief, non-blocking status messages.
**When to use:** Action confirmations ("Item saved"), undo opportunities ("Message deleted — Undo"), non-critical notifications.
**Behavior:** Appears at the bottom of the screen (Material) or top (iOS). Auto-dismisses after 4–8 seconds. One at a time — don't stack. May contain a single text action ("Undo", "View").
**Content:** One line of text + optional action. Never critical information — the user might not see it.

## Choosing the Right Overlay

```
Does the user MUST respond before continuing?
  → Yes → Modal / Dialog
  → No  →
    Is it brief status feedback?
      → Yes → Snackbar / Toast
      → No  →
        Is it secondary content or actions on mobile?
          → Yes → Bottom Sheet
          → No  →
            Is it anchored to a specific element?
              → Yes, brief text → Tooltip
              → Yes, interactive → Popover
              → No  → Drawer / Side Panel
```

## Principles

1. **Minimize interruption.** Modals are the nuclear option. If the content can be a bottom sheet, make it a bottom sheet. If it can be inline, make it inline. Every overlay adds cognitive overhead.

2. **Always provide a clear exit.** Close button (X), swipe-to-dismiss, tap-on-scrim, Escape key. Blocking the user in an overlay with no visible exit is hostile. Exception: truly critical confirmations (data loss prevention) can require explicit button press.

3. **Scrim communicates blockage.** A dark scrim (black at 40–60% opacity) behind a modal tells the user the content behind is temporarily inaccessible. A lighter or absent scrim on a bottom sheet says the context is still there.

4. **Manage focus.** When an overlay opens, focus should move to the first interactive element inside it. When it closes, focus should return to the trigger element. This is critical for keyboard and screen reader users.

5. **Prevent scroll-through.** When a modal or full-height bottom sheet is open, the content behind should not scroll. Scroll lock the body.

6. **Animate entrances and exits.** Modals: fade in + slight scale-up. Bottom sheets: slide up. Drawers: slide from the edge. Exit reverses the entrance. Duration: 200–300ms.

7. **Don't stack overlays.** A modal opening a modal opening a tooltip is a UX disaster. If you need nested overlays, reconsider the information architecture.

## Common Failures

- Using modals for content that could be inline or a bottom sheet
- Toast messages for critical errors (user misses them)
- No way to dismiss — overlay with no close button, no scrim tap, no escape
- Overlays that don't manage focus — keyboard users are stranded
- Stacking overlays — modal → modal → confirmation dialog
- Full-screen modals on desktop (wastes space, feels like a page hijack)
- Bottom sheets on desktop without adapting to a more appropriate pattern
