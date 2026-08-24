import type { ComponentType } from "react"

import { ButtonDemo } from "@/components/demos/button-demo"
import { TooltipDemo } from "@/components/demos/tooltip-demo"

export type DocEntry = {
  slug: string
  title: string
  description: string
  group: "窗口层" | "列表层" | "基础控件" | "重交互"
  notes?: string[]
  Demo: ComponentType
}

export const docs: DocEntry[] = [
  {
    slug: "button",
    title: "Button",
    description: "四种语义变体与三档尺寸的按钮，带按压反馈。",
    group: "基础控件",
    Demo: ButtonDemo,
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description: "macOS Dock 式药丸提示，自带指向目标的尾巴。",
    group: "基础控件",
    notes: [
      "arrow={false} 可关闭尾巴，side/align 控制弹出方向。",
      "125ms 快速出现，reduced-motion 下保留淡入淡出。",
    ],
    Demo: TooltipDemo,
  },
]

export function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug)
}
