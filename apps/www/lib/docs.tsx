import type { ComponentType } from "react"

import { ButtonDemo } from "@/components/demos/button-demo"
import { TooltipDemo } from "@/components/demos/tooltip-demo"
import { InputDemo } from "@/components/demos/input-demo"
import { KbdDemo } from "@/components/demos/kbd-demo"
import { SwitchDemo } from "@/components/demos/switch-demo"
import { CheckboxDemo } from "@/components/demos/checkbox-demo"
import { SliderDemo } from "@/components/demos/slider-demo"
import { SelectDemo } from "@/components/demos/select-demo"
import { SegmentedControlDemo } from "@/components/demos/segmented-control-demo"
import { DropdownMenuDemo } from "@/components/demos/dropdown-menu-demo"
import { DialogDemo } from "@/components/demos/dialog-demo"
import { ScrollAreaDemo } from "@/components/demos/scroll-area-demo"

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
  {
    slug: "input",
    title: "Input",
    description: "表单文本输入，与 SearchField 同一视觉体系。",
    group: "基础控件",
    Demo: InputDemo,
  },
  {
    slug: "kbd",
    title: "Kbd",
    description: "快捷键标签，Raycast/Linear 界面的常客。",
    group: "基础控件",
    Demo: KbdDemo,
  },
  {
    slug: "switch",
    title: "Switch",
    description: "macOS 小尺寸开关，checked 态 accent 填充。",
    group: "基础控件",
    Demo: SwitchDemo,
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description: "勾选框，指示器随状态挂载/卸载。",
    group: "基础控件",
    Demo: CheckboxDemo,
  },
  {
    slug: "slider",
    title: "Slider",
    description: "细轨白钮滑杆，键盘方向键可调。",
    group: "基础控件",
    Demo: SliderDemo,
  },
  {
    slug: "select",
    title: "Select",
    description: "macOS 双箭头下拉，vibrancy 弹层。",
    group: "基础控件",
    notes: [
      "需要 side/align 生效时组件会自动关闭 Base UI 的 alignItemWithTrigger（触发器对齐）；显式传入 alignItemWithTrigger 可覆盖该行为。",
    ],
    Demo: SelectDemo,
  },
  {
    slug: "segmented-control",
    title: "Segmented Control",
    description: "分段控件（Tabs 语义），选中段浮起。",
    group: "基础控件",
    Demo: SegmentedControlDemo,
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description: "下拉菜单，高亮项 accent 填充。",
    group: "基础控件",
    notes: [
      "side/align/sideOffset 透传给定位器。",
    ],
    Demo: DropdownMenuDemo,
  },
  {
    slug: "dialog",
    title: "Dialog",
    description: "居中确认弹窗，scrim 遮罩 + vibrancy 面板。",
    group: "基础控件",
    Demo: DialogDemo,
  },
  {
    slug: "scroll-area",
    title: "Scroll Area",
    description: "macOS 式悬浮细滚动条，滚动或悬停时出现。",
    group: "基础控件",
    Demo: ScrollAreaDemo,
  },
]

export function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug)
}
