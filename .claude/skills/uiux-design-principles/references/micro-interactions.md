# Micro-Interactions

## Core Concept

Micro-interactions are small, single-purpose animations or responses that provide feedback, guide attention, or communicate state changes. They make the difference between an interface that feels mechanical and one that feels alive. But they must be functional — decoration disguised as interaction design is noise.

## Structure (Dan Saffer's Framework)

Every micro-interaction has four parts:

1. **Trigger** — What initiates it. Either user-triggered (tap, swipe, scroll, type) or system-triggered (notification, timer, state change).

2. **Rules** — What happens once triggered. The logic behind the response. "When the user toggles the switch, move the thumb to the opposite side and change the background color."

3. **Feedback** — The visible/audible/haptic response that communicates what happened. The animation, the color change, the sound, the vibration.

4. **Loops & Modes** — What happens over time. Does the interaction repeat? Does it change behavior based on context? A "pull to refresh" animation loops while loading; a long-press menu has a mode (hold = menu visible, release = menu dismissed).

## Timing

Timing separates polished micro-interactions from distracting ones:

- **50–100ms:** State changes (button press, toggle flip). Should feel instantaneous.
- **120–220ms:** Most UI transitions (menu open, panel slide, card expand). The sweet spot — perceptible but not slow.
- **250–400ms:** Larger layout changes (page transitions, modal entrance). Need easing to feel smooth.
- **400ms+:** Only for dramatic reveals or intentional emphasis. Rare in functional UI.

**Easing:** Never use linear timing for UI animations. Use ease-out (fast start, gradual stop) for entrances, ease-in (slow start, fast end) for exits, and ease-in-out for transitions between states.

## Common Micro-Interaction Patterns

**Button feedback** — Slight scale reduction (0.95–0.98) on press, color shift, ripple effect. Confirms the tap registered.

**Toggle switches** — Thumb slides with a spring-like ease. Background color transitions. Immediate and physical-feeling.

**Pull to refresh** — Resistance increases as you pull (rubber-band feel). An indicator appears, animates, then resolves on data load.

**Like/Favorite** — Icon scales up briefly (1.0 → 1.2 → 1.0), changes from outlined to filled, optional particle effect. The burst of motion matches the emotional intent.

**Form validation** — Green check appears inline as each field passes validation. Error fields shake gently (2–3px, 200ms) to draw attention without aggression.

**Swipe actions** — Revealed action icons slide into view behind the swiped item. Color indicates intent (red for delete, blue for archive). Snap-back if not swiped far enough.

**Scroll-triggered reveals** — Elements fade/slide into view as the user scrolls. Stagger siblings by 50–100ms for a sequential reveal. Trigger once — don't re-animate on scroll back up.

**Loading transitions** — Skeleton → shimmer → content crossfade. The transition from placeholder to real content should be smooth, not a hard swap.

**Counter/Number changes** — Animate number transitions (roll, fade, count-up) rather than hard-swapping values. Makes data changes feel continuous.

**Hover reveals** — Additional information or actions appear on hover (desktop). Should fade in (100–150ms), not pop. Must have a touch alternative on mobile.

## Principles

1. **Purposeful, not decorative.** Every micro-interaction should answer the question "what did my action do?" If it doesn't provide feedback, guide attention, or communicate state, cut it.

2. **Consistent across the system.** The same type of interaction should produce the same type of response everywhere. Buttons don't ripple on one screen and scale on another.

3. **Interruptible.** If a user triggers a new interaction before the current one finishes, the new one should take priority gracefully. Don't queue animations.

4. **Respect reduced motion.** Check `prefers-reduced-motion` and provide a static alternative. Remove parallax, auto-play, and decorative motion. Keep functional state changes (but make them instant swaps rather than animated transitions).

5. **Performance-aware.** Animate only `transform` and `opacity` — these are GPU-composited. Animating `width`, `height`, `top`, `left`, or `margin` triggers layout recalculation and janks.

6. **Invisible when working.** The best micro-interactions are noticed only in their absence. If users comment on your animations, they might be too prominent.

## Implementation Notes

**CSS transitions** — Simplest approach for state changes (hover, focus, active). Use `transition: property duration easing`.

**CSS animations / @keyframes** — For more complex sequences: multi-step, looping, or scroll-triggered.

**Animation libraries** — Framer Motion (React), Rive (cross-platform), Lottie (After Effects export). Use for complex, custom animations that are difficult in pure CSS.

**Flutter** — Use `AnimatedContainer`, `AnimationController`, `Hero` animations, and the `animations` package. Flutter's animation system is first-class and performant.

## Common Failures

- Animations too slow (300ms+ for simple state changes feels laggy)
- Animations too fast (< 80ms is imperceptible, so why bother)
- Inconsistent easing — some elements ease-out, others linear, others bounce
- Decorative animations that serve no feedback purpose (floating particles, pulsing backgrounds)
- Animations that block interaction (user can't tap until the animation finishes)
- No reduced-motion fallback
- Animating layout properties (width, height) instead of transforms — causes jank
