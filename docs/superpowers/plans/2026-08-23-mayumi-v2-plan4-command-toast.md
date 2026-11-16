# Mayumi v2 Plan 4 — Base UI 迁移 + Command/Toast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成组件库收官——把 Base UI 迁移到稳定版新包名 `@base-ui/react`，落实 Plan 3 终审的和谐化事项，交付最后两个重交互组件 Command（cmdk，Raycast 式 ⌘K）与 Toast（sonner），registry 达到 25 项。文档站属 Plan 5（有意拆分，非缺口）。

**Architecture:** 延续既有模式（组件 + 同目录测试/stories + registry 统一注册）。Command/Toast 分别以 cmdk 与 sonner 为底座（pick-ui-library 钦定选型），皮肤走既有 tokens；Toast 的进出场动画由 sonner 内部处理（其自带 spring 质感与滑入滑出），Command 弹层复用我们的 Dialog。

**Tech Stack:** @base-ui/react 1.7.x（新包名，稳定版）/ cmdk 1.1.x / sonner 2.0.x / lucide-react / 既有 tokens 与测试基建。

**Spec:** `docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`

**前置状态：** Plan 1–3 完成（HEAD 95378a3），63/63 测试绿，registry 23 项，`@base-ui-components/react` 锁 1.0.0-rc.0（已 deprecated）。

## Global Constraints

- 工作分支 `bigsur`；conventional commits；每任务至少一次提交；不 push。
- 样式只用 theme.css tokens（含 `--surface-raised`）；图标只用 lucide-react（aria-hidden）；密集行 leading-tight。
- `data-slot` + `cn()`；**契约属性写在 `{...props}` 之后恒胜**（Task 2 会把 Plan 2 存量组件统一到此模式）；例外：组件的「可覆盖默认值」（如 Toaster 的 position）写在 spread 之前——默认值与契约的区分以任务文本为准。
- 弹层动效沿用既有约定（CSS 过渡、对称、motion-safe、`origin-(--transform-origin)`——括号写法是 Tailwind v4 变量简写，合法，已实证）。
- **迁移适配规则（Task 1 核心）**：`@base-ui/react` 1.7 相对 rc.0 可能有 API 变化。以安装版类型声明/报错为准做最小适配，逐条记录 forcing error；判定标准是既有 63 个测试全绿且组件行为与样式意图不变。若出现需要重设计组件的破坏性变化（不只是改名/签名），停下报 BLOCKED 交控制者裁决，不要自行重设计。
- cmdk/sonner 同样按安装版 API 适配（计划代码按 cmdk 1.1.x / sonner 2.0.x 编写），记录偏差。
- TDD（新组件）；测试输出 pristine；jsdom 缺口按既有 stub 模式补（Task 3 需要 `scrollIntoView` stub）。
- 测试链：63（T1 迁移门槛，不增不减）→ T2 65 → T3 69 → T4 71 → T5 71；允许 ±1，以 T5 全量为准。

---

### Task 1: Base UI 包名迁移（@base-ui-components/react → @base-ui/react 1.7）

**Files:**
- Modify: `apps/www/package.json`（换依赖）、11 个组件的 import（`input/switch/checkbox/slider/tooltip/segmented-control/select/dropdown-menu/dialog/scroll-area` + 无 `kbd`——它不引 Base UI）、`apps/www/registry.json`（11 处 dependencies 字符串）、`docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`（版本基线表与 §4 依赖行的包名/版本）
- Regenerate: `apps/www/public/r/*.json`（提交）

**Interfaces:**
- Produces: 全库 import 自 `@base-ui/react/<part>`；registry 依赖声明为 `"@base-ui/react"`；旧包从依赖中移除。后续任务基于新包。

- [ ] **Step 1: 换包**

```bash
pnpm --filter www remove @base-ui-components/react
pnpm --filter www add @base-ui/react
```

- [ ] **Step 2: 更新 import（10 个组件文件）**

统一替换 `from "@base-ui-components/react/<part>"` → `from "@base-ui/react/<part>"`。若 1.7 的子路径布局不同（以 `node_modules/@base-ui/react/package.json` 的 `exports` 为准），按实际路径适配并记录。

- [ ] **Step 3: registry.json 依赖替换**

11 个 item 的 `"@base-ui-components/react"` → `"@base-ui/react"`（checkbox/select 的数组里同样替换，lucide 不动）。

- [ ] **Step 4: 迁移门槛验证（这是本任务的验收标准）**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build && pnpm --filter storybook build`
Expected: **63/63 全绿、typecheck/构建全过**。rc.0→1.7 若有 API 变化（部件改名、props 签名、data 属性），按报错最小适配组件代码并逐条记录；任何测试断言的行为变化都要在报告里点名。

- [ ] **Step 5: spec 对账**

版本基线表 `@base-ui-components/react | 1.0.0-rc` 行改为 `@base-ui/react | 1.7.x`；删除表下方关于 RC 的说明句，改为「Base UI 已迁移至稳定版新包名（旧名 npm deprecated）」。§4 依赖选型行中的 Base UI 表述同步。

- [ ] **Step 6: 重建产物 + Commit**

```bash
pnpm --filter www exec shadcn build
git add -A && git commit -m "refactor!: migrate to @base-ui/react stable"
```

---

### Task 2: 和谐化——Positioner 透传 + props 顺序统一 + CI 条件式

**Files:**
- Modify: `apps/www/registry/mayumi/ui/{tooltip,select,dropdown-menu}.tsx`（Content 透传 side/align/sideOffset）、`{button,window,titlebar,toolbar,search-field,sidebar-nav,grouped-list,traffic-lights}.tsx`（`{...props}` 前置统一）、对应 test 文件（新增 2 个透传测试）、`.github/workflows/ci.yml`
- Regenerate: `apps/www/public/r/*.json`（提交）

**Interfaces:**
- Produces: `TooltipContent`/`SelectContent`/`DropdownMenuContent` 新增 `side?: Side; align?: Align; sideOffset?: number`（类型取自对应 Positioner 的 props，转发给 Positioner；sideOffset 既有默认值保留）；全库组件统一「`{...props}` 前置、data-slot/className/契约属性后写」。

- [ ] **Step 1: 透传实现（三个 Content，同一模式）**

以 Tooltip 为例（Select/DropdownMenu 同型改造，Positioner 类型对应换）：

```tsx
type TooltipContentProps = React.ComponentProps<typeof BaseTooltip.Popup> &
  Pick<
    React.ComponentProps<typeof BaseTooltip.Positioner>,
    "side" | "align" | "sideOffset"
  >

function TooltipContent({
  className,
  side,
  align,
  sideOffset = 6,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
        …（Popup 部分不变）
```

Select/DropdownMenu 的 `sideOffset` 默认值保持 4。

- [ ] **Step 2: 透传测试（+2）**

```tsx
// tooltip.test.tsx 追加
it("forwards side to the positioner", () => {
  render(
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>目标</TooltipTrigger>
        <TooltipContent side="bottom">提示文本</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
  expect(screen.getByText("提示文本").closest("[data-side]")).toHaveAttribute(
    "data-side",
    "bottom"
  )
})
```

```tsx
// dropdown-menu.test.tsx 追加（Demo 加 props 透传：<DropdownMenuContent side="right">）
it("forwards side to the positioner", async () => {
  render(<Demo side="right" />)
  await userEvent.click(screen.getByRole("button", { name: "操作" }))
  const item = await screen.findByRole("menuitem", { name: "重命名" })
  expect(item.closest("[data-side]")).toHaveAttribute("data-side", "right")
})
```

（`data-side` 落点若在 Popup/Positioner 之外，按安装版 data 属性最小适配断言并记录；`Demo` 组件签名相应加 `side` 参数。）

- [ ] **Step 3: props 顺序统一（机械重排，行为不变）**

对以下组件把 JSX 属性顺序改为「`{...props}` 最前，`data-slot`、`className={cn(...)}` 与其它契约属性其后」——`cn(className)` 合并语义不变，改变的仅是消费者无法再覆盖 data-slot/内部样式串/aria 契约：

- `button.tsx`（button 元素）
- `window.tsx`（Window、WindowBody）
- `titlebar.tsx`（header；`data-tauri-drag-region` 属于契约，置于 spread 后）
- `toolbar.tsx`（Toolbar、ToolbarTitle）
- `search-field.tsx`（input：`type="search"` 是可覆盖默认值，保持在 spread 前；className 移到 spread 后）
- `sidebar-nav.tsx`（SidebarNav、SidebarNavItem——`data-active`/`aria-current` 契约后置、SidebarNavIcon）
- `grouped-list.tsx`（GroupedList、GroupedListItem——`type="button"`/onClick/data-slot 后置）
- `traffic-lights.tsx`（controls 分支容器；inset 分支已是正确顺序）

存量测试应全绿不改动；若有测试因此失败，先怀疑重排改错了语义再动测试，动了必须记录。

- [ ] **Step 4: CI 条件式取消**

`.github/workflows/ci.yml` 的 `cancel-in-progress: true` 改为：

```yaml
  cancel-in-progress: ${{ github.ref != 'refs/heads/master' }}
```

- [ ] **Step 5: 验证 + 重建产物 + Commit**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www exec shadcn build`
Expected: 65/65（63+2）。

```bash
git add -A && git commit -m "refactor: positioner passthrough, props-order harmonization, ci guard"
```

---

### Task 3: Command（cmdk，Raycast 式 ⌘K 面板）

**Files:**
- Modify: `apps/www/vitest.setup.ts`（追加 scrollIntoView stub——cmdk 需要）
- Create: `apps/www/registry/mayumi/ui/command.tsx`, `command.test.tsx`, `command.stories.tsx`

**Interfaces:**
- Consumes: cmdk、lucide `Search`、既有 `Dialog`/`DialogContent`/`DialogTitle`、tokens（`bg-surface-raised`）。
- Produces: `Command`、`CommandInput`、`CommandList`、`CommandEmpty`、`CommandGroup`、`CommandItem`、`CommandSeparator`、`CommandShortcut`、`CommandDialog`（顶部 20% 定位的 560px 面板，内嵌 sr-only DialogTitle 满足 a11y）。

- [ ] **Step 1: 安装 + stub**

```bash
pnpm --filter www add cmdk
```

`vitest.setup.ts` 末尾追加：

```ts
if (typeof window !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
```

- [ ] **Step 2: 写失败测试**

```tsx
// command.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"

function Demo({ onSelect }: { onSelect?: (v: string) => void }) {
  return (
    <Command>
      <CommandInput placeholder="搜索命令…" />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandItem value="打开设置" onSelect={onSelect}>
          打开设置
        </CommandItem>
        <CommandItem value="锁定屏幕" onSelect={onSelect}>
          锁定屏幕
        </CommandItem>
      </CommandList>
    </Command>
  )
}

describe("Command", () => {
  it("filters items by typing", async () => {
    render(<Demo />)
    await userEvent.type(screen.getByPlaceholderText("搜索命令…"), "设置")
    expect(screen.getByText("打开设置")).toBeInTheDocument()
    expect(screen.queryByText("锁定屏幕")).toBeNull()
  })

  it("shows the empty state when nothing matches", async () => {
    render(<Demo />)
    await userEvent.type(screen.getByPlaceholderText("搜索命令…"), "zzz")
    expect(screen.getByText("无结果")).toBeInTheDocument()
  })

  it("fires onSelect when an item is clicked", async () => {
    const onSelect = vi.fn()
    render(<Demo onSelect={onSelect} />)
    await userEvent.click(screen.getByText("打开设置"))
    expect(onSelect).toHaveBeenCalledWith("打开设置")
  })

  it("renders as a centered palette dialog", () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="搜索命令…" />
        <CommandList>
          <CommandItem value="a">动作 A</CommandItem>
        </CommandList>
      </CommandDialog>
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("动作 A")).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 4: 实现 `command.tsx`**

```tsx
"use client"

import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/registry/mayumi/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      {...props}
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden text-fg",
        className
      )}
    />
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex shrink-0 items-center gap-2 border-b border-border px-3"
    >
      <Search
        aria-hidden="true"
        className="size-4 shrink-0 text-fg-tertiary"
        strokeWidth={1.5}
      />
      <CommandPrimitive.Input
        {...props}
        data-slot="command-input"
        className={cn(
          "h-11 flex-1 bg-transparent text-ui text-fg outline-none placeholder:text-fg-tertiary",
          className
        )}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      {...props}
      data-slot="command-list"
      className={cn("max-h-80 overflow-y-auto overscroll-contain p-1", className)}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      {...props}
      data-slot="command-empty"
      className={cn("py-6 text-center text-ui text-fg-tertiary", className)}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      {...props}
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-fg-tertiary",
        className
      )}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      {...props}
      data-slot="command-item"
      className={cn(
        "flex h-9 cursor-default items-center gap-2 rounded-icon px-2 text-ui leading-tight text-fg outline-none select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-surface-raised [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-secondary",
        className
      )}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      {...props}
      data-slot="command-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      data-slot="command-shortcut"
      className={cn("ml-auto text-xs text-fg-tertiary", className)}
    />
  )
}

function CommandDialog({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Dialog> & { className?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          "top-[20%] w-[560px] -translate-y-0 overflow-hidden p-0",
          className
        )}
      >
        <DialogTitle className="sr-only">命令面板</DialogTitle>
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
```

（cmdk 的 `onSelect` 签名、data 属性（`data-selected="true"`）以安装版为准，偏差记录。`-translate-y-0` 覆盖 DialogContent 的居中位移，tw-merge 同组后者胜。）

- [ ] **Step 5: 写 `command.stories.tsx`**

```tsx
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"
import { Window } from "./window"

const meta: Meta<typeof Command> = { title: "ui/Command", component: Command }
export default meta

export const Inline: StoryObj<typeof Command> = {
  render: () => (
    <div className="p-8">
      <Window className="h-96 w-[560px]">
        <Command>
          <CommandInput placeholder="搜索命令…" autoFocus />
          <CommandList>
            <CommandEmpty>无结果</CommandEmpty>
            <CommandGroup heading="常用">
              <CommandItem value="打开设置">
                打开设置<CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem value="锁定屏幕">
                锁定屏幕<CommandShortcut>⌃⌘Q</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="系统">
              <CommandItem value="关于本机">关于本机</CommandItem>
              <CommandItem value="强制退出" disabled>
                强制退出
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Window>
    </div>
  ),
}

function PaletteDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>打开命令面板 ⌘K</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索命令…" autoFocus />
        <CommandList>
          <CommandEmpty>无结果</CommandEmpty>
          <CommandItem value="打开设置" onSelect={() => setOpen(false)}>
            打开设置
          </CommandItem>
          <CommandItem value="锁定屏幕" onSelect={() => setOpen(false)}>
            锁定屏幕
          </CommandItem>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export const Palette: StoryObj<typeof Command> = { render: () => <PaletteDemo /> }
```

（`Dialog` 的受控 props 名（open/onOpenChange）以安装版为准。）

- [ ] **Step 6: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 69/69（65+4），typecheck 绿。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: command palette component"
```

---

### Task 4: Toast（sonner）

**Files:**
- Create: `apps/www/registry/mayumi/ui/toast.tsx`, `toast.test.tsx`, `toast.stories.tsx`

**Interfaces:**
- Consumes: sonner、tokens、`.mayumi-vibrancy`。
- Produces: `Toaster`（预配置右上角、mayumi 皮肤的 sonner Toaster；position 等为可覆盖默认值故写在 spread 前——这是 Global Constraints 里点名的例外）与 re-export 的 `toast`。

- [ ] **Step 1: 安装**

```bash
pnpm --filter www add sonner
```

- [ ] **Step 2: 写失败测试**

```tsx
// toast.test.tsx
import { act, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { toast, Toaster } from "./toast"

describe("Toast", () => {
  it("renders a toast when fired", async () => {
    render(<Toaster />)
    act(() => {
      toast("已保存")
    })
    expect(await screen.findByText("已保存")).toBeInTheDocument()
  })

  it("renders title with description", async () => {
    render(<Toaster />)
    act(() => {
      toast("同步完成", { description: "3 个项目已更新" })
    })
    expect(await screen.findByText("同步完成")).toBeInTheDocument()
    expect(await screen.findByText("3 个项目已更新")).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 4: 实现 `toast.tsx`**

```tsx
"use client"

import { Toaster as SonnerToaster, toast } from "sonner"

function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="top-right"
      offset={16}
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "mayumi-vibrancy flex w-80 items-start gap-3 rounded-card border border-border p-3 shadow-[var(--shadow-overlay)]",
          title: "text-ui leading-tight font-medium text-fg",
          description: "text-xs leading-tight text-fg-secondary",
        },
      }}
      {...props}
    />
  )
}

export { toast, Toaster }
```

（sonner 的 `classNames` 键名以安装版为准；`{...props}` 置后是有意的——position/toastOptions 是可覆盖默认值，非契约。）

- [ ] **Step 5: 写 `toast.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { toast, Toaster } from "./toast"

const meta: Meta<typeof Toaster> = { title: "ui/Toast", component: Toaster }
export default meta

export const Default: StoryObj<typeof Toaster> = {
  render: () => (
    <div className="flex gap-2 p-8">
      <Toaster />
      <Button onClick={() => toast("已保存")}>基础通知</Button>
      <Button
        variant="secondary"
        onClick={() => toast("同步完成", { description: "3 个项目已更新" })}
      >
        带描述
      </Button>
    </div>
  ),
}
```

- [ ] **Step 6: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 71/71（69+2），typecheck 绿。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: toast component"
```

---

### Task 5: registry 注册（command/toast）+ 全量收官验证

**Files:**
- Modify: `apps/www/registry.json`（items 追加 2 项）
- Regenerate: `apps/www/public/r/*.json`（提交）

**Interfaces:**
- Produces: registry 25 项（public/r 26 JSON 含 CLI 副本）——spec §4 组件清单全部交付。

- [ ] **Step 1: items 追加**

```json
{
  "name": "command",
  "type": "registry:ui",
  "title": "Command",
  "dependencies": ["cmdk", "lucide-react"],
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json",
    "https://mayumi.netlify.app/r/dialog.json"
  ],
  "files": [{ "path": "registry/mayumi/ui/command.tsx", "type": "registry:ui" }]
},
{
  "name": "toast",
  "type": "registry:ui",
  "title": "Toast",
  "dependencies": ["sonner"],
  "registryDependencies": ["https://mayumi.netlify.app/r/theme.json"],
  "files": [{ "path": "registry/mayumi/ui/toast.tsx", "type": "registry:ui" }]
}
```

- [ ] **Step 2: 重建 + 全量验证**

Run: `pnpm --filter www exec shadcn build && ls apps/www/public/r/ | wc -l && pnpm --filter www test && pnpm typecheck && pnpm --filter www build && pnpm --filter storybook build`
Expected: 26 个 JSON；测试 ≈71 全绿；全部构建成功。

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: register command and toast, component library complete"
```

---

## Self-Review 结果

- **Spec coverage**：spec §4 重交互组件（Command/Toast）→ Task 3/4；依赖选型（cmdk/sonner）一致；Plan 3 终审必办——包名迁移（Task 1）、Positioner 透传（Task 2）、props 顺序和谐化（Task 2）、CI 条件式（Task 2）。文档站/README/主题切换过渡属 Plan 5（拆分决定已在 Goal 声明）。
- **Placeholder scan**：无 TBD；迁移与 cmdk/sonner 的 API 适配均为显式规则（安装版为准 + 记录 + 破坏性变化上报 BLOCKED）。
- **Type consistency**：`CommandDialog` 消费的 `Dialog`/`DialogContent`/`DialogTitle` 为 Plan 3 Task 9 导出；`bg-surface-raised` 已于 95378a3 进 tokens；`CommandShortcut` 不依赖 Kbd（纯 span）故 command 的 registryDependencies 无 kbd；toast 不用 `cn` 故无 utils 依赖——与 Task 5 的 JSON 一致；测试链 63→63→65→69→71 逐任务核算。
