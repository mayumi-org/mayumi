"use client"

import { Children, type ReactNode, useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"

/**
 * AIFill —— 「AI 填充」特效容器。
 *
 * trigger 边沿触发一次完整流程：彩虹光晕自底部涌起、覆盖内容、向上消退，
 * 内容（直接子节点）自下而上逐条从模糊中显影。光晕完全遮住内容时回调
 * onCovered —— 这是切换内容的隐形时机（骨架 → 真实数据）。
 *
 * 任意内容都能用：
 *   <AIFill trigger={filling} onCovered={swapContent} onComplete={...}>
 *     {rows}
 *   </AIFill>
 */
const aiFillStyles = `
.aifill-bloomfield {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.aifill-blob {
  position: absolute;
  opacity: 0;
  will-change: transform, opacity;
}
/* 品红核：从底部中央升起，峰值时覆盖全部内容，然后向上飘出 */
.aifill-blob-core {
  left: -15%;
  top: 15%;
  width: 130%;
  height: 85%;
  background: radial-gradient(closest-side, rgba(232, 121, 249, 0.9), rgba(196, 132, 252, 0.55) 55%, transparent 78%);
  filter: blur(38px);
  animation: aifill-core 1.9s var(--ease-in-out) both;
}
@keyframes aifill-core {
  0% { opacity: 0; transform: translateY(42%) scale(0.55); }
  22% { opacity: 1; }
  45% { transform: translateY(-2%) scale(1.22); }
  62% { opacity: 0.85; }
  100% { opacity: 0; transform: translateY(-75%) scale(1.3); }
}
/* 顶部青蓝：峰值时才在顶部浮现，最后退场 */
.aifill-blob-top {
  left: -10%;
  top: -20%;
  width: 120%;
  height: 60%;
  background: radial-gradient(closest-side, rgba(103, 232, 249, 0.85), rgba(147, 197, 253, 0.45) 60%, transparent 78%);
  filter: blur(42px);
  animation: aifill-top 1.9s var(--ease-in-out) both;
}
@keyframes aifill-top {
  0%, 30% { opacity: 0; transform: translateY(30%) scale(0.9); }
  55% { opacity: 0.9; transform: translateY(0%) scale(1.05); }
  78% { opacity: 0.55; }
  100% { opacity: 0; transform: translateY(-35%) scale(1.1); }
}
/* 底部橙粉：贴着触发源的暖色光晕，最早亮起、随覆盖开始减弱 */
.aifill-blob-base {
  left: -20%;
  bottom: -25%;
  width: 140%;
  height: 55%;
  background:
    radial-gradient(55% 90% at 28% 90%, rgba(251, 191, 36, 0.8), transparent 70%),
    radial-gradient(55% 90% at 72% 90%, rgba(244, 114, 182, 0.75), transparent 70%);
  filter: blur(36px);
  animation: aifill-base 1.9s var(--ease-in-out) both;
}
@keyframes aifill-base {
  0% { opacity: 0; transform: translateY(20%) scale(0.8); }
  18% { opacity: 0.95; }
  55% { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(-30%) scale(1.05); }
}

/* 内容显影：从 veil 下的 blur(12px) 低饱和到清晰 */
.aifill-item {
  opacity: 0.25;
  animation: aifill-item-in 550ms var(--ease-out) both;
}
@keyframes aifill-item-in {
  from { opacity: 0.25; filter: blur(12px) saturate(0.6) brightness(1.04); }
  to { opacity: 1; filter: blur(0) saturate(1) brightness(1); }
}

@media (prefers-reduced-motion: reduce) {
  /* 保留透明度变化（帮助理解状态），去掉位移、形变和模糊 */
  .aifill-blob-core,
  .aifill-blob-top,
  .aifill-blob-base {
    animation: aifill-blob-fade 0.9s ease both;
    transform: none;
  }
  @keyframes aifill-blob-fade {
    0% { opacity: 0; }
    45% { opacity: 0.7; }
    100% { opacity: 0; }
  }
  .aifill-item {
    animation-name: aifill-item-fade;
    animation-duration: 200ms;
    animation-delay: 0ms !important;
  }
  @keyframes aifill-item-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
`

/** 光晕从触发到完全覆盖内容的时间（ms），此时切换内容不可见 */
const COVERED_MS = 300
/** 内容显影的基础延迟（相对内容挂载） */
const REVEAL_DELAY_MS = 150
/** 光晕动画总时长（ms），播完才卸载，避免提前拆掉造成跳变 */
const BLOOM_MS = 1900

export interface AIFillProps {
  /** 边沿触发：false → true 播放一次填充特效；回到 false 复位 */
  trigger: boolean
  /** 光晕完全遮住内容时回调（触发后 ~300ms）——切换内容的隐形时机 */
  onCovered?: () => void
  /** 特效播放完毕回调（触发后 ~1.9s） */
  onComplete?: () => void
  /** 直接子节点的显影间隔（ms），自下而上，默认 90 */
  stagger?: number
  className?: string
  children: ReactNode
}

export function AIFill({ trigger, onCovered, onComplete, stagger = 90, className, children }: AIFillProps) {
  const [blooming, setBlooming] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const callbacks = useRef({ onCovered, onComplete })
  useEffect(() => {
    callbacks.current = { onCovered, onComplete }
  }, [onCovered, onComplete])

  // trigger 边沿检测放在渲染期（React 认可的 adjust-state-during-render 模式），
  // 避免在 effect 里同步 setState 造成级联渲染；初始值 false 保证挂载即 true 也算边沿
  const [prevTrigger, setPrevTrigger] = useState(false)
  if (trigger !== prevTrigger) {
    setPrevTrigger(trigger)
    setBlooming(trigger)
  }

  useEffect(() => {
    if (!trigger) {
      return
    }
    timers.current.push(setTimeout(() => callbacks.current.onCovered?.(), COVERED_MS))
    timers.current.push(
      setTimeout(() => {
        setBlooming(false)
        callbacks.current.onComplete?.()
      }, BLOOM_MS),
    )
    return () => {
      for (const timer of timers.current) {
        clearTimeout(timer)
      }
      timers.current = []
    }
  }, [trigger])

  const items = Children.toArray(children)
  const last = items.length - 1

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <style>{aiFillStyles}</style>
      {items.map((child, index) => (
        <div
          // 保持子节点的 key，内容切换（骨架 → 数据）时正确重挂载并重播显影
          key={(child as React.ReactElement)?.key ?? index}
          className={trigger ? "aifill-item" : undefined}
          style={
            trigger
              ? // 自下而上的 stagger：最后一个子节点最先显影
                { animationDelay: `${REVEAL_DELAY_MS + (last - index) * stagger}ms` }
              : undefined
          }
        >
          {child}
        </div>
      ))}
      {blooming && (
        <div className="aifill-bloomfield">
          <div className="aifill-blob aifill-blob-core" />
          <div className="aifill-blob aifill-blob-top" />
          <div className="aifill-blob aifill-blob-base" />
        </div>
      )}
    </div>
  )
}
