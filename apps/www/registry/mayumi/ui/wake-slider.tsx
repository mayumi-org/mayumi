"use client"

import { Slider as BaseSlider } from "@base-ui/react/slider"
import { useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"

const BAR_HEIGHT = 20

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type WakeSliderProps = Omit<
  React.ComponentProps<typeof BaseSlider.Root>,
  "value" | "defaultValue" | "onValueChange"
> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  bars?: number
  wake?: number
  showValue?: boolean
}

function WakeSlider({
  value,
  defaultValue = 50,
  onValueChange,
  bars = 36,
  wake = 60,
  showValue = true,
  min = 0,
  max = 100,
  className,
  ...props
}: WakeSliderProps) {
  const count = Math.round(clamp(bars, 12, 64))
  const wakeAmount = clamp(wake, 0, 100)
  const [internalValue, setInternalValue] = useState(defaultValue)
  const reduceMotion = useReducedMotion()
  const currentValue = value ?? internalValue
  const range = max - min || 1
  const fraction = clamp((currentValue - min) / range, 0, 1)
  const track = useRef<HTMLDivElement | null>(null)
  const gesture = useRef({
    id: null as number | null,
    down: false,
    x: 0,
    time: 0,
    speed: 0,
  })
  const at = useRef(fraction)
  const energies = useRef(new Float32Array(count))
  const barElements = useRef<(HTMLSpanElement | null)[]>([])
  const raf = useRef(0)

  useEffect(() => {
    at.current = fraction
  }, [fraction])

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    raf.current = 0
    energies.current = new Float32Array(count)
    for (const bar of barElements.current) {
      if (bar) bar.style.transform = "scaleY(1)"
    }
  }, [count])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  useEffect(() => {
    if (!reduceMotion) return
    cancelAnimationFrame(raf.current)
    raf.current = 0
    energies.current.fill(0)
  }, [reduceMotion])

  function handleValueChange(next: number) {
    if (value === undefined) setInternalValue(next)
    onValueChange?.(next)
  }

  function loop() {
    if (raf.current) return
    let previous = performance.now()
    const run = (now: number) => {
      const elapsed = Math.min(0.05, (now - previous) / 1000)
      previous = now
      let live = false
      const falloff = Math.exp(-elapsed * 6.5)
      for (let index = 0; index < energies.current.length; index++) {
        energies.current[index] *= falloff
        if (energies.current[index] < 0.002) energies.current[index] = 0
        else live = true
        const bar = barElements.current[index]
        if (bar) {
          bar.style.transform = `scaleY(${(1 + energies.current[index] * 1.6).toFixed(3)})`
        }
      }
      raf.current = live || gesture.current.down ? requestAnimationFrame(run) : 0
    }
    raf.current = requestAnimationFrame(run)
  }

  function leaveWake(clientX: number) {
    const element = track.current
    if (!element || wakeAmount === 0 || reduceMotion) return
    const rect = element.getBoundingClientRect()
    const next = clamp((clientX - rect.left) / rect.width, 0, 1)
    const from = at.current
    at.current = next

    const now = performance.now()
    const state = gesture.current
    const elapsed = Math.max(0.008, (now - state.time) / 1000)
    const speed = Math.abs(clientX - state.x) / elapsed
    state.speed = state.speed * 0.5 + speed * 0.5
    state.x = clientX
    state.time = now

    const fromBar = Math.round(from * (count - 1))
    const toBar = Math.round(next * (count - 1))
    const push = (1 - Math.exp(-state.speed / 900)) * (wakeAmount / 60)
    const start = Math.min(fromBar, toBar)
    const end = Math.max(fromBar, toBar)
    for (let index = start; index <= end; index++) {
      energies.current[index] = Math.max(energies.current[index], push)
    }
    loop()
  }

  return (
    <BaseSlider.Root
      {...props}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      data-slot="wake-slider"
      className={cn("flex w-full items-center gap-4", className)}
    >
      <BaseSlider.Control
        ref={track}
        data-slot="wake-slider-control"
        className="flex flex-1 touch-none items-center rounded-control outline-none select-none focus-within:ring-2 focus-within:ring-accent/60"
        onPointerDown={(event) => {
          if (event.button > 0 || event.isPrimary === false) return
          if (gesture.current.down) return
          gesture.current = {
            id: event.pointerId,
            down: true,
            x: event.clientX,
            time: performance.now(),
            speed: 0,
          }
        }}
        onPointerMove={(event) => {
          if (gesture.current.down && event.pointerId === gesture.current.id) {
            leaveWake(event.clientX)
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerId === gesture.current.id) {
            gesture.current.down = false
            gesture.current.id = null
          }
        }}
        onPointerCancel={(event) => {
          if (event.pointerId === gesture.current.id) {
            gesture.current.down = false
            gesture.current.id = null
          }
        }}
        onLostPointerCapture={() => {
          gesture.current.down = false
          gesture.current.id = null
        }}
      >
        <BaseSlider.Track
          className="relative flex flex-1 items-center"
          style={{ minHeight: BAR_HEIGHT * (1 + (wakeAmount / 60) * 1.6) }}
        >
          <BaseSlider.Indicator className="hidden" />
          <div
            aria-hidden="true"
            className="flex w-full items-center justify-between gap-1"
          >
            {Array.from({ length: count }, (_, index) => (
              <WakeBar
                key={index}
                active={currentValue > min && index <= Math.round(fraction * (count - 1))}
                reduceMotion={Boolean(reduceMotion)}
                register={(element) => {
                  barElements.current[index] = element
                }}
              />
            ))}
          </div>
          <BaseSlider.Thumb
            aria-label={props["aria-label"]}
            aria-labelledby={props["aria-labelledby"]}
            className="sr-only"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
      {showValue ? (
        <span
          aria-hidden="true"
          className="min-w-[3ch] text-right text-ui text-fg-secondary tabular-nums"
        >
          {currentValue}
        </span>
      ) : null}
    </BaseSlider.Root>
  )
}

function WakeBar({
  active,
  reduceMotion,
  register,
}: {
  active: boolean
  reduceMotion: boolean
  register: (element: HTMLSpanElement | null) => void
}) {
  const element = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (reduceMotion && element.current) {
      element.current.style.transform = "scaleY(1)"
    }
  }, [reduceMotion])

  return (
    <span
      ref={(node) => {
        element.current = node
        register(node)
      }}
      aria-hidden="true"
      data-slot="wake-slider-bar"
      data-active={active || undefined}
      className={cn(
        "h-5 flex-1 rounded-full transition-colors duration-150 ease-out max-w-[3px]",
        active ? "bg-fg" : "bg-fg-tertiary"
      )}
      style={{
        height: BAR_HEIGHT,
        transform: "scaleY(1)",
        transformOrigin: "50% 50%",
      }}
    />
  )
}

export { WakeSlider }
export type { WakeSliderProps }
