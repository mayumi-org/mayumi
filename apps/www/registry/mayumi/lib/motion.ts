import type { Transition } from "motion/react"

/**
 * Canonical spring presets, in Apple's damping/response terms (motion's
 * `duration` + `bounce` maps to response + damping ratio).
 *
 * UI springs are critically damped (bounce 0) — a surface that just
 * appeared has no user momentum, so it must not overshoot:
 * - snappy: popovers, dropdowns, dialogs (response 0.3)
 * - smooth: layout — sidebar collapse, reorder (response 0.4)
 * - gentle: hover-level micro interactions (response 0.25)
 *
 * momentum is the only underdamped preset. Reserve it for motion that
 * inherits gesture velocity (drag release, flick, swipe-to-dismiss);
 * pass the release velocity via `velocity` so the hand-off is seamless.
 */
export const springs = {
  snappy: { type: "spring", duration: 0.3, bounce: 0 },
  smooth: { type: "spring", duration: 0.4, bounce: 0 },
  gentle: { type: "spring", duration: 0.25, bounce: 0 },
  momentum: { type: "spring", duration: 0.3, bounce: 0.2 },
} satisfies Record<string, Transition>
