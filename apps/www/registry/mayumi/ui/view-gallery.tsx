"use client"

import { Check, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useReducedMotion } from "motion/react"
import { type ReactNode, useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"
import { Button } from "@/registry/mayumi/ui/button"

/**
 * 倾斜 + 高光跟随的样式。用内联 <style> 而不是 .css 文件：registry 组件会被
 * shadcn 分发成单文件，消费方（Next/Vite）对全局 CSS 的 import 位置各有约束，
 * 内联最稳。
 */
const viewGalleryStyles = `
.view-gallery-slide {
  position: relative;
  transform-style: preserve-3d;
}
/* 放大 hover 感应区：指针贴近卡片边缘时倾斜已经开始，而不是完全贴上去才动 */
.view-gallery-slide::before {
  content: "";
  position: absolute;
  inset: -12px;
  pointer-events: auto;
}
.view-gallery-preview {
  --glow-x: 50%;
  --glow-y: 40%;
  --glow-opacity: 0;
  position: relative;
  isolation: isolate;
  transform-origin: 50% 50%;
  transition: transform 320ms var(--ease-out);
  will-change: transform;
}
/* 静止姿态：两侧卡片朝中间倾斜，营造 cover-flow 的纵深感 */
.view-gallery-slide[data-position="before"] .view-gallery-preview {
  transform: perspective(1200px) rotateY(-12deg) rotateX(1deg) rotateZ(-0.35deg);
}
.view-gallery-slide[data-position="after"] .view-gallery-preview {
  transform: perspective(1200px) rotateY(12deg) rotateX(1deg) rotateZ(0.35deg);
}
.view-gallery-slide[data-position="active"] .view-gallery-preview {
  transform: perspective(1200px) rotateY(7deg) rotateX(1deg) rotateZ(0.35deg);
}
/* 倾斜进行中关掉 CSS transition，transform 完全由 spring 逐帧驱动 */
.view-gallery-preview[data-tilting="true"] {
  transition: none;
}
/* 跟随指针的面光 */
.view-gallery-preview::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--view-gallery-radius, var(--radius-card, 10px));
  background: radial-gradient(300px circle at var(--glow-x) var(--glow-y), rgba(255, 255, 255, 0.1), transparent 68%);
  opacity: var(--glow-opacity);
  pointer-events: none;
}
/* 跟随指针的边缘光（mask 只留 1px 描边） */
.view-gallery-preview::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1px;
  border-radius: var(--view-gallery-radius, var(--radius-card, 10px));
  background: radial-gradient(240px circle at var(--glow-x) var(--glow-y), rgba(255, 255, 255, 0.72), transparent 70%);
  opacity: var(--glow-opacity);
  pointer-events: none;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.view-gallery-preview > * {
  position: relative;
  z-index: 1;
}
@media (prefers-reduced-motion: reduce) {
  .view-gallery-preview {
    transition-duration: 0.01ms;
  }
  .view-gallery-preview::before,
  .view-gallery-preview::after {
    display: none;
  }
}
`

type PreviewPosition = "active" | "after" | "before"

/**
 * 临界阻尼弹簧（response 单位：秒）。逐帧积分驱动 transform，比 CSS transition
 * 好在可以随时改目标值（指针持续移动）且不会打断出惯性。
 */
class SpringValue {
  value: number
  target: number
  velocity = 0

  constructor(
    value: number,
    private readonly response = 0.3,
  ) {
    this.value = value
    this.target = value
  }

  reset(value: number) {
    this.value = value
    this.target = value
    this.velocity = 0
  }

  step(dt: number) {
    const angularFrequency = (Math.PI * 2) / this.response
    const stiffness = angularFrequency * angularFrequency
    const damping = 2 * angularFrequency
    const acceleration = -stiffness * (this.value - this.target) - damping * this.velocity
    this.velocity += acceleration * dt
    this.value += this.velocity * dt
  }

  settled() {
    return Math.abs(this.value - this.target) < 0.01 && Math.abs(this.velocity) < 0.01
  }
}

interface TiltState {
  popover: HTMLDivElement
  rotateX: SpringValue
  rotateY: SpringValue
  scale: SpringValue
  opacity: SpringValue
  glowX: number
  glowY: number
  frame: number | null
  previousTime: number
}

/**
 * 指针悬停时的 3D 倾斜 + 高光跟随。只在 active slide、精细指针、非 reduced-motion
 * 下生效；slide 失活或指针离开时弹簧回位并清掉内联样式。
 */
export function useViewGalleryTilt({ active, position }: { active: boolean; position: PreviewPosition }) {
  const slideRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<TiltState | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const slide = slideRef.current
    const preview = previewRef.current
    if (!slide || !preview) {
      return
    }

    const finePointer =
      typeof globalThis.matchMedia === "function"
        ? globalThis.matchMedia("(hover: hover) and (pointer: fine)")
        : { matches: false }
    const base = {
      x: 1,
      y: position === "before" ? -12 : position === "after" ? 12 : 7,
      z: position === "before" ? -0.35 : 0.35,
    }

    const renderTilt = (state: TiltState) => {
      state.popover.style.transform = `perspective(1200px) rotateY(${state.rotateY.value}deg) rotateX(${state.rotateX.value}deg) rotateZ(${base.z}deg) scale(${state.scale.value})`
      state.popover.style.setProperty("--glow-x", `${state.glowX}px`)
      state.popover.style.setProperty("--glow-y", `${state.glowY}px`)
      state.popover.style.setProperty("--glow-opacity", state.opacity.value.toFixed(3))
    }

    const springsFor = (state: TiltState) => [state.rotateX, state.rotateY, state.scale, state.opacity]

    const finish = (state: TiltState) => {
      if (state.opacity.target === 0) {
        state.popover.style.transform = ""
        state.popover.style.setProperty("--glow-opacity", "0")
        delete state.popover.dataset.tilting
        if (tiltRef.current === state) {
          tiltRef.current = null
        }
      }
      state.frame = null
    }

    const animate = (state: TiltState, time: number) => {
      const dt = Math.min((time - state.previousTime) / 1000, 0.032)
      state.previousTime = time
      for (const spring of springsFor(state)) {
        spring.step(dt)
      }
      renderTilt(state)
      if (springsFor(state).every((spring) => spring.settled())) {
        finish(state)
        return
      }
      state.frame = requestAnimationFrame((nextTime) => animate(state, nextTime))
    }

    const schedule = (state: TiltState) => {
      if (state.frame !== null) {
        return
      }
      state.previousTime = performance.now()
      state.frame = requestAnimationFrame((nextTime) => animate(state, nextTime))
    }

    const reset = (immediate = false) => {
      const state = tiltRef.current
      if (!state) {
        return
      }
      state.rotateX.target = base.x
      state.rotateY.target = base.y
      state.scale.target = 1
      state.opacity.target = 0
      if (immediate || reducedMotion || !active || !finePointer.matches) {
        if (state.frame !== null) {
          cancelAnimationFrame(state.frame)
        }
        state.frame = null
        state.popover.style.transform = ""
        state.popover.style.setProperty("--glow-opacity", "0")
        delete state.popover.dataset.tilting
        tiltRef.current = null
        return
      }
      schedule(state)
    }

    const track = (event: PointerEvent) => {
      if (!active || reducedMotion || !finePointer.matches || event.pointerType === "touch") {
        return
      }
      let state = tiltRef.current
      if (!state) {
        state = {
          popover: preview,
          rotateX: new SpringValue(base.x),
          rotateY: new SpringValue(base.y),
          scale: new SpringValue(1),
          opacity: new SpringValue(0),
          glowX: 0,
          glowY: 0,
          frame: null,
          previousTime: 0,
        }
        tiltRef.current = state
      }
      const rect = preview.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      state.rotateX.target = base.x + (y / rect.height - 0.5) * 6
      state.rotateY.target = base.y - (x / rect.width - 0.5) * 8
      state.scale.target = 1.02
      state.glowX = x
      state.glowY = y
      state.opacity.target = 1
      preview.dataset.tilting = "true"
      schedule(state)
    }

    const leave = () => reset()
    slide.addEventListener("pointerenter", track)
    slide.addEventListener("pointermove", track)
    slide.addEventListener("pointerleave", leave)
    return () => {
      slide.removeEventListener("pointerenter", track)
      slide.removeEventListener("pointermove", track)
      slide.removeEventListener("pointerleave", leave)
      reset(true)
    }
  }, [active, position, reducedMotion])

  return { slideRef, previewRef }
}

export interface ViewGalleryItem {
  id: string
  name: string
  description?: string
  /** 居中展示的预览内容，宽度自适应 slideWidth；卡片类内容效果最好 */
  preview: ReactNode
}

export interface ViewGalleryProps {
  items: ViewGalleryItem[]
  /** 当前已应用项的 id；提供后会渲染应用按钮和 Applied 状态 */
  appliedId?: string
  /** 点击应用按钮时触发；返回 Promise 期间按钮进入 saving 态 */
  onApply?: (id: string) => void | Promise<void>
  /** 单张 slide 的宽度（px），默认 367 */
  slideWidth?: number
  className?: string
}

function GallerySlide({
  item,
  index,
  active,
  slideWidth,
}: {
  item: ViewGalleryItem
  index: number
  active: number
  slideWidth: number
}) {
  const isActive = index === active
  const position: PreviewPosition = index < active ? "before" : index > active ? "after" : "active"
  const { slideRef, previewRef } = useViewGalleryTilt({ active: isActive, position })

  return (
    <div
      ref={slideRef}
      data-view-gallery-slide
      data-active={isActive}
      data-position={position}
      aria-hidden={!isActive}
      inert={!isActive}
      className={cn(
        "view-gallery-slide flex shrink-0 snap-center flex-col transition-[opacity,transform] duration-200",
        isActive ? "scale-100 opacity-100" : "pointer-events-none scale-[.91] opacity-30",
      )}
      style={{ flexBasis: slideWidth, maxWidth: "85vw" }}
    >
      <span className="sr-only">
        {item.name}
        {item.description ? `: ${item.description}` : ""}
      </span>
      <div ref={previewRef} className="view-gallery-preview">
        {item.preview}
      </div>
    </div>
  )
}

/**
 * Apple 风格的横向画廊选择器：scroll-snap 卡片流 + 前后箭头 / 圆点 / 键盘方向键导航，
 * 悬停时预览卡 3D 倾斜并跟随指针打光。通过 items 传入任意预览内容，onApply 接管持久化。
 */
export function ViewGallery({ items, appliedId, onApply, slideWidth = 367, className }: ViewGalleryProps) {
  const appliedIndex = Math.max(0, items.findIndex((item) => item.id === appliedId))
  const [active, setActive] = useState(appliedIndex)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const activeItem = items[active]
  const appliedItem = items[appliedIndex]
  const scrollSyncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const programmaticScroll = useRef(false)
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // 首次渲染把已应用项滚到居中（无动画，避免入场横跳）
  useEffect(() => {
    const carousel = carouselRef.current
    const slide = carousel?.querySelectorAll<HTMLElement>("[data-view-gallery-slide]")[appliedIndex]
    if (carousel && slide) {
      carousel.scrollTo?.({ left: slide.offsetLeft - (carousel.clientWidth - slide.clientWidth) / 2, behavior: "auto" })
    }
    return () => {
      globalThis.clearTimeout(scrollSyncTimer.current)
      globalThis.clearTimeout(programmaticTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!activeItem) {
    return null
  }

  function goTo(index: number) {
    const next = Math.max(0, Math.min(items.length - 1, index))
    const carousel = carouselRef.current
    const slide = carousel?.querySelectorAll<HTMLElement>("[data-view-gallery-slide]")[next]
    programmaticScroll.current = true
    globalThis.clearTimeout(programmaticTimer.current)
    programmaticTimer.current = globalThis.setTimeout(() => {
      programmaticScroll.current = false
    }, 400)
    slide?.scrollIntoView?.({ behavior: reducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" })
    setActive(next)
  }

  function syncFromScroll() {
    const carousel = carouselRef.current
    if (!carousel) {
      return
    }
    const center = carousel.getBoundingClientRect().left + carousel.clientWidth / 2
    let closest = active
    let distance = Number.POSITIVE_INFINITY
    for (const [index, slide] of carousel.querySelectorAll<HTMLElement>("[data-view-gallery-slide]").entries()) {
      const rect = slide.getBoundingClientRect()
      const nextDistance = Math.abs(rect.left + rect.width / 2 - center)
      if (nextDistance < distance) {
        closest = index
        distance = nextDistance
      }
    }
    if (closest !== active) {
      setActive(closest)
    }
  }

  function scheduleScrollSync() {
    if (programmaticScroll.current) {
      return
    }
    globalThis.clearTimeout(scrollSyncTimer.current)
    scrollSyncTimer.current = globalThis.setTimeout(syncFromScroll, 80)
  }

  function finishScroll() {
    programmaticScroll.current = false
    syncFromScroll()
  }

  async function apply() {
    if (!onApply || saving || !activeItem || activeItem.id === appliedId) {
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onApply(activeItem.id)
    } catch {
      setError("Couldn't apply. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const isApplied = activeItem.id === appliedId

  return (
    <div className={className}>
      <style>{viewGalleryStyles}</style>
      <div className="relative" data-active-view={activeItem.id}>
        <button
          type="button"
          aria-label="Previous"
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
          className="absolute left-0 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-fg-secondary transition-opacity disabled:opacity-25"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>
        <div
          ref={carouselRef}
          role="group"
          aria-label="Available items. Use left and right arrow keys to browse."
          tabIndex={0}
          onScroll={scheduleScrollSync}
          onScrollEnd={finishScroll}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault()
              goTo(active + 1)
            } else if (event.key === "ArrowLeft") {
              event.preventDefault()
              goTo(active - 1)
            }
          }}
          className="flex snap-x snap-mandatory gap-9 overflow-x-auto py-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ paddingInline: `max(24px, calc(50% - ${slideWidth / 2}px))` }}
        >
          {items.map((item, index) => (
            <GallerySlide key={item.id} item={item} index={index} active={active} slideWidth={slideWidth} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          disabled={active === items.length - 1}
          onClick={() => goTo(active + 1)}
          className="absolute right-0 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-fg-secondary transition-opacity disabled:opacity-25"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="text-center">
        <h3 className="text-[17px] font-medium text-fg">{activeItem.name}</h3>
        {activeItem.description && <p className="mt-1.5 text-ui text-fg-tertiary">{activeItem.description}</p>}
        <div className="my-4 flex justify-center gap-2" aria-label="Choose an item">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Show ${item.name}`}
              aria-current={index === active}
              onClick={() => goTo(index)}
              className={cn(
                "size-1.5 rounded-full transition-[background-color,transform]",
                index === active ? "scale-125 bg-fg" : "bg-fg-tertiary",
              )}
            />
          ))}
        </div>
        {onApply && (
          <Button
            type="button"
            variant="primary"
            disabled={saving || isApplied}
            onClick={apply}
            aria-pressed={isApplied}
            className="min-w-[220px]"
          >
            {isApplied ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
            {saving ? "Saving…" : isApplied ? `${activeItem.name} selected` : `Use ${activeItem.name}`}
          </Button>
        )}
        {appliedId !== undefined && appliedItem && (
          <p className="mt-2 text-[11px] text-fg-tertiary">Applied: {appliedItem.name}</p>
        )}
        {error && (
          <p role="alert" className="mt-2 text-ui text-danger">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
