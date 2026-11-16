"use client"

import { Minus, Plus } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"

const CELL_HEIGHT = 32
const DRAG_STEP = 12
const STAGGER = 35

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type Column = {
  position: number
  velocity: number
  target: number
  due: number[]
  next: number[]
}

function makeColumns(value: number, places: number) {
  return Array.from({ length: places }, (_, place) => {
    const target = Math.floor(Math.abs(value) / 10 ** place)
    return { position: target, velocity: 0, target, due: [], next: [] }
  })
}

type NumberStepperProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  draggable?: boolean
}

function NumberStepper({
  value,
  defaultValue = 95,
  onValueChange,
  min = 0,
  max = 99999,
  step = 1,
  disabled = false,
  draggable = true,
  className,
  "aria-label": ariaLabel,
  ...props
}: NumberStepperProps) {
  const reduceMotion = useReducedMotion()
  const low = Math.min(Math.round(min), Math.round(max))
  const high = Math.max(Math.round(min), Math.round(max))
  const stepSize = Math.max(1, Math.round(Math.abs(step)))
  const places = Math.max(1, String(Math.max(Math.abs(low), Math.abs(high))).length)
  const initial = clamp(Math.round(value ?? defaultValue), low, high)
  const [internalValue, setInternalValue] = useState(initial)
  const currentValue = clamp(Math.round(value ?? internalValue), low, high)
  const current = useRef(initial)
  const columns = useRef<Column[]>(makeColumns(initial, places))
  const strips = useRef<(HTMLSpanElement | null)[]>([])
  const raf = useRef(0)
  const flingRaf = useRef(0)
  const hold = useRef({ timer: null as ReturnType<typeof setTimeout> | null, since: 0 })
  const drag = useRef<null | {
    id: number
    y: number
    accumulator: number
    velocity: number
    time: number
  }>(null)

  const paint = useCallback(() => {
    for (let place = 0; place < columns.current.length; place++) {
      const element = strips.current[place]
      if (!element) continue
      const position = columns.current[place].position
      const digit = ((position % 10) + 10) % 10
      element.style.transform = `translateY(${-digit * CELL_HEIGHT}px)`
    }
  }, [])

  const run = useCallback(() => {
    if (raf.current) return
    let previous = 0
    const tick = (now: number) => {
      const elapsed = previous ? clamp((now - previous) / 16.67, 0, 2.5) : 1
      previous = now
      const time = performance.now()
      let busy = false
      for (const column of columns.current) {
        while (column.due.length && column.due[0] <= time) {
          column.due.shift()
          column.target = column.next.shift()!
        }
        if (column.due.length) busy = true
        const gap = column.target - column.position
        if (Math.abs(gap) > 24) {
          column.position += Math.round((gap - Math.sign(gap) * 24) / 10) * 10
        }
        column.velocity += (column.target - column.position) * 0.16 * elapsed
        column.velocity *= Math.pow(0.74, elapsed)
        column.position += column.velocity * elapsed
        if (Math.abs(column.target - column.position) < 0.004 && Math.abs(column.velocity) < 0.004) {
          column.position = column.target
          column.velocity = 0
        } else {
          busy = true
        }
      }
      paint()
      raf.current = busy ? requestAnimationFrame(tick) : 0
    }
    raf.current = requestAnimationFrame(tick)
  }, [paint])

  const commit = useCallback(
    (nextValue: number, animate: boolean, notify: boolean) => {
      const next = clamp(Math.round(nextValue), low, high)
      if (next === current.current) return
      if (value !== undefined && notify) {
        onValueChange?.(next)
        return
      }

      current.current = next
      if (value === undefined) setInternalValue(next)
      if (notify) onValueChange?.(next)
      const now = performance.now()
      for (let place = 0; place < columns.current.length; place++) {
        const column = columns.current[place]
        const target = Math.floor(Math.abs(next) / 10 ** place)
        if (reduceMotion || !animate) {
          column.position = target
          column.target = target
          column.velocity = 0
          column.due = []
          column.next = []
        } else {
          column.due.push(now + place * STAGGER)
          column.next.push(target)
        }
      }
      if (reduceMotion || !animate) paint()
      else run()
    },
    [high, low, onValueChange, paint, reduceMotion, run, value]
  )

  const bump = useCallback(
    (delta: number, animate = true) => {
      commit(current.current + delta, animate, true)
    },
    [commit]
  )

  const release = useCallback(() => {
    if (hold.current.timer) clearTimeout(hold.current.timer)
    hold.current.timer = null
  }, [])

  const consumeDrag = useCallback(
    (accumulator: number) => {
      const steps = accumulator > 0 ? Math.floor(accumulator / DRAG_STEP) : Math.ceil(accumulator / DRAG_STEP)
      if (steps) bump(steps * stepSize)
      return accumulator - steps * DRAG_STEP
    },
    [bump, stepSize]
  )

  useEffect(() => {
    commit(value === undefined ? current.current : value, false, false)
  }, [commit, value])

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    raf.current = 0
    columns.current = makeColumns(current.current, places)
    strips.current.length = places
    paint()
  }, [paint, places])

  useEffect(() => {
    paint()
  }, [currentValue, paint])

  useEffect(() => {
    if (!reduceMotion) return
    cancelAnimationFrame(raf.current)
    cancelAnimationFrame(flingRaf.current)
    raf.current = 0
    flingRaf.current = 0
    columns.current = columns.current.map((column) => ({
      ...column,
      position: column.target,
      velocity: 0,
      due: [],
      next: [],
    }))
    paint()
  }, [paint, reduceMotion])

  useEffect(() => {
    if (!disabled) return
    cancelAnimationFrame(flingRaf.current)
    flingRaf.current = 0
    drag.current = null
    release()
  }, [disabled, release])

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current)
      cancelAnimationFrame(flingRaf.current)
      release()
    },
    [release]
  )

  function startHold(direction: 1 | -1) {
    release()
    const atBoundary = () =>
      direction < 0 ? current.current <= low : current.current >= high
    bump(direction * stepSize)
    if (atBoundary()) return
    hold.current.since = performance.now()
    const repeat = () => {
      const held = performance.now() - hold.current.since
      bump(direction * stepSize * (held > 1500 ? 10 : 1))
      if (atBoundary()) return
      hold.current.timer = setTimeout(repeat, held > 900 ? 55 : 90)
    }
    hold.current.timer = setTimeout(repeat, 380)
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const gesture = drag.current
    if (!gesture || event.pointerId !== gesture.id) return
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (reduceMotion || performance.now() - gesture.time > 90) return
    let velocity = gesture.velocity * 16.67
    if (Math.abs(velocity) < 2) return
    let accumulator = gesture.accumulator
    const coast = () => {
      if ((current.current <= low && velocity < 0) || (current.current >= high && velocity > 0)) {
        flingRaf.current = 0
        return
      }
      accumulator = consumeDrag(accumulator + velocity)
      velocity *= 0.94
      flingRaf.current = Math.abs(velocity) > 0.4 ? requestAnimationFrame(coast) : 0
    }
    flingRaf.current = requestAnimationFrame(coast)
  }

  const shownPlaces = Math.max(1, String(Math.abs(currentValue)).length)

  return (
    <div
      {...props}
      data-slot="number-stepper"
      className={cn(
        "inline-flex items-stretch gap-1 rounded-control border border-border bg-surface p-1",
        className
      )}
    >
      <button
        type="button"
        aria-label="减少数值"
        disabled={disabled || currentValue <= low}
        className="flex w-9 items-center justify-center rounded-control text-fg-secondary outline-none transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40 motion-safe:active:scale-95"
        onPointerDown={(event) => {
          if (event.button > 0 || event.isPrimary === false) return
          startHold(-1)
        }}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onClick={(event) => {
          if (event.detail === 0) bump(-stepSize, false)
        }}
      >
        <Minus aria-hidden="true" className="size-4" />
      </button>
      <div
        role="spinbutton"
        aria-label={ariaLabel ?? "数值"}
        aria-valuemin={low}
        aria-valuemax={high}
        aria-valuenow={currentValue}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        data-slot="number-stepper-value"
        className={cn(
          "flex min-w-20 items-center justify-center rounded-control px-2 text-2xl font-medium text-fg outline-none select-none focus-visible:ring-2 focus-visible:ring-accent/60",
          draggable && !disabled ? "cursor-ns-resize touch-none" : "cursor-default"
        )}
        onKeyDown={(event) => {
          if (disabled) return
          const direction = event.key === "ArrowUp" || event.key === "ArrowRight" ? 1 : event.key === "ArrowDown" || event.key === "ArrowLeft" ? -1 : 0
          if (direction) {
            event.preventDefault()
            bump(direction * stepSize, false)
          } else if (event.key === "PageUp" || event.key === "PageDown") {
            event.preventDefault()
            bump((event.key === "PageUp" ? 10 : -10) * stepSize, false)
          } else if (event.key === "Home") {
            event.preventDefault()
            commit(low, false, true)
          } else if (event.key === "End") {
            event.preventDefault()
            commit(high, false, true)
          }
        }}
        onPointerDown={(event) => {
          if (!draggable || disabled || event.button > 0 || event.isPrimary === false || drag.current) return
          cancelAnimationFrame(flingRaf.current)
          flingRaf.current = 0
          event.currentTarget.setPointerCapture(event.pointerId)
          drag.current = {
            id: event.pointerId,
            y: event.clientY,
            accumulator: 0,
            velocity: 0,
            time: performance.now(),
          }
        }}
        onPointerMove={(event) => {
          const gesture = drag.current
          if (!gesture || event.pointerId !== gesture.id) return
          const now = performance.now()
          const distance = gesture.y - event.clientY
          const elapsed = Math.max(1, now - gesture.time)
          gesture.y = event.clientY
          gesture.time = now
          gesture.velocity = gesture.velocity * 0.6 + (distance / elapsed) * 0.4
          gesture.accumulator = consumeDrag(gesture.accumulator + distance)
        }}
        onPointerUp={endDrag}
        onPointerCancel={(event) => {
          if (event.pointerId === drag.current?.id) drag.current = null
        }}
        onLostPointerCapture={(event) => {
          if (event.pointerId === drag.current?.id) drag.current = null
        }}
      >
        <span aria-hidden="true" className="flex items-center tabular-nums">
          {currentValue < 0 ? <span className="mr-1">−</span> : null}
          {Array.from({ length: shownPlaces }, (_, index) => {
            const place = shownPlaces - index - 1
            return (
              <span key={place} className="flex items-center">
                <span className="block h-8 w-[0.65em] overflow-hidden">
                  <span
                    ref={(element) => {
                      strips.current[place] = element
                    }}
                    data-slot="number-stepper-digit"
                    data-place={place}
                    className="block will-change-transform"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, digitIndex) => (
                      <span key={digitIndex} className="flex h-8 items-center justify-center">
                        {digit}
                      </span>
                    ))}
                  </span>
                </span>
                {place > 0 && place % 3 === 0 ? <span>,</span> : null}
              </span>
            )
          })}
        </span>
      </div>
      <button
        type="button"
        aria-label="增加数值"
        disabled={disabled || currentValue >= high}
        className="flex w-9 items-center justify-center rounded-control text-fg-secondary outline-none transition-[background-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40 motion-safe:active:scale-95"
        onPointerDown={(event) => {
          if (event.button > 0 || event.isPrimary === false) return
          startHold(1)
        }}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onClick={(event) => {
          if (event.detail === 0) bump(stepSize, false)
        }}
      >
        <Plus aria-hidden="true" className="size-4" />
      </button>
    </div>
  )
}

export { NumberStepper }
export type { NumberStepperProps }
