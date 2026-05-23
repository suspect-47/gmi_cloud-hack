# Affordances & Signifiers

## Core Concepts

**Affordance** — the action an object makes possible. A button affords pressing. A slider affords dragging. A text field affords typing. Affordances exist whether or not the user perceives them.

**Signifier** — the perceptible cue that communicates an affordance to the user. A drop shadow on a button signifies it can be pressed. Placeholder text in a field signifies it accepts input. Signifiers are what the user actually *sees* and interprets.

The critical insight: an affordance without a signifier is a hidden feature. A signifier without an affordance is a lie. Both are UX failures.

## Types of Affordances

**Explicit** — The element's appearance makes its function obvious. A raised button with a label, a toggle switch, a text input with a border and placeholder. These work for all users regardless of tech literacy.

**Pattern-based** — The element follows a convention users already know. A hamburger icon means menu. A heart icon means like/favorite. A trash can means delete. These work because of learned behavior, not inherent form.

**Hidden** — The interaction exists but has no visible signifier until discovered. Swipe-to-delete, long-press menus, pull-to-refresh. These reduce clutter but risk users never discovering the feature. Use sparingly, and always provide an alternative explicit path.

**False** — The element looks interactive but isn't. Underlined text that isn't a link, a card that looks tappable but doesn't respond, a disabled button with no visual distinction. These erode trust and cause frustration.

## Design Rules

1. **Make interactive elements look interactive.** Buttons should have depth, contrast, or containment. Links should be visually distinct from body text. Tappable areas should have clear boundaries.

2. **Use signifiers to reinforce, not replace.** Don't rely solely on color to signal interactivity — pair it with shape, weight, or iconography. Color alone fails for colorblind users.

3. **Match affordance strength to action importance.** Primary actions get the strongest affordances (filled buttons, prominent placement). Secondary actions get moderate treatment (outlined buttons, smaller text). Tertiary actions can be more subtle (text links, icon-only buttons with tooltips).

4. **Don't hide essential actions behind hidden affordances.** If a feature is core to the user journey, it needs an explicit signifier. Hidden gestures are shortcuts, not primary navigation.

5. **Test with fresh eyes.** The team that builds the UI knows where everything is. New users don't. If a user needs a tutorial to operate your interface, the signifiers are insufficient.

## Common Failures

- Flat design taken too far — buttons that look like labels, links that look like body text
- Ghost buttons (outlined, low-contrast) used for primary actions
- Relying on hover states as the only signifier (fails on touch devices entirely)
- Placeholder text as the only label (disappears on focus, inaccessible)
- Icon-only buttons without tooltips or labels for non-universal icons

## Platform Notes

- **iOS (HIG):** Emphasizes text-based buttons, tint colors as action signifiers, and minimal chrome. Affordances lean heavily on color and typography.
- **Android (Material Design):** Uses elevation, ripple effects, and containment (FABs, filled buttons) as primary signifiers. More explicit in affordance communication.
- **Web:** Must account for both mouse (hover) and touch (no hover). Ensure all hover-revealed signifiers have a visible resting state too.
