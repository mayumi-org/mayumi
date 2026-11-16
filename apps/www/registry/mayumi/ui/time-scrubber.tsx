"use client"

import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"

const DAY = 1440
const PIXELS_PER_MINUTE = 2
const HALF_WINDOW = 150

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function wrap(value: number) {
  return ((value % DAY) + DAY) % DAY
}

function timeLabel(value: number, format: "12h" | "24h") {
  const minutes = wrap(Math.round(value))
  const hours = Math.floor(minutes / 60)
  const rest = String(minutes % 60).padStart(2, "0")
  if (format === "24h") {
    return { time: `${String(hours).padStart(2, "0")}:${rest}`, meridiem: "" }
  }
  return {
    time: `${hours % 12 || 12}:${rest}`,
    meridiem: hours < 12 ? "AM" : "PM",
  }
}

type TimeScrubberProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  step?: number
  momentum?: number
  format?: "12h" | "24h"
}

function TimeScrubber({
  value,
  defaultValue = 570,
  onValueChange,
  step = 15,
  momentum = 50,
  format = "12h",
  className,
  ...props
}: TimeScrubberProps) {
  const reduceMotion = useReducedMotion()
  const initial = value ?? defaultValue
  const [position, setPosition] = useState(initial)
  const ruler = useRef<HTMLDivElement | null>(null)
  const drag = useRef<null | { id: number; x: number; time: number; velocity: number }>(null)
  const raf = useRef(0)
  const wheelIdle = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notified = useRef(wrap(Math.round(initial)))
  const physics = useRef({ x: initial, v: 0, to: initial })
  const stepSize = clamp(Math.round(step), 1, 60)

  const set = useCallback(
    (x: number) => {
      physics.current.x = x
      setPosition(x)
      const next = wrap(Math.round(x))
      if (next !== notified.current) {
        notified.current = next
        onValueChange?.(next)
      }
    },
    [onValueChange]
  )

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current)
    raf.current = 0
  }, [])

  const goTo = useCallback(
    (to: number, velocity = physics.current.v) => {
      physics.current.to = to
      physics.current.v = velocity
      if (reduceMotion) {
        stop()
        physics.current.v = 0
        set(to)
        return
      }

      if (raf.current) return
      let previous = 0
      const run = (now: number) => {
        const elapsed = previous ? clamp((now - previous) / 16.67, 0, 2.5) : 1
        previous = now
        const current = physics.current
        current.v += ((current.to - current.x) * 0.022 - current.v * 0.26) * elapsed
        const next = current.x + current.v * elapsed
        if (Math.abs(current.to - next) < 0.01 && Math.abs(current.v) < 0.01) {
          current.v = 0
          set(current.to)
          raf.current = 0
          return
        }
        set(next)
        raf.current = requestAnimationFrame(run)
      }
      raf.current = requestAnimationFrame(run)
    },
    [reduceMotion, set, stop]
  )

  const jumpTo = useCallback(
    (to: number) => {
      stop()
      physics.current.v = 0
      physics.current.to = to
      set(to)
    },
    [set, stop]
  )

  useEffect(() => {
    if (value === undefined || wrap(Math.round(value)) === notified.current) return
    jumpTo(value)
  }, [jumpTo, value])

  useEffect(() => {
    if (!reduceMotion) return
    jumpTo(Math.round(physics.current.x / stepSize) * stepSize)
  }, [jumpTo, reduceMotion, stepSize])

  useEffect(() => {
    const element = ruler.current
    if (!element) return
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      stop()
      physics.current.v = 0
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 300 : 1
      set(physics.current.x + (event.deltaX * unit) / PIXELS_PER_MINUTE)
      if (wheelIdle.current) clearTimeout(wheelIdle.current)
      wheelIdle.current = setTimeout(() => {
        goTo(Math.round(physics.current.x / stepSize) * stepSize, 0)
      }, 120)
    }
    element.addEventListener("wheel", wheel, { passive: false })
    return () => {
      element.removeEventListener("wheel", wheel)
      if (wheelIdle.current) clearTimeout(wheelIdle.current)
    }
  }, [goTo, set, stepSize, stop])

  useEffect(
    () => () => {
      stop()
      if (wheelIdle.current) clearTimeout(wheelIdle.current)
    },
    [stop]
  )

  const label = timeLabel(position, format)
  const ticks: { minute: number; x: number; focus: number; kind: string }[] = []
  const span = HALF_WINDOW / PIXELS_PER_MINUTE + 10
  for (
    let minute = Math.ceil((position - span) / 5) * 5;
    minute <= position + span;
    minute += 5
  ) {
    const x = (minute - position) * PIXELS_PER_MINUTE
    const focus = clamp(1 - Math.pow(Math.abs(x) / HALF_WINDOW, 2), 0, 1)
    const wrapped = wrap(minute)
    ticks.push({
      minute,
      x,
      focus,
      kind: wrapped % 60 === 0 ? "hour" : wrapped % 15 === 0 ? "quarter" : "five",
    })
  }

  return (
    <div
      {...props}
      data-slot="time-scrubber"
      className={cn("flex w-full flex-col items-center gap-5", className)}
    >
      <div aria-hidden="true" className="flex items-baseline gap-2 tabular-nums">
        <span className="text-3xl font-medium tracking-tight text-fg">{label.time}</span>
        {label.meridiem ? (
          <span className="text-ui font-medium text-fg-secondary">{label.meridiem}</span>
        ) : null}
      </div>
      <div
        ref={ruler}
        role="slider"
        tabIndex={0}
        aria-label={props["aria-label"] ?? "时间"}
        aria-valuemin={0}
        aria-valuemax={DAY - 1}
        aria-valuenow={wrap(Math.round(position))}
        aria-valuetext={`${label.time} ${label.meridiem}`.trim()}
        data-slot="time-scrubber-ruler"
        className="relative h-20 w-full touch-none overflow-hidden rounded-control border border-border bg-surface select-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:outline-none"
        onPointerDown={(event) => {
          if (event.button > 0 || event.isPrimary === false || drag.current) return
          stop()
          physics.current.v = 0
          event.currentTarget.setPointerCapture(event.pointerId)
          drag.current = {
            id: event.pointerId,
            x: event.clientX,
            time: performance.now(),
            velocity: 0,
          }
        }}
        onPointerMove={(event) => {
          const current = drag.current
          if (!current || event.pointerId !== current.id) return
          const now = performance.now()
          const minutes = -(event.clientX - current.x) / PIXELS_PER_MINUTE
          const elapsed = Math.max(1, now - current.time) / 16.67
          current.velocity = current.velocity * 0.5 + (minutes / elapsed) * 0.5
          current.x = event.clientX
          current.time = now
          set(physics.current.x + minutes)
        }}
        onPointerUp={(event) => {
          const current = drag.current
          if (!current || event.pointerId !== current.id) return
          drag.current = null
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
          const velocity =
            performance.now() - current.time > 80 ? 0 : clamp(current.velocity, -14, 14)
          const carry = (clamp(momentum, 0, 100) / 100) * 36
          goTo(
            Math.round((physics.current.x + velocity * carry) / stepSize) * stepSize,
            velocity * 0.6
          )
        }}
        onPointerCancel={(event) => {
          if (event.pointerId !== drag.current?.id) return
          drag.current = null
          goTo(Math.round(physics.current.x / stepSize) * stepSize, 0)
        }}
        onLostPointerCapture={(event) => {
          if (event.pointerId !== drag.current?.id) return
          drag.current = null
          goTo(Math.round(physics.current.x / stepSize) * stepSize, 0)
        }}
        onKeyDown={(event) => {
          const size = stepSize
          const direction =
            event.key === "ArrowRight" || event.key === "ArrowUp"
              ? 1
              : event.key === "ArrowLeft" || event.key === "ArrowDown"
                ? -1
                : 0
          if (direction) {
            event.preventDefault()
            jumpTo(Math.round(physics.current.to / size) * size + direction * size)
          } else if (event.key === "Home") {
            event.preventDefault()
            jumpTo(0)
          } else if (event.key === "End") {
            event.preventDefault()
            jumpTo(DAY - 1)
          }
        }}
      >
        <div aria-hidden="true" className="absolute inset-0">
          {ticks.map((tick) => (
            <span
              key={tick.minute}
              data-slot="time-scrubber-tick"
              data-kind={tick.kind}
              className={cn(
                "absolute top-3 left-1/2 w-px rounded-full bg-fg-secondary",
                tick.kind === "hour" ? "h-6" : tick.kind === "quarter" ? "h-4" : "h-2.5"
              )}
              style={{
                transform: `translateX(${tick.x.toFixed(2)}px) scaleY(${(0.55 + 0.45 * tick.focus).toFixed(3)})`,
                opacity: 0.18 + 0.82 * tick.focus,
              }}
            />
          ))}
          {ticks
            .filter((tick) => tick.kind === "hour")
            .map((tick) => {
              const hour = Math.floor(wrap(tick.minute) / 60)
              return (
                <span
                  key={`label-${tick.minute}`}
                  className="absolute bottom-2.5 left-1/2 text-[10px] whitespace-nowrap text-fg-tertiary tabular-nums"
                  style={{
                    transform: `translateX(${tick.x.toFixed(2)}px) translateX(-50%)`,
                    opacity: 0.15 + 0.85 * tick.focus,
                  }}
                >
                  {format === "24h"
                    ? String(hour).padStart(2, "0")
                    : `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`}
                </span>
              )
            })}
        </div>
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-1/2 w-0.5 -translate-x-1/2 rounded-full bg-accent"
        />
      </div>
    </div>
  )
}

export { TimeScrubber }
export type { TimeScrubberProps }
