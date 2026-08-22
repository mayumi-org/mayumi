import type { Transition } from "motion/react"

/**
 * Canonical spring presets. snappy = popovers/dialogs, smooth = layout
 * (sidebar collapse, reorder), gentle = hover-level micro interactions.
 */
export const springs = {
  snappy: { type: "spring", stiffness: 480, damping: 34, mass: 0.9 },
  smooth: { type: "spring", stiffness: 260, damping: 30, mass: 1 },
  gentle: { type: "spring", stiffness: 170, damping: 26, mass: 1 },
} satisfies Record<string, Transition>
