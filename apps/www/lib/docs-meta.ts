export type DocMeta = {
  slug: string
  title: string
  description: string
  group: "窗口层" | "列表层" | "基础控件" | "重交互"
  notes?: string[]
  wiring?: { label: string; code: string }[]
}

export const docsMeta: DocMeta[] = [
  {
    slug: "window",
    title: "Window",
    description: "窗口容器，vibrancy 模式呈现毛玻璃质感的透明背景。",
    group: "窗口层",
    notes: [
      "vibrancy 模式用于 Tauri/Electron 透明窗口场景；配合 .mayumi-vibrancy 的无障碍降级自动生效。",
    ],
  },
  {
    slug: "titlebar",
    title: "TitleBar",
    description: "可拖拽的窗口标题栏，容纳 Toolbar 与窗口控制。",
    group: "窗口层",
    notes: [
      "TitleBar 是拖拽区（data-tauri-drag-region + -webkit-app-region）；其中的交互元素记得加 app-region-no-drag。",
    ],
  },
  {
    slug: "toolbar",
    title: "Toolbar",
    description: "标题栏内的工具条布局，标题居左、操作按钮居右。",
    group: "窗口层",
  },
  {
    slug: "traffic-lights",
    title: "TrafficLights",
    description: "红绿灯窗口控制按钮，controls 与 inset 两种模式。",
    group: "窗口层",
    notes: ["组件不依赖 Tauri/Electron API，窗口控制走回调。"],
    wiring: [
      {
        label: "Tauri v2",
        code: `import { getCurrentWindow } from "@tauri-apps/api/window"

const win = getCurrentWindow()
<TrafficLights
  onClose={() => win.close()}
  onMinimize={() => win.minimize()}
  onZoom={() => win.toggleMaximize()}
/>`,
      },
      {
        label: "Electron（渲染进程经 preload 暴露 windowControls）",
        code: `<TrafficLights
  onClose={() => window.windowControls.close()}
  onMinimize={() => window.windowControls.minimize()}
  onZoom={() => window.windowControls.toggleMaximize()}
/>`,
      },
    ],
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    description: "可收合侧边栏，弹簧动画驱动宽度变化。",
    group: "窗口层",
    notes: [
      "collapsed 为受控属性；收合时自动 aria-hidden + inert；reduced-motion 下瞬时切换。",
      "floating 开启悬浮岛式（macOS Tahoe 风格）：圆角独立面板、与窗口边缘留距。",
    ],
  },
  {
    slug: "sidebar-nav",
    title: "SidebarNav",
    description: "侧边栏导航列表，色块图标 + 选中态。",
    group: "列表层",
    notes: [
      "图标底座颜色经 className 传入（内容而非 chrome）；图标自带，推荐 lucide-react。",
    ],
  },
  {
    slug: "grouped-list",
    title: "GroupedList",
    description: "macOS 设置式分组列表，交互行与静态行混排。",
    group: "列表层",
    notes: [
      "传入 onClick 的行渲染为 button 并获得 hover/disabled 反馈；静态行是 div，button 专有 props 会被忽略。",
    ],
  },
  {
    slug: "search-field",
    title: "SearchField",
    description: "带搜索图标的输入框，用于侧边栏或工具栏。",
    group: "列表层",
    notes: [
      "className 作用于外层容器；其余 props（含 data-*、placeholder）落在内部 input 上。",
    ],
  },
  {
    slug: "button",
    title: "Button",
    description: "四种语义变体与三档尺寸的按钮，带按压反馈。",
    group: "基础控件",
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
  },
  {
    slug: "input",
    title: "Input",
    description: "表单文本输入，与 SearchField 同一视觉体系。",
    group: "基础控件",
  },
  {
    slug: "kbd",
    title: "Kbd",
    description: "快捷键标签，Raycast/Linear 界面的常客。",
    group: "基础控件",
  },
  {
    slug: "switch",
    title: "Switch",
    description: "macOS 小尺寸开关，checked 态 accent 填充。",
    group: "基础控件",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description: "勾选框，指示器随状态挂载/卸载。",
    group: "基础控件",
  },
  {
    slug: "slider",
    title: "Slider",
    description: "细轨白钮滑杆，键盘方向键可调。",
    group: "基础控件",
  },
  {
    slug: "select",
    title: "Select",
    description: "macOS 双箭头下拉，vibrancy 弹层。",
    group: "基础控件",
    notes: [
      "需要 side/align 生效时组件会自动关闭 Base UI 的 alignItemWithTrigger（触发器对齐）；显式传入 alignItemWithTrigger 可覆盖该行为。",
    ],
  },
  {
    slug: "segmented-control",
    title: "Segmented Control",
    description: "分段控件（Tabs 语义），选中段浮起。",
    group: "基础控件",
  },
  {
    slug: "dropdown-menu",
    title: "Dropdown Menu",
    description: "下拉菜单，高亮项 accent 填充。",
    group: "基础控件",
    notes: [
      "side/align/sideOffset 透传给定位器。",
    ],
  },
  {
    slug: "dialog",
    title: "Dialog",
    description: "居中确认弹窗，scrim 遮罩 + vibrancy 面板。",
    group: "基础控件",
  },
  {
    slug: "scroll-area",
    title: "Scroll Area",
    description: "macOS 式悬浮细滚动条，滚动或悬停时出现。",
    group: "基础控件",
  },
  {
    slug: "command",
    title: "Command",
    description: "命令面板，支持输入过滤、分组与快捷键提示。",
    group: "重交互",
    notes: ["CommandDialog 的 title prop 提供屏幕阅读器名称（默认「命令面板」）。"],
  },
  {
    slug: "toast",
    title: "Toast",
    description: "轻量通知，基于 sonner 定制外观。",
    group: "重交互",
    notes: [
      "Toaster 全应用只 mount 一次；toastOptions 传入时整体替换默认皮肤（非深合并）——自定义请从默认 classNames 复制修改。",
    ],
  },
]
