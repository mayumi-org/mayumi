import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"
import { Island, IslandContent } from "./island"
import { Splitter } from "./splitter"

const meta: Meta<typeof Splitter> = { title: "ui/Splitter", component: Splitter }
export default meta

function SplitterDemo() {
  const [rightWidth, setRightWidth] = useState(320)
  return (
    <div className="flex h-64 max-w-3xl bg-surface-2 p-2">
      <Island className="flex-1">
        <IslandContent className="p-4 text-ui text-fg-secondary">
          Canvas（拖拽中间间距条或聚焦后按 ← / →）
        </IslandContent>
      </Island>
      <Splitter
        value={rightWidth}
        min={220}
        max={420}
        invert
        onValueChange={setRightWidth}
        aria-label="Resize right island"
      />
      <Island style={{ width: rightWidth }} className="shrink-0">
        <IslandContent className="p-4 text-ui text-fg-secondary tabular-nums">
          Right Island · {rightWidth}px
        </IslandContent>
      </Island>
    </div>
  )
}

export const Default: StoryObj<typeof Splitter> = {
  render: () => <SplitterDemo />,
}
