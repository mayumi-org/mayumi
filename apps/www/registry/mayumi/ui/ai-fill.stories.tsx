import type { Meta, StoryObj } from "@storybook/react-vite"
import { Sparkle } from "lucide-react"
import { useState } from "react"

import { cn } from "@/registry/mayumi/lib/utils"
import { Button } from "@/registry/mayumi/ui/button"

import { AIFill } from "./ai-fill"

const meta: Meta<typeof AIFill> = {
  title: "ui/AIFill",
  component: AIFill,
}
export default meta

type Story = StoryObj<typeof AIFill>

const ACTIVITIES = [
  { icon: "📦", text: "Order #1042 shipped to Berlin", time: "2m ago" },
  { icon: "💬", text: "Nora commented on Q4 roadmap", time: "18m ago" },
  { icon: "🔀", text: "PR #318 merged into main", time: "1h ago" },
  { icon: "📈", text: "Weekly report is ready", time: "3h ago" },
  { icon: "🗓️", text: "Design review moved to Friday", time: "5h ago" },
]

/**
 * 通用容器用法：包任意列表。初始为骨架，trigger 后光晕覆盖，
 * onCovered（隐形时机）切换成真实内容，自下而上显影。
 */
function GenericListDemo() {
  const [state, setState] = useState<"idle" | "filling" | "done">("idle")
  const [live, setLive] = useState(false)

  function start() {
    setLive(false)
    setState("filling")
  }

  function reset() {
    setLive(false)
    setState("idle")
  }

  return (
    <div className="flex w-[420px] flex-col items-center gap-6 bg-[#f2f2f4] p-8">
      <AIFill
        trigger={state === "filling"}
        onCovered={() => setLive(true)}
        onComplete={() => setState("done")}
        className="w-full rounded-card border border-border bg-surface shadow-[var(--shadow-raised)]"
      >
        {ACTIVITIES.map((activity, index) => (
          <div
            key={activity.text}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              index < ACTIVITIES.length - 1 && "border-b border-border",
            )}
          >
            {live ? (
              <>
                <span className="text-[15px]">{activity.icon}</span>
                <span className="flex-1 truncate text-ui text-fg">{activity.text}</span>
                <span className="text-xs text-fg-tertiary">{activity.time}</span>
              </>
            ) : (
              <>
                <div className="size-5 rounded-full bg-fill-active" />
                <div className="h-2 flex-1 rounded-full bg-fill-active" style={{ maxWidth: `${55 + (index % 3) * 12}%` }} />
                <div className="h-2 w-10 rounded-full bg-fill" />
              </>
            )}
          </div>
        ))}
      </AIFill>
      <Button variant="secondary" onClick={state === "idle" ? start : reset}>
        {state === "idle" ? (
          <>
            <Sparkle aria-hidden="true" />
            AI 填充
          </>
        ) : (
          "重置"
        )}
      </Button>
    </div>
  )
}

export const GenericList: Story = {
  render: () => <GenericListDemo />,
}
