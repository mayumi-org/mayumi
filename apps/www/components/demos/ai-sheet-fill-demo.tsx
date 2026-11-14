"use client"

import { Plus, Sparkle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"
import { AIFill } from "@/registry/mayumi/ui/ai-fill"

/**
 * AI Sheet Fill —— 复刻 recent.design 的 AI 填表交互（作者 Noman），逐帧测量还原。
 *
 * Generate → 1.2s 加载（spinner + Stop）→ AIFill 光晕自底部涌起覆盖表格，
 * 按钮同步模糊切换为 Clear → 光晕向上消退、数据行自下而上显影 → Clear 复位。
 * 骨架 → 真实数据的偷换发生在 AIFill 的 onCovered 回调（光晕遮住的隐形时机）。
 */
const aiSheetFillStyles = `
/* 按钮内圈 spinner */
.ai-fill-spinner {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-top-color: rgba(0, 0, 0, 0.55);
  animation: ai-fill-spin 0.7s linear infinite;
}
@keyframes ai-fill-spin {
  to { transform: rotate(360deg); }
}

/* 按钮文案的模糊切换（原片 Stop→Clear 是 blur crossfade） */
.ai-fill-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  animation: ai-fill-label-in 260ms var(--ease-out) both;
}
@keyframes ai-fill-label-in {
  from { opacity: 0; filter: blur(5px); }
  to { opacity: 1; filter: blur(0); }
}

@media (prefers-reduced-motion: reduce) {
  .ai-fill-label {
    animation-name: ai-fill-label-fade;
    animation-duration: 120ms;
  }
  @keyframes ai-fill-label-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
`

type Stage = "Negotiation" | "Discovery" | "Proposal" | "Won"

/* 从原片像素采样的徽章配色 */
const STAGE_STYLES: Record<Stage, string> = {
  Negotiation: "bg-[#e5f1ff] text-[#3080d5]",
  Discovery: "bg-[#efefef] text-[#636462]",
  Proposal: "bg-[#fcf2e4] text-[#d99a2b]",
  Won: "bg-[#e9faeb] text-[#34a853]",
}

const DEALS: { account: string; amount: string; stage: Stage }[] = [
  { account: "Kestrel Bank", amount: "$131,200", stage: "Negotiation" },
  { account: "Morrow & Finch", amount: "$118,750", stage: "Discovery" },
  { account: "Atlas Robotics", amount: "$104,000", stage: "Proposal" },
  { account: "Tidewater Energy", amount: "$97,400", stage: "Negotiation" },
  { account: "Pinecrest Schools", amount: "$88,000", stage: "Won" },
  { account: "Solace Insurance", amount: "$83,600", stage: "Proposal" },
  { account: "Vela Mobility", amount: "$76,900", stage: "Discovery" },
  { account: "Corvid Security", amount: "$71,250", stage: "Negotiation" },
  { account: "Larkspur Foods", amount: "$64,000", stage: "Proposal" },
]

/* 骨架条的宽度排布，让空表有「曾经的」内容节奏 */
const SKELETON_WIDTHS = ["w-3/5", "w-1/2", "w-2/3", "w-2/5", "w-1/2", "w-3/5", "w-1/3", "w-1/2", "w-2/5"]

const LOADING_MS = 1200

type Phase = "idle" | "loading" | "revealing" | "done"

/** 行首窄列的圆点标记：骨架和数据态都常驻 */
function GutterDot() {
  return <span className="block size-[5px] rounded-[2px] bg-black/[0.07]" />
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <>
      <GutterDot />
      <div className={cn("h-2.5 rounded-full bg-black/[0.05]", SKELETON_WIDTHS[index % SKELETON_WIDTHS.length])} />
      <div className="h-2.5 w-12 justify-self-center rounded-full bg-black/[0.05]" />
      <div className="h-5 w-16 justify-self-center rounded-full bg-black/[0.05]" />
    </>
  )
}

function DealRow({ deal }: { deal: (typeof DEALS)[number] }) {
  return (
    <>
      <GutterDot />
      <span className="truncate text-[13px] font-medium text-neutral-800">{deal.account}</span>
      <span className="text-[13px] text-neutral-700 tabular-nums">{deal.amount}</span>
      <span>
        <span className={cn("rounded-full px-2.5 py-[3px] text-[11px] font-medium", STAGE_STYLES[deal.stage])}>
          {deal.stage}
        </span>
      </span>
    </>
  )
}

export function AISheetFillDemo({ autoplay = false }: { autoplay?: boolean }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [rowsLive, setRowsLive] = useState(false)
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (autoplay) {
      generate()
    }
    return () => clearTimeout(loadingTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function generate() {
    setPhase("loading")
    loadingTimer.current = setTimeout(() => setPhase("revealing"), LOADING_MS)
  }

  function reset() {
    clearTimeout(loadingTimer.current)
    setRowsLive(false)
    setPhase("idle")
  }

  const showSkeleton = !rowsLive
  const glowActive = phase === "revealing"

  return (
    <div className="relative w-[560px] max-w-full overflow-hidden rounded-window border border-black/[0.06] bg-[#f4f4f4] p-5">
      <style>{aiSheetFillStyles}</style>

      {/* 表格面板：AIFill 容器，trigger 边沿播放填充电效 */}
      <AIFill
        trigger={phase === "revealing"}
        onCovered={() => setRowsLive(true)}
        onComplete={() => setPhase("done")}
        className="rounded-[20px] border border-black/[0.04] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_32px_rgba(0,0,0,0.05)]"
      >
        {DEALS.map((deal, index) => (
          <div
            key={deal.account}
            className={cn(
              "grid grid-cols-[32px_1.3fr_1fr_1fr] items-center gap-x-4 px-4 py-3",
              index < DEALS.length - 1 && "border-b border-black/[0.05]",
            )}
          >
            {showSkeleton ? <SkeletonRow index={index} /> : <DealRow deal={deal} />}
          </div>
        ))}
      </AIFill>

      {/* 提示卡：表格下方的独立区域，静态 conic 辉光（WebGL EdgeGlow 在实验分支） */}
      <div className="relative mx-auto mt-5 w-[400px] max-w-[92%]">
        <div
          aria-hidden="true"
          className={cn(
            "absolute -inset-1 rounded-[24px] blur-lg transition-opacity duration-500",
            glowActive ? "opacity-70" : "opacity-0",
          )}
          style={{
            background: "conic-gradient(from 180deg, #34d399, #fbbf24, #ec4899, #3b82f6, #34d399)",
          }}
        />
        <div className="relative rounded-[22px] border border-black/[0.05] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <p className="text-[13px] leading-relaxed text-neutral-700">
            Fill this sheet with our top 12 open deals for Q4: account, region, owner, deal size, stage and expected
            close date.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Add context"
              className="flex size-7 items-center justify-center rounded-full bg-black/[0.04] text-neutral-500 transition-colors hover:bg-black/[0.07] hover:text-neutral-700"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              onClick={phase === "idle" ? generate : reset}
              className={cn(
                "flex h-8 min-w-[92px] items-center justify-center rounded-full px-4 text-[13px] font-medium outline-none transition-[background-color,color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-neutral-900/25 focus-visible:ring-offset-1",
                phase === "idle"
                  ? "bg-neutral-900 text-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] hover:bg-neutral-700"
                  : "border border-black/[0.08] bg-white text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:bg-black/[0.03]",
              )}
            >
              {phase === "idle" && (
                <span key="generate" className="ai-fill-label">
                  Generate
                </span>
              )}
              {phase === "loading" && (
                <span key="stop" className="ai-fill-label">
                  <span className="ai-fill-spinner" aria-hidden="true" />
                  Stop
                </span>
              )}
              {(phase === "revealing" || phase === "done") && (
                <span key="clear" className="ai-fill-label">
                  <Sparkle aria-hidden="true" className="size-3.5" />
                  Clear
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
