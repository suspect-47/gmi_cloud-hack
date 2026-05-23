# Feedback & States

## Core Concept

Users should never wonder "did that work?" Every action must produce visible feedback. Every element must communicate its current state. Silence from the interface is interpreted as broken, not as working.

## Response Time Thresholds

These thresholds come from human perception research and should guide what feedback to provide:

- **0–100ms:** Feels instant. No explicit feedback needed beyond the element's active/pressed state.
- **100ms–1s:** Noticeable delay. Show a subtle indicator: button loading state, progress shimmer, or inline spinner.
- **1–10s:** Feels slow. Show a progress bar, skeleton screen, or percentage. Give the user confidence it's working.
- **10s+:** Risk of abandonment. Show progress with time estimate. Allow cancellation. Consider moving to background processing with a notification on completion.

## Element States

Every interactive element should define these states:

**Default** — The resting, uninteracted state. Clean and stable.

**Hover** — Desktop only. Subtle visual change on cursor hover: background tint, underline, slight scale. Signals interactivity.

**Focused** — Keyboard/accessibility state. A visible outline or ring that clearly indicates which element is selected. Never remove focus indicators (`outline: none` without a replacement is an accessibility violation).

**Active/Pressed** — The momentary state during a tap or click. Brief color change, scale reduction, or ripple effect.

**Disabled** — Element is present but unavailable. Reduced opacity (38–50%), non-interactive cursor, no hover/focus response. When possible, include a tooltip or nearby text explaining *why* it's disabled and what would enable it.

**Loading** — The action is in progress. Replace or augment the element's content with a spinner, progress bar, or shimmer. Maintain the element's dimensions to prevent layout shift.

**Error** — Something went wrong. Red border, error icon, and descriptive error message. Place the message near the element that caused the error, not in a distant toast.

**Success** — The action completed. Green check, brief success message, or state transition (button text changes to "Saved ✓" then fades back). Don't over-celebrate — a persistent success banner for routine actions is annoying.

**Empty** — No data to display. Show an illustration or icon, a short explanation, and a CTA to populate the view. Empty states are an opportunity, not a dead end.

## Loading Patterns

**Skeleton screens** — Gray placeholder shapes matching the layout of the incoming content. Preferred for content loading because they set expectations about what's coming and feel faster than spinners.

**Shimmer/Pulse** — Animated gradient or opacity pulse on skeleton elements. Signals active loading rather than a broken page.

**Spinners** — Best for discrete actions (submit button, loading overlay) where the content layout isn't predictable. Avoid full-screen spinners that block interaction.

**Progress bars** — For operations with measurable progress: uploads, downloads, multi-step processes. Determinate (with percentage) is always better than indeterminate (looping).

**Optimistic UI** — Immediately show the expected result while the server confirms in the background. Toggle switches, likes/favorites, adding items to a list. If the server rejects, revert with an error message. This makes the interface feel dramatically faster.

## Error Handling

1. **Prevent errors before they happen.** Input validation in real-time (format hints, character counts), disabled submit until required fields are valid, confirmation dialogs for destructive actions.

2. **Show errors at the point of failure.** Inline validation messages below the offending field, not in a generic alert at the top of the page. Users shouldn't have to hunt for what went wrong.

3. **Use human language.** "Please enter a valid email address" not "Error 422: Validation failed on field 'email'." Error messages should explain the problem and suggest the fix.

4. **Persist errors until resolved.** Don't auto-dismiss error messages on a timer. The user may not have seen them. Errors clear when the user fixes the input or retries the action.

5. **Distinguish severity.** Validation warnings (yellow, "This name is already taken") vs. system errors (red, "Connection failed, please retry") vs. blocking errors (modal, "Your session has expired").

## Feedback Channels

- **Visual** — Color changes, animations, icons, text. The primary channel for all UI feedback.
- **Motion** — Subtle animation to draw attention to state changes. A shake for invalid input, a bounce for success, a slide for reveal. Keep under 300ms for responsiveness.
- **Haptic** — On mobile: light tap for confirmations, heavier pulse for errors or warnings. Maps physical sensation to action outcome. Use iOS/Android haptic APIs.
- **Sound** — Rarely appropriate in apps (users are often in public). Acceptable for messaging (send/receive), alarms, and critical alerts. Always provide a mute option.

## Common Failures

- No loading state — user clicks, nothing visible happens, they click again (double submission)
- Full-screen loading spinners that block all interaction for minor data fetches
- Error messages that disappear after 3 seconds before the user reads them
- Empty states with just "No data" and no guidance on what to do next
- Disabled buttons with no explanation of what would enable them
- Success feedback that's so subtle the user doesn't notice (a brief flash of green)
- Inconsistent patterns — skeleton screens for one page, spinners for another, nothing for a third
