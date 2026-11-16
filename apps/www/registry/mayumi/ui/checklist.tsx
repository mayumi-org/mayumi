"use client"

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"
import { motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

const ROW_HEIGHT = 40
const BODY_HEIGHT = 20
const STACK_STEP = 14
const TILTS = [-1.5, 1, -0.5, 1.5, -1]
const DRIFTS = [-2, 1, -1, 2, 0]

type ChecklistItem = {
  id: string
  label: React.ReactNode
  disabled?: boolean
}

type ChecklistProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  items: ChecklistItem[]
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: string[]) => void
  stackOnComplete?: boolean
}

function Checklist({
  items,
  value,
  defaultValue = [],
  onValueChange,
  stackOnComplete = false,
  className,
  ...props
}: ChecklistProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState<readonly string[]>(
    defaultValue
  )
  const reduceMotion = useReducedMotion()
  const selected = value ?? uncontrolledValue
  const complete =
    items.length > 0 && items.every((item) => selected.includes(item.id))
  const collapsed = complete && stackOnComplete && !reduceMotion
  const drops = items.map((_, index) =>
    collapsed
      ? (items.length - index - 0.5) * (ROW_HEIGHT - BODY_HEIGHT) +
        (items.length - 1 - index) * (BODY_HEIGHT - STACK_STEP)
      : 0
  )
  const maxDrop = Math.max(...drops, 1)

  function setChecked(id: string, checked: boolean) {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    const nextValue = items
      .filter((item) => next.has(item.id))
      .map((item) => item.id)
    if (value === undefined) setUncontrolledValue(nextValue)
    onValueChange?.(nextValue)
  }

  return (
    <div
      {...props}
      role="group"
      data-slot="checklist"
      data-complete={complete || undefined}
      data-collapsed={collapsed || undefined}
      className={cn(
        "w-full overflow-hidden rounded-card border border-border bg-surface p-2",
        className
      )}
    >
      {items.map((item, index) => {
        const checked = selected.includes(item.id)
        const drop = drops[index]
        const tilt = collapsed ? TILTS[index % TILTS.length] : 0
        const drift = collapsed ? DRIFTS[index % DRIFTS.length] : 0

        return (
          <motion.div
            key={item.id}
            data-slot="checklist-item"
            data-collapsed={collapsed || undefined}
            initial={false}
            animate={{
              transform: `translate3d(${drift}px, ${drop}px, 0) rotate(${tilt}deg)`,
            }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : collapsed
                  ? {
                      ...springs.delight,
                      duration: 0.18 + 0.12 * (drop / maxDrop),
                    }
                  : springs.snappy
            }
            style={{ zIndex: collapsed ? items.length - index : undefined }}
            className="relative"
          >
            <BaseCheckbox.Root
              checked={checked}
              disabled={item.disabled}
              onCheckedChange={(next) => setChecked(item.id, next)}
              aria-label={typeof item.label === "string" ? item.label : undefined}
              data-slot="checklist-item-control"
              data-collapsed={collapsed || undefined}
              className={cn(
                "group relative flex h-10 w-full items-center rounded-control text-left outline-none disabled:pointer-events-none disabled:opacity-50",
                collapsed && "pointer-events-none"
              )}
            >
              <span
                data-slot="checklist-content"
                className="pointer-events-auto flex h-5 w-full items-center gap-2.5 rounded-control group-data-collapsed:bg-surface"
              >
                <span
                  data-slot="checklist-box"
                  className="relative flex size-4 shrink-0 items-center justify-center rounded-icon border border-border group-focus-visible:ring-2 group-focus-visible:ring-accent/60"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      transform: checked ? "scale(1)" : "scale(0.9)",
                      opacity: checked ? 1 : 0,
                    }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : checked
                          ? springs.delight
                          : springs.snappy
                    }
                    className="absolute inset-0 rounded-[calc(var(--radius-icon)-1px)] bg-accent"
                  />
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="relative size-2.5 fill-none stroke-accent-fg stroke-[1.75] stroke-linecap-round stroke-linejoin-round motion-safe:transition-[clip-path] motion-safe:duration-150 motion-safe:ease-(--ease-out)"
                    style={{
                      clipPath: checked
                        ? "inset(0 0 0 0)"
                        : "inset(0 100% 0 0)",
                    }}
                  >
                    <path d="m2.25 6.25 2.25 2.25 5.25-5.25" />
                  </svg>
                </span>
                <span
                  className={cn(
                    "relative min-w-0 truncate text-ui leading-tight transition-colors duration-150 ease-out",
                    checked ? "text-fg-tertiary" : "text-fg"
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-1/2 h-px bg-current motion-safe:transition-[clip-path] motion-safe:duration-150 motion-safe:ease-(--ease-out)"
                    style={{
                      clipPath: checked
                        ? "inset(0 0 0 0)"
                        : "inset(0 100% 0 0)",
                    }}
                  />
                </span>
              </span>
            </BaseCheckbox.Root>
          </motion.div>
        )
      })}
    </div>
  )
}

export { Checklist }
export type { ChecklistItem, ChecklistProps }
