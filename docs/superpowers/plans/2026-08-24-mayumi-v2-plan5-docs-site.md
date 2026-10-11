# Mayumi v2 Plan 5 — 文档站 + README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付对外门面：数据驱动的组件文档站（22 个组件页 = live demo + 安装命令 + 注意事项 + shiki 高亮源码）、首页（hero + 设置 app 复刻 demo + ⌘K 全站导航）、暗亮主题切换（next-themes）、重写 README——mayumi v2 全部收官。

**Architecture:** 全部在 `apps/www`。`lib/docs.tsx` 是唯一数据源（22 条目：slug/标题/描述/分组/notes/Demo 组件引用），`app/components/[slug]/page.tsx` 动态路由渲染统一页模板（`generateStaticParams` 全静态化），demo 组件一件一文件放 `components/demos/`。文档站本身 dogfooding：导航 Sidebar+SidebarNav+SearchField 过滤、全站 ⌘K CommandDialog、Toaster 挂根布局。源码展示用 shiki（服务端高亮、双主题 CSS 变量）。

**Tech Stack:** next-themes 0.4.x / shiki 4.x（均为 www 页面依赖，不进任何 registry item）/ 既有 22 组件。

**Spec:** `docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`（§5 文档站、§6 README）

**前置状态：** Plan 1–4 完成（HEAD b9f651f），73/73 测试绿，registry 25 项/26 JSON，Tooltip 已带 Dock 式尾巴。

## Global Constraints

- 工作分支 `bigsur`；conventional commits；每任务至少一次提交；不 push。
- 文档站页面同样只用 theme.css tokens；图标用 lucide-react（www 页面依赖合法，禁进 registry item）；大标题负字距 `tracking-[-0.02em]`（apple review 遗留）。
- next-themes：`attribute="class"`、`defaultTheme="dark"`、`enableSystem`；根 html 移除硬编码 `dark` 类并加 `suppressHydrationWarning`；暗↔亮切换带 200ms 颜色过渡（apple review 遗留——globals.css 内实现，曲线值与 `--ease-out` token 同源，注释注明）。
- `Toaster` 在根布局 mount 一次（Plan 4 终审遗留）。
- 文档必写事项（Plan 3/4 审查遗留，落在对应组件的 notes）：SearchField 的 className→wrapper/其余 props→input；GroupedListItem 靠 onClick 变互动、静态行忽略 button 专有 props；Toaster 的 toastOptions 整体替换非合并；Select 的 side/align 与 alignItemWithTrigger 关系；TrafficLights 的 Tauri/Electron 接线示例；图标自带、推荐 lucide（quickstart）。
- 文档站页面不写单元测试（组件行为已有 73 测试覆盖；页面验收 = 构建绿 + 人工目检）；既有测试保持 73/73。
- shiki/next-themes API 以安装版为准，偏差最小适配并记录。
- registry 源文件（`registry/mayumi/**`）本计划**只读**——若发现组件缺陷记入报告交控制者，不得顺手改。

---

### Task 1: 文档站基建 + 组件页模板（含 button/tooltip 试点）

**Files:**
- Modify: `apps/www/app/layout.tsx`（ThemeProvider + Toaster + CommandMenu 挂载）、`apps/www/app/globals.css`（主题过渡 + shiki 双主题规则）
- Create: `apps/www/components/theme-provider.tsx`, `apps/www/components/theme-toggle.tsx`, `apps/www/components/command-menu.tsx`, `apps/www/lib/docs.tsx`（先含 button/tooltip 两条目）, `apps/www/components/demos/button-demo.tsx`, `apps/www/components/demos/tooltip-demo.tsx`, `apps/www/components/code-block.tsx`, `apps/www/app/components/layout.tsx`, `apps/www/components/docs-nav.tsx`, `apps/www/app/components/[slug]/page.tsx`, `apps/www/app/components/page.tsx`

**Interfaces:**
- Produces: `DocEntry` 类型与 `docs` 数组（后续任务只追加条目+demo 文件）；`/components/<slug>` 页模板（Demo 卡片 → 安装命令 → notes → 源码）；`CodeBlock`（服务端 shiki）；`CommandMenu`（⌘K 跳转，读 `docs`）；`ThemeToggle`。

- [ ] **Step 1: 安装依赖**

```bash
pnpm --filter www add next-themes shiki
```

- [ ] **Step 2: 主题基建**

```tsx
// apps/www/components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider(
  props: React.ComponentProps<typeof NextThemesProvider>
) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      {...props}
    />
  )
}
```

```tsx
// apps/www/components/theme-toggle.tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/registry/mayumi/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="切换主题"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun aria-hidden="true" className="size-3.5 dark:hidden" />
      <Moon aria-hidden="true" className="hidden size-3.5 dark:block" />
    </Button>
  )
}
```

`app/layout.tsx` 全量替换：

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { CommandMenu } from "@/components/command-menu"
import { Toaster } from "@/registry/mayumi/ui/toast"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "mayumi",
  description:
    "Mac-style React components for building desktop-grade app UIs (Raycast / Linear aesthetic).",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <CommandMenu />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`globals.css` 末尾追加：

```css
/* 暗亮切换的明度过渡（曲线同 --ease-out token，apple review 要求缓和跳变） */
html,
body {
  transition:
    background-color 200ms cubic-bezier(0.23, 1, 0.32, 1),
    color 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

/* shiki 双主题（defaultColor:false 输出的 CSS 变量按主题切换） */
.shiki,
.shiki code {
  background-color: transparent !important;
}
.shiki span {
  color: var(--shiki-dark);
}
html:not(.dark) .shiki span {
  color: var(--shiki-light);
}
```

- [ ] **Step 3: docs 数据模块（试点两条目）**

```tsx
// apps/www/lib/docs.tsx
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
```

- [ ] **Step 4: 试点 demos**

```tsx
// apps/www/components/demos/button-demo.tsx
import { Button } from "@/registry/mayumi/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="primary">主要</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="ghost">幽灵</Button>
      <Button variant="danger">危险</Button>
      <Button disabled>禁用</Button>
    </div>
  )
}
```

```tsx
// apps/www/components/demos/tooltip-demo.tsx
"use client"

import { Button } from "@/registry/mayumi/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/mayumi/ui/tooltip"

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary">悬停</Button>} />
          <TooltipContent>ChatGPT</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost">无尾</Button>} />
          <TooltipContent arrow={false}>极简模式</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
```

- [ ] **Step 5: CodeBlock（服务端 shiki）**

```tsx
// apps/www/components/code-block.tsx
import { codeToHtml } from "shiki"

export async function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string
  lang?: string
}) {
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  return (
    <div
      className="overflow-x-auto rounded-card border border-border bg-surface p-4 text-xs leading-relaxed"
      // shiki 输出为可信的本地生成 HTML
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **Step 6: 文档 shell 与导航**

```tsx
// apps/www/components/docs-nav.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { DocEntry } from "@/lib/docs"
import { SearchField } from "@/registry/mayumi/ui/search-field"
import {
  SidebarNav,
  SidebarNavItem,
} from "@/registry/mayumi/ui/sidebar-nav"

const GROUPS: DocEntry["group"][] = ["窗口层", "列表层", "基础控件", "重交互"]

export function DocsNav({ entries }: { entries: DocEntry[] }) {
  const pathname = usePathname()
  const [query, setQuery] = useState("")
  const filtered = entries.filter((e) =>
    (e.title + e.slug).toLowerCase().includes(query.toLowerCase())
  )
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <SearchField
        placeholder="搜索组件"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        {GROUPS.map((group) => {
          const items = filtered.filter((e) => e.group === group)
          if (items.length === 0) return null
          return (
            <div key={group}>
              <p className="px-2 pb-1 text-xs text-fg-tertiary">{group}</p>
              <SidebarNav>
                {items.map((e) => (
                  <Link key={e.slug} href={`/components/${e.slug}`}>
                    <SidebarNavItem
                      active={pathname === `/components/${e.slug}`}
                      tabIndex={-1}
                    >
                      {e.title}
                    </SidebarNavItem>
                  </Link>
                ))}
              </SidebarNav>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

```tsx
// apps/www/app/components/layout.tsx
import Link from "next/link"

import { DocsNav } from "@/components/docs-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { docs } from "@/lib/docs"
import { Kbd } from "@/registry/mayumi/ui/kbd"
import { Sidebar } from "@/registry/mayumi/ui/sidebar"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar width={240} className="h-full">
        <div className="flex items-center justify-between px-1 pt-1">
          <Link href="/" className="text-ui font-semibold text-fg">
            mayumi
          </Link>
          <ThemeToggle />
        </div>
        <DocsNav entries={docs} />
        <p className="flex items-center gap-1 px-1 text-xs text-fg-tertiary">
          随处可按 <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </p>
      </Sidebar>
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-8 py-10">{children}</div>
      </main>
    </div>
  )
}
```

- [ ] **Step 7: 组件页模板 + 索引重定向**

```tsx
// apps/www/app/components/[slug]/page.tsx
import { promises as fs } from "node:fs"
import path from "node:path"
import { notFound } from "next/navigation"

import { CodeBlock } from "@/components/code-block"
import { docs, getDoc } from "@/lib/docs"

export const dynamicParams = false

export function generateStaticParams() {
  return docs.map((d) => ({ slug: d.slug }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc) notFound()
  const source = await fs.readFile(
    path.join(process.cwd(), "registry/mayumi/ui", `${slug}.tsx`),
    "utf-8"
  )
  return (
    <article className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-fg">
          {doc.title}
        </h1>
        <p className="mt-1 text-ui text-fg-secondary">{doc.description}</p>
      </header>

      <section className="rounded-card border border-border bg-surface p-8">
        <doc.Demo />
      </section>

      <section className="space-y-2">
        <h2 className="text-ui font-semibold text-fg">安装</h2>
        <CodeBlock
          lang="bash"
          code={`npx shadcn@latest add https://mayumi.netlify.app/r/${slug}.json`}
        />
        <p className="text-xs text-fg-tertiary">
          在 components.json 配置 registries 后也可用
          `npx shadcn add @mayumi/{slug}`（见首页快速开始）。
        </p>
      </section>

      {doc.notes?.length ? (
        <section className="space-y-2">
          <h2 className="text-ui font-semibold text-fg">注意事项</h2>
          <ul className="list-disc space-y-1 pl-5 text-ui leading-relaxed text-fg-secondary">
            {doc.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="text-ui font-semibold text-fg">源码</h2>
        <CodeBlock code={source} />
      </section>
    </article>
  )
}
```

```tsx
// apps/www/app/components/page.tsx
import { redirect } from "next/navigation"

import { docs } from "@/lib/docs"

export default function ComponentsIndex() {
  redirect(`/components/${docs[0].slug}`)
}
```

- [ ] **Step 8: CommandMenu（⌘K 全站跳转）**

```tsx
// apps/www/components/command-menu.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { docs } from "@/lib/docs"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/mayumi/ui/command"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="组件导航">
      <CommandInput placeholder="跳转到组件…" autoFocus />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandGroup heading="组件">
          {docs.map((d) => (
            <CommandItem
              key={d.slug}
              value={`${d.title} ${d.slug}`}
              onSelect={() => {
                setOpen(false)
                router.push(`/components/${d.slug}`)
              }}
            >
              {d.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

（⌘K 打开/关闭是键盘高频操作——面板本身沿用 Dialog 的 200ms 过渡即可，不额外加动画。）

- [ ] **Step 9: 验证**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build`
Expected: 73/73；build 通过且静态生成 `/components/button`、`/components/tooltip`。再 `pnpm dev` 目检：暗亮切换有 200ms 过渡、⌘K 呼出面板、两页 demo/源码渲染正常。

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: docs site shell with data-driven component pages"
```

---

### Task 2: 基础控件 demos ×10（批量，同型工作）

**Files:**
- Create: `apps/www/components/demos/{input,kbd,switch,checkbox,slider,select,segmented-control,dropdown-menu,dialog,scroll-area}-demo.tsx`
- Modify: `apps/www/lib/docs.tsx`（追加 10 条目）

**Interfaces:**
- Consumes: Task 1 的 `DocEntry`；各 registry 组件。
- Produces: `/components/{input,kbd,switch,checkbox,slider,select,segmented-control,dropdown-menu,dialog,scroll-area}` 页。

- [ ] **Step 1: demos（内容取各组件 stories 的精华，紧凑即可；交互组件加 "use client"）**

```tsx
// input-demo.tsx
import { Input } from "@/registry/mayumi/ui/input"

export function InputDemo() {
  return (
    <div className="w-64 space-y-2">
      <Input placeholder="名称" />
      <Input placeholder="禁用" disabled />
    </div>
  )
}
```

```tsx
// kbd-demo.tsx
import { Kbd } from "@/registry/mayumi/ui/kbd"

export function KbdDemo() {
  return (
    <p className="flex items-center gap-1 text-ui text-fg-secondary">
      打开命令面板 <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </p>
  )
}
```

```tsx
// switch-demo.tsx
import { Switch } from "@/registry/mayumi/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-4">
      <Switch aria-label="关闭态" />
      <Switch aria-label="开启态" defaultChecked />
      <Switch aria-label="禁用" disabled />
    </div>
  )
}
```

```tsx
// checkbox-demo.tsx
import { Checkbox } from "@/registry/mayumi/ui/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="未选" />
      <Checkbox aria-label="已选" defaultChecked />
      <Checkbox aria-label="禁用" disabled />
    </div>
  )
}
```

```tsx
// slider-demo.tsx
import { Slider } from "@/registry/mayumi/ui/slider"

export function SliderDemo() {
  return (
    <div className="w-64">
      <Slider aria-label="音量" defaultValue={30} />
    </div>
  )
}
```

```tsx
// select-demo.tsx
"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/mayumi/ui/select"

export function SelectDemo() {
  return (
    <Select defaultValue="auto">
      <SelectTrigger aria-label="外观">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">自动</SelectItem>
        <SelectItem value="light">浅色</SelectItem>
        <SelectItem value="dark">深色</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

```tsx
// segmented-control-demo.tsx
"use client"

import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
} from "@/registry/mayumi/ui/segmented-control"

export function SegmentedControlDemo() {
  return (
    <SegmentedControl defaultValue="list" className="w-72">
      <SegmentedControlList aria-label="视图">
        <SegmentedControlItem value="list">列表</SegmentedControlItem>
        <SegmentedControlItem value="grid">网格</SegmentedControlItem>
        <SegmentedControlItem value="column">分栏</SegmentedControlItem>
      </SegmentedControlList>
      <SegmentedControlPanel value="list" className="text-ui text-fg-secondary">
        列表视图
      </SegmentedControlPanel>
      <SegmentedControlPanel value="grid" className="text-ui text-fg-secondary">
        网格视图
      </SegmentedControlPanel>
      <SegmentedControlPanel value="column" className="text-ui text-fg-secondary">
        分栏视图
      </SegmentedControlPanel>
    </SegmentedControl>
  )
}
```

```tsx
// dropdown-menu-demo.tsx
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/mayumi/ui/dropdown-menu"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>操作</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>重命名</DropdownMenuItem>
        <DropdownMenuItem>复制</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="data-highlighted:bg-danger">
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

```tsx
// dialog-demo.tsx
"use client"

import { Button } from "@/registry/mayumi/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/registry/mayumi/ui/dialog"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="danger">删除项目</Button>} />
      <DialogContent>
        <DialogTitle>确认删除？</DialogTitle>
        <DialogDescription>
          项目将被移到废纸篓，此操作不可撤销。
        </DialogDescription>
        <div className="mt-4 flex justify-end gap-2">
          <DialogClose render={<Button variant="secondary">取消</Button>} />
          <DialogClose render={<Button variant="danger">删除</Button>} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

```tsx
// scroll-area-demo.tsx
import { ScrollArea } from "@/registry/mayumi/ui/scroll-area"

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-48 w-64 rounded-card border border-border bg-surface">
      <div className="p-3 text-ui text-fg-secondary">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="py-1">
            列表行 {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
```

- [ ] **Step 2: docs.tsx 追加 10 条目（import 对应 demo；描述与 notes 如下）**

| slug | description | notes |
| --- | --- | --- |
| input | 表单文本输入，与 SearchField 同一视觉体系。 | — |
| kbd | 快捷键标签，Raycast/Linear 界面的常客。 | — |
| switch | macOS 小尺寸开关，checked 态 accent 填充。 | — |
| checkbox | 勾选框，指示器随状态挂载/卸载。 | — |
| slider | 细轨白钮滑杆，键盘方向键可调。 | — |
| select | macOS 双箭头下拉，vibrancy 弹层。 | "需要 side/align 生效时组件会自动关闭 Base UI 的 alignItemWithTrigger（触发器对齐）；显式传入 alignItemWithTrigger 可覆盖该行为。" |
| segmented-control | 分段控件（Tabs 语义），选中段浮起。 | — |
| dropdown-menu | 下拉菜单，高亮项 accent 填充。 | "side/align/sideOffset 透传给定位器。" |
| dialog | 居中确认弹窗，scrim 遮罩 + vibrancy 面板。 | — |
| scroll-area | macOS 式悬浮细滚动条，滚动或悬停时出现。 | — |

- [ ] **Step 3: 验证 + Commit**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build`
Expected: 73/73；12 个组件页静态生成。

```bash
git add -A && git commit -m "feat: docs pages for base controls"
```

---

### Task 3: 窗口层 + 列表层 + 重交互 demos ×10（批量）

**Files:**
- Create: `apps/www/components/demos/{window,titlebar,toolbar,traffic-lights,sidebar,sidebar-nav,search-field,grouped-list,command,toast}-demo.tsx`
- Modify: `apps/www/lib/docs.tsx`（追加 10 条目——至此 22 条全齐）

**Interfaces:**
- Produces: 其余 10 个组件页；`docs` 数组完整（22 条）。

- [ ] **Step 1: demos（要点如下，写法沿用 Task 2 的紧凑风格；窗口层 demo 统一包在固定尺寸容器里展示）**

- `window-demo`：Solid 与 vibrancy 两个 240px 高小窗并排（vibrancy 版垫渐变底色展示毛玻璃）。
- `titlebar-demo`：Window + TitleBar + Toolbar（返回按钮 `app-region-no-drag` 示范）+ ToolbarTitle。
- `toolbar-demo`：Toolbar + ToolbarTitle + 右侧 Button 组。
- `traffic-lights-demo`（"use client"）：controls 模式（onClose 等回调 `toast("clicked close")` 顺便 dogfood Toast）与 inset 占位模式并排对比。
- `sidebar-demo`（"use client"）：useState 收合切换（复用 sidebar story 的组合）。
- `sidebar-nav-demo`：SidebarNav + 彩色 SidebarNavIcon + active 态。
- `search-field-demo`：受控输入示例。
- `grouped-list-demo`（"use client"）：交互行（chevron+onClick）与静态行（value=Switch 组件）混排——即设置 demo 的精华段。
- `command-demo`（"use client"）：内嵌 Command 面板（Window 包裹，输入过滤 + 分组 + CommandShortcut）。
- `toast-demo`（"use client"）：两个按钮触发 `toast(...)`（Toaster 已在根布局，不重复 mount——demo 里注释说明）。

- [ ] **Step 2: docs.tsx 追加 10 条目（描述自拟一句话；notes 必写项）**

| slug | notes |
| --- | --- |
| window | "vibrancy 模式用于 Tauri/Electron 透明窗口场景；配合 .mayumi-vibrancy 的无障碍降级自动生效。" |
| titlebar | "TitleBar 是拖拽区（data-tauri-drag-region + -webkit-app-region）；其中的交互元素记得加 app-region-no-drag。" |
| toolbar | — |
| traffic-lights | "组件不依赖 Tauri/Electron API，窗口控制走回调。" + 两段接线示例（见 Step 3） |
| sidebar | "collapsed 为受控属性；收合时自动 aria-hidden + inert；reduced-motion 下瞬时切换。" |
| sidebar-nav | "图标底座颜色经 className 传入（内容而非 chrome）；图标自带，推荐 lucide-react。" |
| search-field | "className 作用于外层容器；其余 props（含 data-*、placeholder）落在内部 input 上。" |
| grouped-list | "传入 onClick 的行渲染为 button 并获得 hover/disabled 反馈；静态行是 div，button 专有 props 会被忽略。" |
| command | "CommandDialog 的 title prop 提供屏幕阅读器名称（默认「命令面板」）。" |
| toast | "Toaster 全应用只 mount 一次；toastOptions 传入时整体替换默认皮肤（非深合并）——自定义请从默认 classNames 复制修改。" |

- [ ] **Step 3: TrafficLights 接线示例（渲染在其 demo 组件下方的两个 CodeBlock……demo 是客户端组件不能用异步 CodeBlock，改为在 `lib/docs.tsx` 的该条目加 `wiring` 字段并在页模板渲染）**

`DocEntry` 增加可选字段 `wiring?: { label: string; code: string }[]`；页模板在 notes 之后渲染（每段一个 `CodeBlock lang="tsx"`）。traffic-lights 条目：

```ts
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
]
```

- [ ] **Step 4: 验证 + Commit**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build`
Expected: 73/73；22 个组件页全部静态生成。

```bash
git add -A && git commit -m "feat: docs pages for window, list and heavy components"
```

---

### Task 4: 首页（hero + 设置 demo + quickstart）

**Files:**
- Create: `apps/www/components/demos/settings-window.tsx`（页面版设置 demo，改编自 settings-demo story：可收合侧栏 + 真实 Switch/Select/Slider + TrafficLights 回调触发 toast）
- Modify: `apps/www/app/page.tsx`（全量替换）

**Interfaces:**
- Produces: 首页 = hero（负字距大标题 + 一句定位 + 「浏览组件」按钮 + ⌘K 提示）→ 设置窗口 demo（招牌）→ quickstart（registries 配置 + add 命令 + 「图标自带推荐 lucide」说明）→ footer（GitHub / Netlify 链接）。

- [ ] **Step 1: `settings-window.tsx`**（"use client"；以 `settings-demo.stories.tsx` 的组合为基础，外层去掉 Storybook 包装，加 useState 收合按钮与 TrafficLights→toast 接线；尺寸 `h-[560px] w-full max-w-[860px]`。）

- [ ] **Step 2: `app/page.tsx`**

```tsx
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { SettingsWindow } from "@/components/demos/settings-window"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/registry/mayumi/ui/button"
import { Kbd } from "@/registry/mayumi/ui/kbd"

const REGISTRY_CONFIG = `{
  "registries": {
    "@mayumi": "https://mayumi.netlify.app/r/{name}.json"
  }
}`

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-8 pb-24">
      <nav className="flex h-14 items-center justify-between">
        <span className="text-ui font-semibold text-fg">mayumi</span>
        <div className="flex items-center gap-2">
          <Link href="/components">
            <Button variant="ghost" tabIndex={-1}>
              组件
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <section className="py-16 text-center">
        <h1 className="text-5xl font-semibold tracking-[-0.02em] text-fg">
          Mac-style React 组件
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ui leading-relaxed text-fg-secondary">
          Raycast / Linear 质感的桌面级 UI。shadcn registry 分发——代码拷进你的项目，
          你完全拥有它。为 Tauri 与 Electron 而生。
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/components">
            <Button variant="primary" size="lg" tabIndex={-1}>
              浏览组件
            </Button>
          </Link>
          <p className="flex items-center gap-1 text-xs text-fg-tertiary">
            或按 <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </p>
        </div>
      </section>

      <section className="flex justify-center">
        <SettingsWindow />
      </section>

      <section className="mx-auto mt-20 max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold tracking-[-0.02em] text-fg">
          快速开始
        </h2>
        <p className="text-ui text-fg-secondary">
          1. 在项目的 components.json 中注册 mayumi：
        </p>
        <CodeBlock lang="json" code={REGISTRY_CONFIG} />
        <p className="text-ui text-fg-secondary">2. 添加组件：</p>
        <CodeBlock lang="bash" code="npx shadcn@latest add @mayumi/button" />
        <p className="text-xs leading-relaxed text-fg-tertiary">
          组件源码直接进入你的项目。图标不随组件捆绑——demo 与文档使用
          lucide-react，推荐你的项目也用它。
        </p>
      </section>

      <footer className="mt-24 border-t border-border pt-6 text-center text-xs text-fg-tertiary">
        MIT · <a className="hover:text-fg" href="https://github.com/mayumi-org/mayumi">GitHub</a>
      </footer>
    </main>
  )
}
```

- [ ] **Step 3: 验证 + Commit**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build`
Expected: 全绿。`pnpm dev` 目检首页：hero 字距、设置 demo 可交互（收合/开关/红绿灯点击弹 toast）、⌘K 可跳转。

```bash
git add -A && git commit -m "feat: docs home with hero and settings showcase"
```

---

### Task 5: README 重写 + 收官对账

**Files:**
- Rewrite: `README.md`
- Modify（仅对账后确需时）: `docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`

**Interfaces:**
- Produces: 面向使用者的 README；spec §5/§6 逐条对账记录。

- [ ] **Step 1: 重写 `README.md`**

```markdown
<h1 align="center">mayumi</h1>

<p align="center">Mac-style React components for building desktop-grade app UIs.<br/>Raycast / Linear aesthetic · Built for Tauri & Electron · You own the code.</p>

<p align="center"><a href="https://mayumi.netlify.app">文档</a> · <a href="https://mayumi.netlify.app/components">组件</a></p>

## 特性

- **22 个 mac-style 组件**：窗口 chrome（红绿灯/标题栏/侧栏）、设置风格列表、全套基础控件、⌘K 命令面板与通知
- **shadcn registry 分发**：源码拷贝进你的项目，不是黑盒 npm 包
- **Base UI primitives**：键盘导航与 ARIA 开箱即用
- **Apple 动效基调**：临界阻尼 spring、125–200ms 弹层过渡、reduced-motion 全覆盖
- **暗色优先**：完整双主题 tokens，毛玻璃材质自带无障碍降级

## 快速开始

在 `components.json` 注册 registry：

```json
{
  "registries": {
    "@mayumi": "https://mayumi.netlify.app/r/{name}.json"
  }
}
```

添加组件：

```bash
npx shadcn@latest add @mayumi/button
```

或直接用完整 URL：

```bash
npx shadcn@latest add https://mayumi.netlify.app/r/button.json
```

图标不随组件捆绑；文档与 demo 使用 [lucide-react](https://lucide.dev)，推荐搭配使用。

## 开发

```bash
pnpm install
pnpm dev          # 文档站 (localhost:3000)
pnpm storybook    # 组件工作台 (localhost:6006)
pnpm test         # vitest
pnpm typecheck    # stories 类型检查
```

组件源码在 `apps/www/registry/mayumi/`，`shadcn build` 生成 `public/r/*.json` 分发产物（CI 校验新鲜度）。

## License

MIT
```

- [ ] **Step 2: spec §5/§6 对账**

逐条核对并在报告中记录：每组件一页 ✓、首页设置 demo ✓、dogfooding ✓、next-themes ✓、README 重写 ✓、Netlify 配置（已在 Plan 1 就位）✓。若 spec 有过时表述（如 §5 提及的组件页形态与实现不符）做最小修订；无需改动则记录「无偏差」。

- [ ] **Step 3: 全量收官验证 + Commit**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build && pnpm --filter storybook build && pnpm --filter www exec shadcn build && git diff --exit-code apps/www/public/r`
Expected: 全绿、registry 产物零漂移。

```bash
git add -A && git commit -m "docs: rewrite readme, finalize v2"
```

（部署验证——push 后到 Netlify deploy preview 手动确认 `/r/button.json` 可访问且带 CORS 头、首页/组件页/⌘K 正常——属维护者动作，计划内不执行 push。）

---

## Self-Review 结果

- **Spec coverage**：§5 文档站（每组件一页 live demo+源码+安装命令 ✓ Task 1–3；首页设置 demo ✓ Task 4；dogfooding ✓ shell/A⌘K/Toaster；next-themes ✓ Task 1）；§6 README 重写 ✓ Task 5；Netlify 已就位仅验证。遗留必写事项（SearchField/GroupedList/Toast/Select/TrafficLights 接线/图标策略）全部落位到 notes/quickstart；apple review 两项遗留（主题切换过渡、大标题负字距）落位 Task 1/4。
- **Placeholder scan**：Task 3 demos 与 Task 4 settings-window 以要点描述 + 既有 story 为蓝本（story 代码在仓库内可查，实现者有完整参照——非 TBD）；其余全部 verbatim。
- **Type consistency**：`DocEntry`/`docs`/`getDoc` 在 Task 1 定义，Task 2/3 只追加条目；`wiring` 字段在 Task 3 显式扩展类型并同步页模板；所有 demo 均消费既有组件导出（与 registry 实际导出逐一核对：`TooltipTrigger render`、`DialogClose render`、`CommandDialog title`、`SidebarNavItem active` 均存在）；registry 源码本计划只读。
