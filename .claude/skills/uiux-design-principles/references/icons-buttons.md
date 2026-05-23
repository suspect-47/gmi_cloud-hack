# Icons & Buttons

## Icons

### Purpose

Icons serve three roles: **identification** (app icon, brand mark), **navigation** (back, menu, tabs), and **action** (delete, share, edit). An icon should be instantly recognizable for its role — if it needs a paragraph of explanation, use a text label instead.

### Universal vs. Contextual Icons

**Universal** — Recognized without labels: search (magnifying glass), home (house), settings (gear), back (left arrow), close (X), menu (hamburger/three lines), share (branching arrow), heart/star (favorite). These can stand alone.

**Contextual** — Meaningful only in context or with labels: filter (funnel), analytics (chart), archive (box), tag (price tag). Always pair these with text labels, at minimum a tooltip.

**Ambiguous** — Icons that mean different things in different apps: the three dots (more? settings? menu?), the grid icon (gallery? apps? categories?). Be explicit with these.

### Design Rules

1. **Pair with labels when space allows.** Icon + label is always clearer than icon alone. Reserve icon-only treatment for universally understood symbols in space-constrained contexts (toolbars, tab bars).

2. **Consistent style.** Don't mix outlined and filled icons randomly. Use one style system: outlined for navigation/inactive, filled for selected/active is a clean convention.

3. **Optical sizing.** Icons at 16px and icons at 24px shouldn't just be scaled versions. Smaller icons need thicker strokes and simplified detail. Most icon libraries handle this, but verify.

4. **Touch target ≠ Visual size.** A 20px icon can have a 48px touch target with padding. The visual can be small; the tappable area must not be.

5. **Alignment.** Icons should optically align with adjacent text, not mathematically align. Round icons (circles, hearts) may need slight vertical offset to look centered next to text baselines.

## Buttons

### Button Hierarchy

Buttons have a visual weight hierarchy that maps to action importance:

```
Filled (Primary)     → One per screen/section. The main CTA.
Outlined (Secondary)  → Supporting actions. "Cancel," "Back," alternate options.
Text (Tertiary)       → Low-emphasis actions. "Skip," "Learn more," "See all."
Icon-only            → Space-constrained actions. Always with tooltip.
```

If a screen has multiple filled buttons, the hierarchy is broken. The user doesn't know which one matters most.

### Sizing

- **Large (48–56px height):** Hero CTAs, form submit buttons, onboarding flows
- **Medium (36–44px height):** Standard in-context actions, dialog buttons
- **Small (28–32px height):** Inline actions, table rows, compact UI

Minimum touch target: 48×48dp (Android Material), 44×44pt (iOS HIG). Even if the visual button is small, the tappable area must meet this minimum.

### Button Content

- **Label text should describe the outcome**, not the mechanism. "Save changes" > "Submit." "Delete account" > "Confirm." "Get started" > "Click here."
- **Sentence case** for button labels. Title Case looks formal but is harder to scan. ALL CAPS works only for very short labels in specific design systems.
- **Icon + Label** when the action benefits from visual reinforcement. "Download" with a download icon. But don't add icons to every button — it creates noise.

### States

Every button must have visible states:

- **Default:** The resting state
- **Hover:** Slight background or opacity change (desktop only)
- **Focus:** Visible focus ring for keyboard navigation (accessibility requirement)
- **Active/Pressed:** Depressed or contrasted state confirming the tap/click
- **Loading:** Replace label with spinner or progress indicator. Keep button width stable.
- **Disabled:** Reduced opacity (0.38–0.5) and non-interactive cursor. Use sparingly — prefer hiding unavailable actions or explaining why they're unavailable.

### Placement Patterns

- **Primary action right, secondary left** (in dialogs and forms) — follows the natural reading direction to end on the action
- **Destructive actions isolated** — physically separate from safe actions, often in red or with a confirmation step
- **Sticky/fixed CTAs** on mobile for critical actions (checkout, save, send) so they're always reachable without scrolling
- **FABs (Floating Action Buttons)** for the single most common action in a view — one per screen maximum

## Common Failures

- Multiple filled/primary buttons competing for attention
- Icon-only buttons for non-universal actions without any label or tooltip
- Disabled buttons with no explanation of what would enable them
- Buttons too small for comfortable touch (below 44pt)
- Using a link style for something that performs an action (buttons act, links navigate)
- Color-only button differentiation (fails for colorblind users)
