"use client"

import { useState } from "react"

import { Checklist } from "@/registry/mayumi/ui/checklist"
import { Switch } from "@/registry/mayumi/ui/switch"

const items = [
  { id: "visual", label: "完成视觉走查" },
  { id: "keyboard", label: "验证键盘操作" },
  { id: "release", label: "准备发布构建" },
]

export function ChecklistDemo() {
  const [stackOnComplete, setStackOnComplete] = useState(true)

  return (
    <div className="mx-auto w-full max-w-sm space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-ui font-medium text-fg">发布前检查</h2>
          <p className="mt-1 text-xs text-fg-tertiary">
            开启后，全部完成时列表收合；取消任意一项即可展开。
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-xs text-fg-secondary">
          完成后堆叠
          <Switch
            aria-label="完成后堆叠"
            checked={stackOnComplete}
            onCheckedChange={setStackOnComplete}
          />
        </label>
      </div>
      <Checklist
        aria-label="发布前检查事项"
        items={items}
        stackOnComplete={stackOnComplete}
      />
    </div>
  )
}
