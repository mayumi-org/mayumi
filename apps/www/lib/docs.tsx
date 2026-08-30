import type { ComponentType } from "react"

import { ButtonDemo } from "@/components/demos/button-demo"
import { TooltipDemo } from "@/components/demos/tooltip-demo"
import { InputDemo } from "@/components/demos/input-demo"
import { TextareaDemo } from "@/components/demos/textarea-demo"
import { KbdDemo } from "@/components/demos/kbd-demo"
import { SwitchDemo } from "@/components/demos/switch-demo"
import { CheckboxDemo } from "@/components/demos/checkbox-demo"
import { SliderDemo } from "@/components/demos/slider-demo"
import { SelectDemo } from "@/components/demos/select-demo"
import { SegmentedControlDemo } from "@/components/demos/segmented-control-demo"
import { DropdownMenuDemo } from "@/components/demos/dropdown-menu-demo"
import { DialogDemo } from "@/components/demos/dialog-demo"
import { ScrollAreaDemo } from "@/components/demos/scroll-area-demo"
import { WindowDemo } from "@/components/demos/window-demo"
import { TitlebarDemo } from "@/components/demos/titlebar-demo"
import { ToolbarDemo } from "@/components/demos/toolbar-demo"
import { TrafficLightsDemo } from "@/components/demos/traffic-lights-demo"
import { SidebarDemo } from "@/components/demos/sidebar-demo"
import { SidebarNavDemo } from "@/components/demos/sidebar-nav-demo"
import { GroupedListDemo } from "@/components/demos/grouped-list-demo"
import { SearchFieldDemo } from "@/components/demos/search-field-demo"
import { CommandDemo } from "@/components/demos/command-demo"
import { ToastDemo } from "@/components/demos/toast-demo"
import { AvatarDemo } from "@/components/demos/avatar-demo"
import { CardDemo } from "@/components/demos/card-demo"
import { TabsDemo } from "@/components/demos/tabs-demo"
import { CollapsibleSectionDemo } from "@/components/demos/collapsible-section-demo"
import { EmptyStateDemo } from "@/components/demos/empty-state-demo"
import { ListToolbarDemo } from "@/components/demos/list-toolbar-demo"
import { docsMeta, type DocMeta } from "@/lib/docs-meta"

export type { DocMeta }

export type DocEntry = DocMeta & { Demo: ComponentType }

// 按 slug 索引的 demo 组件表。这个文件只应被 Server Component（[slug]/page.tsx）
// 静态导入 —— 每个 Demo 自身及其依赖都会被打进导入方的模块图。客户端组件（如
// command-menu.tsx）和跨路由共享的 layout 应改用 @/lib/docs-meta 里纯数据的
// docsMeta，避免把全部 29 个 demo 一起塞进每个页面的 client bundle。
const demos: Record<string, ComponentType> = {
  window: WindowDemo,
  titlebar: TitlebarDemo,
  toolbar: ToolbarDemo,
  "traffic-lights": TrafficLightsDemo,
  sidebar: SidebarDemo,
  "sidebar-nav": SidebarNavDemo,
  "grouped-list": GroupedListDemo,
  card: CardDemo,
  "collapsible-section": CollapsibleSectionDemo,
  "list-toolbar": ListToolbarDemo,
  "empty-state": EmptyStateDemo,
  "search-field": SearchFieldDemo,
  button: ButtonDemo,
  tooltip: TooltipDemo,
  input: InputDemo,
  textarea: TextareaDemo,
  kbd: KbdDemo,
  switch: SwitchDemo,
  checkbox: CheckboxDemo,
  slider: SliderDemo,
  select: SelectDemo,
  "segmented-control": SegmentedControlDemo,
  avatar: AvatarDemo,
  tabs: TabsDemo,
  "dropdown-menu": DropdownMenuDemo,
  dialog: DialogDemo,
  "scroll-area": ScrollAreaDemo,
  command: CommandDemo,
  toast: ToastDemo,
}

export const docs: DocEntry[] = docsMeta.map((meta) => ({
  ...meta,
  Demo: demos[meta.slug],
}))

export function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug)
}
