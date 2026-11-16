"use client"

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react"
import { useEffect, useRef, useState } from "react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

function clampWidth(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)))
}

/** Smooth logarithmic resistance when dragged past min/max bounds. */
function rubberBand(offset: number, limit = 12) {
  if (offset === 0) return 0
  const abs = Math.abs(offset)
  const damped = (abs * limit) / (abs + limit * 2)
  return Math.sign(offset) * damped
}

export interface SplitterProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  /**
   * false（默认）：向右拖拽增大数值（适合左侧 Fold）
   * true：向左拖拽增大数值（适合右侧 Source Island）
   */
  invert?: boolean
  onValueChange?: (value: number) => void
  onValueCommit?: (value: number, meta: { velocity: number }) => void
}

function Splitter({
  value,
  defaultValue = 320,
  min = 180,
  max = 600,
  step = 16,
  invert = false,
  onValueChange,
  onValueCommit,
  onKeyDown,
  onPointerDown,
  className,
  "aria-label": ariaLabel = "Resize panel",
  ...props
}: SplitterProps) {
  const reduce = useReducedMotion()
  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(() =>
    clampWidth(defaultValue, min, max)
  )
  const currentValue = clampWidth(
    isControlled ? value : uncontrolled,
    min,
    max
  )

  const [dragging, setDragging] = useState(false)
  const overshoot = useMotionValue(0)

  const latestRef = useRef({
    currentValue,
    min,
    max,
    invert,
    reduce,
    isControlled,
    onValueChange,
    onValueCommit,
  })
  useEffect(() => {
    latestRef.current = {
      currentValue,
      min,
      max,
      invert,
      reduce,
      isControlled,
      onValueChange,
      onValueCommit,
    }
  })

  const cleanupDragRef = useRef<(() => void) | null>(null)
  useEffect(() => () => cleanupDragRef.current?.(), [])

  function commitValue(nextRaw: number, velocity = 0, commit = false) {
    const {
      min: lo,
      max: hi,
      isControlled: controlled,
      onValueChange: change,
      onValueCommit: done,
    } = latestRef.current
    const clamped = clampWidth(nextRaw, lo, hi)
    if (!controlled) setUncontrolled(clamped)
    change?.(clamped)
    if (commit) done?.(clamped, { velocity })
    return clamped
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    onPointerDown?.(e)
    if (e.defaultPrevented || e.button !== 0) return

    e.preventDefault()
    cleanupDragRef.current?.()

    const startX = e.clientX
    const startVal = latestRef.current.currentValue
    let prevX = e.clientX
    let prevTime = e.timeStamp || performance.now()
    let velocity = 0

    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      // jsdom does not always support pointer capture
    }

    overshoot.stop()
    setDragging(true)

    const onMove = (moveEvent: PointerEvent) => {
      const now = moveEvent.timeStamp || performance.now()
      const dt = Math.max(1, now - prevTime)
      velocity = ((moveEvent.clientX - prevX) / dt) * 1000
      prevX = moveEvent.clientX
      prevTime = now

      const { min: lo, max: hi, invert: inv } = latestRef.current
      const dx = moveEvent.clientX - startX
      const raw = startVal + (inv ? -dx : dx)
      const clamped = commitValue(raw, velocity, false)

      if (raw < lo || raw > hi) {
        const physicalOver = inv ? clamped - raw : raw - clamped
        overshoot.set(rubberBand(physicalOver))
      } else {
        overshoot.set(0)
      }
    }

    const finish = (endEvent: PointerEvent) => {
      cleanupDragRef.current?.()
      cleanupDragRef.current = null
      setDragging(false)

      const { min: lo, max: hi, invert: inv, reduce: noMotion } = latestRef.current
      const dx = endEvent.clientX - startX
      const raw = startVal + (inv ? -dx : dx)
      const boundedVelocity = Math.max(-2400, Math.min(2400, velocity))
      commitValue(raw, boundedVelocity, true)

      const clampedDelta = clampWidth(raw, lo, hi) - startVal
      void clampedDelta
      if (noMotion) {
        overshoot.set(0)
      } else {
        animate(overshoot, 0, {
          ...springs.momentum,
          velocity: Math.max(-600, Math.min(600, boundedVelocity * 0.15)),
        })
      }
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", finish)
    window.addEventListener("pointercancel", finish)
    cleanupDragRef.current = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", finish)
      window.removeEventListener("pointercancel", finish)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e)
    if (e.defaultPrevented) return

    const delta = e.shiftKey ? step * 3 : step
    let next: number | null = null
    if (e.key === "ArrowLeft") {
      next = currentValue + (invert ? delta : -delta)
    } else if (e.key === "ArrowRight") {
      next = currentValue + (invert ? -delta : delta)
    } else if (e.key === "Home") {
      next = min
    } else if (e.key === "End") {
      next = max
    }

    if (next !== null) {
      e.preventDefault()
      commitValue(next, 0, true)
    }
  }

  return (
    <div
      {...props}
      role="separator"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-orientation="vertical"
      aria-valuenow={currentValue}
      aria-valuemin={min}
      aria-valuemax={max}
      data-slot="splitter"
      data-dragging={dragging || undefined}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative flex w-2 shrink-0 cursor-col-resize items-center justify-center outline-none select-none touch-none",
        "focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:rounded-full",
        className
      )}
    >
      <motion.span
        aria-hidden="true"
        style={{ x: overshoot }}
        className={cn(
          "h-8 w-0.5 rounded-full bg-transparent transition-[background-color,height] duration-150 ease-out",
          "group-hover:bg-fg-tertiary/60 group-focus-visible:bg-accent",
          dragging && "h-12 bg-accent"
        )}
      />
    </div>
  )
}

export { Splitter }
