# Mobile Design

## Core Concept

Mobile is not desktop on a smaller screen. It has fundamentally different constraints: touch input (imprecise, thumb-driven), limited viewport (ruthless prioritization), variable context (distracted users, poor connectivity), and platform conventions (Material Design on Android, Human Interface Guidelines on iOS). Designing for mobile means designing for these realities, not adapting desktop patterns.

## Thumb-Driven Design

75% of phone interactions use a single thumb (Hoober, 2025). The comfortable reach zone is the bottom third of the screen plus a curve along the side closest to the dominant hand. Everything above the midpoint requires a grip shift or second hand.

**Design implications:**
- Primary actions at the bottom. Navigation bars, CTAs, and frequently used controls belong in the lower third.
- Secondary/infrequent actions can live higher. Settings, search, profile — acceptable in the top area because they're accessed less often.
- Bottom sheets > top-anchored modals for any content the user interacts with frequently.
- Avoid placing primary actions in the top corners — the hardest area to reach one-handed.

### Touch Targets

Minimum interactive area sizes:
- **Android (Material Design):** 48 × 48dp with 8dp spacing between targets
- **iOS (HIG):** 44 × 44pt minimum
- **WCAG 2.2:** 24 × 24px absolute minimum (Level AA), 44 × 44px recommended (Level AAA)

The visual element can be smaller than the touch target. A 24px icon can have a 48dp tappable area through padding. But the tap target itself must meet the minimum.

**Testing:** Tap the interface with your non-dominant thumb. If you misfire frequently, the targets are too small or too close together.

## Navigation Patterns

### Bottom Tab Bar
The standard mobile navigation pattern. 3–5 tabs maximum. Each tab represents a top-level destination. The active tab is visually distinct (filled icon, color, label). Labels are always visible — don't hide labels to "save space."

### Navigation Drawer (Hamburger Menu)
Hides secondary navigation behind a menu icon. Appropriate for 6+ destinations, but discoverable only to users who know to look for it. Consider a bottom tab bar with a "More" tab instead.

### Bottom Sheets for Sub-Navigation
Filters, sort options, and contextual actions presented in a swipe-up sheet. Preferred over dropdown menus on mobile because they're easier to reach and dismiss.

### Swipe/Gesture Navigation
Swipe between tabs, swipe to go back, swipe to reveal actions. Powerful but must be discoverable — always provide a visible alternative (button, tab). Gesture navigation should supplement, not replace, visible controls.

## Content Prioritization

Mobile viewport forces ruthless prioritization. You cannot show everything at once.

**Progressive disclosure:** Show the essential information first. Reveal details on demand (expand, tap-through, "See more"). Don't front-load every data point.

**One primary action per screen.** If a screen has multiple equally prominent CTAs, the user hesitates. Define the one thing you want them to do and make it visually dominant.

**Vertical scrolling is natural.** Users expect to scroll vertically. Long pages are fine if the content justifies it. Horizontal scrolling is acceptable only for carousels, image galleries, and tab chips — never for primary content flow.

**Information density trade-off.** Dense screens are efficient for power users but overwhelming for new users. Default to spacious layouts. Provide density options or let users learn shortcuts over time.

## Platform Conventions

### iOS (Human Interface Guidelines)
- Navigation: Large titles that collapse on scroll, tab bars at bottom, back buttons top-left
- Actions: Text-based buttons with system tint color, swipe actions, context menus on long-press
- Typography: SF Pro, Dynamic Type support for accessibility
- Modality: Sheets (slide up from bottom), alerts (centered), popovers (iPad)
- Haptics: UIImpactFeedbackGenerator, UINotificationFeedbackGenerator — expected for toggles, confirmations, errors

### Android (Material Design 3)
- Navigation: Bottom navigation bar, navigation drawer, top app bar with actions
- Actions: FAB for primary action, filled/outlined/text buttons, icon buttons
- Typography: Roboto default, Material type scale (display, headline, title, body, label)
- Modality: Bottom sheets (standard, modal), dialogs, snackbars
- Haptics: HapticFeedbackConstants — lighter convention than iOS

### Cross-Platform (Flutter)
- Flutter allows shared codebase but platform adaptation is critical
- Use `Platform.isIOS` / `Platform.isAndroid` for platform-specific behavior
- Cupertino widgets for iOS feel, Material widgets for Android
- Or use adaptive widgets that automatically match the platform
- Don't force Material Design on iOS users or HIG on Android users — it feels foreign

## Connectivity & Performance

**Offline-first thinking.** Mobile users lose connectivity in elevators, tunnels, planes, and rural areas. Core functionality should work offline or degrade gracefully.

- Cache critical data locally
- Queue actions when offline, sync when reconnected
- Show clear offline indicators (banner, icon) — don't silently fail
- Distinguish between "no data yet" (loading) and "no connection" (offline)

**Performance budget.** Mobile devices have less RAM, slower CPUs, and variable network speeds. Target:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- App launch to usable: < 2s
- Animations: 60fps (16ms per frame) — drop frames are immediately perceptible on mobile

**Image optimization.** Serve appropriate resolutions (@1x, @2x, @3x). Use WebP/AVIF. Lazy-load below-the-fold images. Placeholder with blur-up or dominant color.

## Safe Areas & System UI

**Notches, Dynamic Island, rounded corners:** Content must respect device safe areas. On iOS, use `safeAreaInsets`. On Android, use `WindowInsets`. In Flutter, use `SafeArea` widget.

**System bars:** Status bar (top) and navigation bar/gesture indicator (bottom) overlay your content. Ensure your UI doesn't place interactive elements behind them.

**Keyboard handling:** When the keyboard appears, it covers the bottom ~40% of the screen. Scroll the focused input into view. Resize the layout or use `resizeToAvoidBottomInset`. Don't let the keyboard cover the active text field.

**Pull-to-refresh:** A near-universal mobile pattern. Implement it for any list that fetches remote data. Use the platform's native pull-to-refresh widget for familiar behavior.

## Accessibility on Mobile

- **Dynamic Type / Font Scaling:** Support system-level font size preferences. Test your layout at the largest text size — it will break layouts that use fixed heights.
- **VoiceOver (iOS) / TalkBack (Android):** All interactive elements need accessibility labels. Images need descriptions. Decorative elements should be hidden from the accessibility tree.
- **Reduce Motion:** Respect `prefers-reduced-motion` (web) and platform equivalents. Provide static alternatives to animations.
- **Color contrast:** Same WCAG requirements as web, but test in outdoor (high ambient light) conditions too.
- **One-handed operation:** Core flows should be completable one-handed. Don't require two-thumb gestures for essential actions.

## Common Mobile Failures

- Porting a desktop layout to mobile with just CSS media queries — the information architecture needs to change, not just the column count
- Touch targets below 44pt — especially in dense lists, toolbars, and settings screens
- Primary actions in the top-right corner (unreachable one-handed)
- No offline handling — blank screen or error when connectivity drops
- Keyboard covering the active input field
- Ignoring platform conventions — Material Design FAB on iOS, iOS-style back swipe on Android
- Full-screen modals for simple choices (use a bottom sheet)
- Auto-playing video/audio without user consent
- Not testing on mid-range Android devices — performance varies dramatically from flagship to budget
