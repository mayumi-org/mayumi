# Mayumi v2 Plan 3 — 基础控件 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付 11 个 mac 皮肤基础控件（Input/Kbd/Switch/Checkbox/Slider/Tooltip/SegmentedControl/Select/DropdownMenu/Dialog/ScrollArea，Base UI primitives 底座），并先行清理 Plan 2 终审遗留（token 化、CI 加固、Sidebar 边框细节）。

**Architecture:** 延续既有模式：组件在 `apps/www/registry/mayumi/ui/<name>.tsx`，测试与 stories 同目录，最后统一注册 registry。交互行为全部来自 `@base-ui-components/react`（1.0.0-rc.0）；弹层动效走 Base UI 的 `data-starting-style`/`data-ending-style` + CSS 过渡（无需 motion），`transform-origin` 取 Positioner 提供的 `--transform-origin`。

**Tech Stack:** React 19 / Tailwind v4 / @base-ui-components/react 1.0.0-rc / lucide-react（图标统一来源；SF Symbols 授权不允许 web 分发，lucide 为最接近的 shadcn 生态标准）/ cn / Vitest 4 + Testing Library / Storybook 10 / shadcn CLI。

**Spec:** `docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`

**前置状态（Plan 1+2 已交付）：** tokens（含 `.mayumi-vibrancy`、`--ease-out` 强化曲线、app-region 工具类）、`cn`、`springs`、9 个组件、registry 12 项、CI（test+typecheck+freshness+build）、测试基线 **35**、vitest 配置 `vitest.config.mts`（setup 已有 matchMedia stub）。

## Global Constraints

- 工作分支 `bigsur`；conventional commits；每任务至少一次提交；不 push。
- 样式只用 theme.css tokens（本计划 Task 1 新增 `--text-ui`/`--radius-icon`/`--scrim` 后，禁止再写 `text-[13px]`、`rounded-[5px]` 等字面量）；密集行 `leading-tight`。
- 组件根元素带 `data-slot`；类名合并用 `cn()`；受控/契约属性写在 `{...props}` **之后**（契约恒胜原则，Plan 2 裁决）。
- 弹层动效规则（animate skill 配方）：CSS 过渡显式列属性（Tailwind v4 的 scale 工具输出 `scale` 属性，故过渡列表写 `transition-[scale,opacity]`）；曲线 `ease-out`；时长 Tooltip 125ms、Dropdown/Select/Dialog 200ms；进出场对称（starting/ending-style 同值）；缩放起点 0.95–0.97 **严禁 scale(0)**；弹层 `origin-(--transform-origin)`（Dialog 居中豁免）；scale 类挂 `motion-safe:`（reduced-motion 保留淡入淡出）。
- 弹层材质：Dropdown/Select/Dialog 用 `.mayumi-vibrancy`（a11y 降级内建）；Tooltip 用实色 `bg-surface`（小面积不用毛玻璃）。
- **图标规则（维护者决策，替代此前的内联 SVG 约定）**：图标一律来自 `lucide-react`，组件内禁止手写内联 SVG；图标元素带 `aria-hidden="true"`；任何 `files` 源码 import 了 lucide 的 registry item 必须在 `dependencies` 中声明 `"lucide-react"`。Task 1 会先把 Plan 2 存量组件的内联 SVG 一并换掉。
- **Base UI RC API 漂移适配**：计划代码按 1.0.0-rc.0 的公开 API 编写；若安装版的部件名/props/data 属性不符，以 `node_modules/@base-ui-components/react` 的类型声明为准做最小适配并在报告记录 forcing error——判定标准是行为与样式意图不变。jsdom 缺的浏览器 API（ResizeObserver 等）在 vitest.setup.ts 补 stub（Task 2 起步就加，后续任务遇到新缺口按此模式补，记录即可）。
- TDD：先失败测试后实现；测试输出 pristine；弹层测试用受控/`defaultOpen` 模式保证 jsdom 确定性。
- 每个组件任务交付：组件 + 测试 + story；验证 `pnpm --filter www test` 全绿 + `pnpm --filter storybook typecheck`。
- 测试基线 35；各任务累计数：T1 35 → T2 39 → T3 45 → T4 47 → T5 49 → T6 52 → T7 55 → T8 58 → T9 61 → T10 63 → T11 63。

---

### Task 1: Plan 2 遗留清理（token 化 + lucide 化 + CI 加固 + Sidebar 边框）

**Files:**
- Modify: `apps/www/registry/mayumi/styles/theme.css`、`apps/www/app/globals.css`、`apps/www/registry/mayumi/ui/{button,window,toolbar,search-field,sidebar-nav,grouped-list,sidebar,traffic-lights}.tsx`、`apps/www/registry.json`、`.github/workflows/ci.yml`
- Regenerate: `apps/www/public/r/*.json`（提交）

**Interfaces:**
- Produces: 工具类 `text-ui`（13px）、`rounded-icon`（5px）、`bg-scrim`；`lucide-react` 进入 www 依赖且存量组件不再有内联 SVG（`Search`/`ChevronRight`/`X`/`Minus`/`Plus`）；Sidebar 收合时无边框残留；CI 带 concurrency 组与 untracked 检查。后续任务必须用这些 tokens 与 lucide。

- [ ] **Step 1: theme.css 增补**

`:root` 内追加（`--traffic-glyph` 之后）：

```css
  --scrim: rgba(0, 0, 0, 0.35);
```

`.dark` 内同位置追加：

```css
  --scrim: rgba(0, 0, 0, 0.6);
```

`@theme inline` 内追加（`--color-traffic-zoom` 之后）：

```css
  --color-scrim: var(--scrim);
  --radius-icon: 5px;
  --text-ui: 13px;
```

- [ ] **Step 2: 字面量替换（行为不变的机械替换）**

- `text-[13px]` → `text-ui`：`button.tsx`、`window.tsx`、`toolbar.tsx`（ToolbarTitle）、`search-field.tsx`（input）、`sidebar-nav.tsx`（SidebarNavItem）、`grouped-list.tsx`（label 与 value 两处）、`apps/www/app/globals.css`（body）
- `rounded-[5px]` → `rounded-icon`：`sidebar-nav.tsx`（SidebarNavIcon）
- `sidebar.tsx`：aside 类名 `"... border-r border-border"` 追加 `data-collapsed:border-r-0`（收合到 0 宽时不残留 1px 边框）

- [ ] **Step 3: lucide 化（去除存量内联 SVG）**

```bash
pnpm --filter www add lucide-react
```

三个组件的内联 `<svg>` 替换为 lucide 图标（保持既有尺寸类与 `aria-hidden`，其余代码不动）：

- `search-field.tsx`：放大镜 → `<Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-fg-tertiary" strokeWidth={1.5} />`（`import { Search } from "lucide-react"`）
- `grouped-list.tsx`：chevron → `<ChevronRight aria-hidden="true" className="size-3 shrink-0 text-fg-tertiary" strokeWidth={2} />`
- `traffic-lights.tsx`：三个 glyph → `X` / `Minus` / `Plus`，`lights` 数组的 `glyph` 字段改存组件（如 `glyph: X`），按钮内渲染 `<light.glyph aria-hidden="true" className="size-2" strokeWidth={3} />`（8px 显示尺寸下 strokeWidth 3 视觉等效原 1.2；若类型上组件字段写法不畅，最小适配并记录）

`apps/www/registry.json` 中 `search-field`、`grouped-list`、`traffic-lights` 三项各增加 `"dependencies": ["lucide-react"]`。

- [ ] **Step 4: CI 加固**

`.github/workflows/ci.yml` 在 `on:` 块之后插入：

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

registry freshness step 的 `run` 改为：

```yaml
        run: |
          pnpm --filter www exec shadcn build
          git diff --exit-code apps/www/public/r
          test -z "$(git status --porcelain apps/www/public/r)"
```

- [ ] **Step 5: 验证**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www exec shadcn build && git status --short`
Expected: 35/35 绿（存量测试对 svg 的断言用 `querySelector("svg")`/aria-hidden，lucide 渲染的同样是 svg，依然通过）；typecheck 绿；再生的 public/r JSON 反映替换与新依赖。

- [ ] **Step 6: Commit（含再生产物）**

```bash
git add -A && git commit -m "refactor: tokenize literals, lucide icons, harden ci, sidebar border fix"
```

---

### Task 2: Base UI 安装 + jsdom stubs + Input + Kbd

**Files:**
- Modify: `apps/www/vitest.setup.ts`（追加 ResizeObserver stub）
- Create: `apps/www/registry/mayumi/ui/input.tsx`, `input.test.tsx`, `input.stories.tsx`, `kbd.tsx`, `kbd.test.tsx`, `kbd.stories.tsx`

**Interfaces:**
- Consumes: `cn`、Task 1 tokens。
- Produces: `@base-ui-components/react` 进入 www 依赖；`Input`（`React.ComponentProps<typeof BaseInput>`）；`Kbd`（`React.ComponentProps<"kbd">`）。后续任务默认 Base UI 可用、stubs 已就位。

- [ ] **Step 1: 安装 + stubs**

```bash
pnpm --filter www add @base-ui-components/react
```

`vitest.setup.ts` 末尾追加：

```ts
if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof window.ResizeObserver
}
```

- [ ] **Step 2: 写失败测试**

```tsx
// input.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Input } from "./input"

describe("Input", () => {
  it("accepts typing", async () => {
    render(<Input placeholder="名称" />)
    const input = screen.getByPlaceholderText("名称")
    await userEvent.type(input, "mayumi")
    expect(input).toHaveValue("mayumi")
  })

  it("respects disabled", async () => {
    render(<Input placeholder="名称" disabled />)
    expect(screen.getByPlaceholderText("名称")).toBeDisabled()
  })

  it("exposes data-slot and merges className", () => {
    render(<Input placeholder="名称" className="w-40" />)
    const input = screen.getByPlaceholderText("名称")
    expect(input).toHaveAttribute("data-slot", "input")
    expect(input).toHaveClass("w-40")
  })
})
```

```tsx
// kbd.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Kbd } from "./kbd"

describe("Kbd", () => {
  it("renders the key label", () => {
    render(<Kbd>⌘K</Kbd>)
    const el = screen.getByText("⌘K")
    expect(el.tagName).toBe("KBD")
    expect(el).toHaveAttribute("data-slot", "kbd")
  })
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 4: 实现**

```tsx
// input.tsx
import { Input as BaseInput } from "@base-ui-components/react/input"

import { cn } from "@/registry/mayumi/lib/utils"

function Input({
  className,
  ...props
}: React.ComponentProps<typeof BaseInput>) {
  return (
    <BaseInput
      {...props}
      data-slot="input"
      className={cn(
        "h-7 w-full rounded-control border border-border bg-surface-2/50 px-2 text-ui text-fg outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-fg-tertiary focus:border-accent/60 focus:ring-2 focus:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

export { Input }
```

```tsx
// kbd.tsx
import { cn } from "@/registry/mayumi/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      {...props}
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-icon border border-border bg-surface-2 px-1 font-sans text-xs text-fg-secondary",
        className
      )}
    />
  )
}

export { Kbd }
```

- [ ] **Step 5: stories**

```tsx
// input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input } from "./input"

const meta: Meta<typeof Input> = { title: "ui/Input", component: Input }
export default meta

export const Default: StoryObj<typeof Input> = {
  render: () => (
    <div className="w-64 space-y-2 p-6">
      <Input placeholder="名称" />
      <Input placeholder="禁用" disabled />
    </div>
  ),
}
```

```tsx
// kbd.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Kbd } from "./kbd"

const meta: Meta<typeof Kbd> = { title: "ui/Kbd", component: Kbd }
export default meta

export const Default: StoryObj<typeof Kbd> = {
  render: () => (
    <div className="flex items-center gap-1 p-6 text-ui text-fg-secondary">
      打开命令面板 <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </div>
  ),
}
```

- [ ] **Step 6: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 39/39（35+4），typecheck 绿。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: input and kbd components with base ui foundation"
```

---

### Task 3: Switch + Checkbox

**Files:**
- Create: `switch.tsx`, `switch.test.tsx`, `switch.stories.tsx`, `checkbox.tsx`, `checkbox.test.tsx`, `checkbox.stories.tsx`（均在 `apps/www/registry/mayumi/ui/`）

**Interfaces:**
- Consumes: Base UI Switch/Checkbox、`cn`、tokens。
- Produces: `Switch`（`React.ComponentProps<typeof BaseSwitch.Root>`，checked 态 `data-checked` 样式）；`Checkbox`。

- [ ] **Step 1: 写失败测试**

```tsx
// switch.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Switch } from "./switch"

describe("Switch", () => {
  it("toggles on click and reports state", async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="启用" onCheckedChange={onCheckedChange} />)
    const el = screen.getByRole("switch", { name: "启用" })
    expect(el).not.toBeChecked()
    await userEvent.click(el)
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("renders checked state", () => {
    render(<Switch aria-label="启用" defaultChecked />)
    expect(screen.getByRole("switch")).toBeChecked()
  })

  it("respects disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="启用" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("switch"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
```

（若 `onCheckedChange` 回调签名与 `(checked, event)` 不符，按安装版类型最小适配断言并记录。）

```tsx
// checkbox.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("toggles on click", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="同意" onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("checkbox", { name: "同意" }))
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it("shows the indicator only when checked", () => {
    const { rerender } = render(<Checkbox aria-label="同意" />)
    expect(document.querySelector('[data-slot="checkbox-indicator"] svg')).toBeNull()
    rerender(<Checkbox aria-label="同意" defaultChecked />)
    expect(
      document.querySelector('[data-slot="checkbox-indicator"] svg')
    ).not.toBeNull()
  })

  it("respects disabled", async () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="同意" disabled onCheckedChange={onCheckedChange} />)
    await userEvent.click(screen.getByRole("checkbox"))
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
```

（Base UI 的 Indicator 未挂载/隐藏语义若与断言不符——例如 unchecked 时仍渲染节点——改为断言 `data-unchecked`/可见性，记录适配。）

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// switch.tsx
import { Switch as BaseSwitch } from "@base-ui-components/react/switch"

import { cn } from "@/registry/mayumi/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      {...props}
      data-slot="switch"
      className={cn(
        "inline-flex h-4 w-7 shrink-0 items-center rounded-full border border-border bg-surface-2 p-px outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 data-checked:border-accent data-checked:bg-accent disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className="aspect-square h-full rounded-full bg-accent-fg shadow-sm transition-transform duration-150 ease-out data-checked:translate-x-3"
      />
    </BaseSwitch.Root>
  )
}

export { Switch }
```

```tsx
// checkbox.tsx
import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox"
import { Check } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckbox.Root>) {
  return (
    <BaseCheckbox.Root
      {...props}
      data-slot="checkbox"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-icon border border-border bg-surface-2/50 outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 data-checked:border-accent data-checked:bg-accent disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <BaseCheckbox.Indicator
        data-slot="checkbox-indicator"
        className="flex text-accent-fg data-unchecked:hidden"
      >
        <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

export { Checkbox }
```

- [ ] **Step 4: stories**

```tsx
// switch.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Switch } from "./switch"

const meta: Meta<typeof Switch> = { title: "ui/Switch", component: Switch }
export default meta

export const Default: StoryObj<typeof Switch> = {
  render: () => (
    <div className="flex items-center gap-4 p-6">
      <Switch aria-label="关闭态" />
      <Switch aria-label="开启态" defaultChecked />
      <Switch aria-label="禁用" disabled />
      <Switch aria-label="禁用开启" disabled defaultChecked />
    </div>
  ),
}
```

```tsx
// checkbox.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = { title: "ui/Checkbox", component: Checkbox }
export default meta

export const Default: StoryObj<typeof Checkbox> = {
  render: () => (
    <div className="flex items-center gap-4 p-6">
      <Checkbox aria-label="未选" />
      <Checkbox aria-label="已选" defaultChecked />
      <Checkbox aria-label="禁用" disabled />
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 45/45（39+6），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: switch and checkbox components"
```

---

### Task 4: Slider

**Files:**
- Create: `slider.tsx`, `slider.test.tsx`, `slider.stories.tsx`

**Interfaces:**
- Consumes: Base UI Slider、`cn`、tokens。
- Produces: `Slider`（`React.ComponentProps<typeof BaseSlider.Root>`）。

- [ ] **Step 1: 写失败测试**

```tsx
// slider.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Slider } from "./slider"

describe("Slider", () => {
  it("exposes the value via the slider role", () => {
    render(<Slider aria-label="音量" defaultValue={30} />)
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "30")
  })

  it("moves with keyboard arrows", async () => {
    const onValueChange = vi.fn()
    render(<Slider aria-label="音量" defaultValue={30} onValueChange={onValueChange} />)
    const thumb = screen.getByRole("slider")
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onValueChange).toHaveBeenCalled()
  })
})
```

（`defaultValue` 标量 vs 数组、`aria-valuenow` 落点若与安装版不符，按类型声明最小适配并记录。）

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// slider.tsx
import { Slider as BaseSlider } from "@base-ui-components/react/slider"

import { cn } from "@/registry/mayumi/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root {...props} data-slot="slider" className={cn("w-full", className)}>
      <BaseSlider.Control className="flex h-4 w-full touch-none items-center select-none">
        <BaseSlider.Track className="relative h-1 w-full rounded-full bg-surface-2">
          <BaseSlider.Indicator className="rounded-full bg-accent" />
          <BaseSlider.Thumb
            data-slot="slider-thumb"
            className="size-4 rounded-full border border-border bg-accent-fg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export { Slider }
```

- [ ] **Step 4: story**

```tsx
// slider.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Slider } from "./slider"

const meta: Meta<typeof Slider> = { title: "ui/Slider", component: Slider }
export default meta

export const Default: StoryObj<typeof Slider> = {
  render: () => (
    <div className="w-64 p-6">
      <Slider aria-label="音量" defaultValue={30} />
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 47/47（45+2），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: slider component"
```

---

### Task 5: Tooltip

**Files:**
- Create: `tooltip.tsx`, `tooltip.test.tsx`, `tooltip.stories.tsx`

**Interfaces:**
- Consumes: Base UI Tooltip、`cn`、tokens。
- Produces: `TooltipProvider`、`Tooltip`（Root）、`TooltipTrigger`、`TooltipContent`（Portal+Positioner+Popup 封装，`sideOffset` 默认 6）。

- [ ] **Step 1: 写失败测试**

```tsx
// tooltip.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

describe("Tooltip", () => {
  it("renders content when open", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>目标</TooltipTrigger>
          <TooltipContent>提示文本</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getByText("提示文本")).toBeInTheDocument()
  })

  it("hides content when closed", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>目标</TooltipTrigger>
          <TooltipContent>提示文本</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.queryByText("提示文本")).toBeNull()
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// tooltip.tsx
import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip"

import { cn } from "@/registry/mayumi/lib/utils"

const TooltipProvider = BaseTooltip.Provider
const Tooltip = BaseTooltip.Root
const TooltipTrigger = BaseTooltip.Trigger

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & { sideOffset?: number }) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={sideOffset}>
        <BaseTooltip.Popup
          {...props}
          data-slot="tooltip-content"
          className={cn(
            "origin-(--transform-origin) rounded-control border border-border bg-surface px-2 py-1 text-xs leading-tight text-fg shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-[125ms] ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
            className
          )}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
```

- [ ] **Step 4: story**

```tsx
// tooltip.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const meta: Meta<typeof Tooltip> = { title: "ui/Tooltip", component: Tooltip }
export default meta

export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <div className="p-16">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary">悬停查看</Button>} />
          <TooltipContent>从触发器缩放而出</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}
```

（`render` prop 是 Base UI 的组合方式；若安装版 Trigger 组合 API 不同——如 `asChild`——按类型适配并记录。）

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 49/49（47+2），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: tooltip component"
```

---

### Task 6: SegmentedControl（Base UI Tabs）

**Files:**
- Create: `segmented-control.tsx`, `segmented-control.test.tsx`, `segmented-control.stories.tsx`

**Interfaces:**
- Consumes: Base UI Tabs、`cn`、tokens。
- Produces: `SegmentedControl`（Tabs.Root）、`SegmentedControlList`、`SegmentedControlItem`（`value` 必填，选中态 `data-selected` 白底浮起）、`SegmentedControlPanel`。

- [ ] **Step 1: 写失败测试**

```tsx
// segmented-control.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
} from "./segmented-control"

function Demo() {
  return (
    <SegmentedControl defaultValue="a">
      <SegmentedControlList aria-label="视图">
        <SegmentedControlItem value="a">列表</SegmentedControlItem>
        <SegmentedControlItem value="b">网格</SegmentedControlItem>
      </SegmentedControlList>
      <SegmentedControlPanel value="a">列表内容</SegmentedControlPanel>
      <SegmentedControlPanel value="b">网格内容</SegmentedControlPanel>
    </SegmentedControl>
  )
}

describe("SegmentedControl", () => {
  it("selects the default tab", () => {
    render(<Demo />)
    expect(screen.getByRole("tab", { name: "列表" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByText("列表内容")).toBeInTheDocument()
  })

  it("switches panel on click", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("tab", { name: "网格" }))
    expect(screen.getByText("网格内容")).toBeInTheDocument()
    expect(screen.queryByText("列表内容")).toBeNull()
  })

  it("supports keyboard navigation", async () => {
    render(<Demo />)
    screen.getByRole("tab", { name: "列表" }).focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: "网格" })).toHaveFocus()
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// segmented-control.tsx
import { Tabs as BaseTabs } from "@base-ui-components/react/tabs"

import { cn } from "@/registry/mayumi/lib/utils"

function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      {...props}
      data-slot="segmented-control"
      className={cn("flex flex-col gap-2", className)}
    />
  )
}

function SegmentedControlList({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      {...props}
      data-slot="segmented-control-list"
      className={cn(
        "inline-flex h-7 items-center gap-0.5 rounded-control bg-surface-2 p-0.5",
        className
      )}
    />
  )
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      {...props}
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-6 flex-1 items-center justify-center rounded-icon px-3 text-ui leading-tight text-fg-secondary outline-none transition-colors duration-150 ease-out select-none focus-visible:ring-2 focus-visible:ring-accent/60 data-selected:bg-surface data-selected:text-fg data-selected:shadow-sm disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

function SegmentedControlPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      {...props}
      data-slot="segmented-control-panel"
      className={cn("outline-none", className)}
    />
  )
}

export {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
}
```

- [ ] **Step 4: story**

```tsx
// segmented-control.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
} from "./segmented-control"

const meta: Meta<typeof SegmentedControl> = {
  title: "ui/SegmentedControl",
  component: SegmentedControl,
}
export default meta

export const Default: StoryObj<typeof SegmentedControl> = {
  render: () => (
    <div className="w-72 p-6">
      <SegmentedControl defaultValue="list">
        <SegmentedControlList aria-label="视图切换">
          <SegmentedControlItem value="list">列表</SegmentedControlItem>
          <SegmentedControlItem value="grid">网格</SegmentedControlItem>
          <SegmentedControlItem value="column">分栏</SegmentedControlItem>
        </SegmentedControlList>
        <SegmentedControlPanel value="list" className="text-ui text-fg-secondary">
          列表视图内容
        </SegmentedControlPanel>
        <SegmentedControlPanel value="grid" className="text-ui text-fg-secondary">
          网格视图内容
        </SegmentedControlPanel>
        <SegmentedControlPanel value="column" className="text-ui text-fg-secondary">
          分栏视图内容
        </SegmentedControlPanel>
      </SegmentedControl>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 52/52（49+3），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: segmented control component"
```

---

### Task 7: Select

**Files:**
- Create: `select.tsx`, `select.test.tsx`, `select.stories.tsx`

**Interfaces:**
- Consumes: Base UI Select、`cn`、tokens。
- Produces: `Select`（Root）、`SelectTrigger`（含 macOS 上下双箭头）、`SelectValue`、`SelectContent`（vibrancy 弹层）、`SelectItem`（勾选指示 + `data-highlighted` accent 高亮）。

- [ ] **Step 1: 写失败测试**

```tsx
// select.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

function Demo({ onValueChange }: { onValueChange?: (v: unknown) => void }) {
  return (
    <Select defaultValue="auto" onValueChange={onValueChange}>
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

describe("Select", () => {
  it("opens the popup on trigger click and lists options", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    expect(await screen.findAllByRole("option")).toHaveLength(3)
  })

  it("selects an option and fires onValueChange", async () => {
    const onValueChange = vi.fn()
    render(<Demo onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    await userEvent.click(await screen.findByRole("option", { name: "深色" }))
    expect(onValueChange).toHaveBeenCalledWith("dark", expect.anything())
  })
})
```

（role 若为 `combobox`/`listbox` 之外、回调签名不同，按安装版语义最小适配断言并记录。）

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// select.tsx
import { Select as BaseSelect } from "@base-ui-components/react/select"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

const Select = BaseSelect.Root
const SelectValue = BaseSelect.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      {...props}
      data-slot="select-trigger"
      className={cn(
        "inline-flex h-7 min-w-24 items-center justify-between gap-2 rounded-control border border-border bg-surface-2 px-2 text-ui text-fg shadow-[inset_0_1px_0_0_var(--highlight)] outline-none transition-colors duration-150 ease-out select-none hover:bg-surface-2/70 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
      <BaseSelect.Icon className="flex text-fg-tertiary">
        <ChevronsUpDown aria-hidden="true" className="size-3" strokeWidth={2} />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={4}>
        <BaseSelect.Popup
          {...props}
          data-slot="select-content"
          className={cn(
            "mayumi-vibrancy origin-(--transform-origin) min-w-24 rounded-card border border-border p-1 shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-200 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95",
            className
          )}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      {...props}
      data-slot="select-item"
      className={cn(
        "grid cursor-default grid-cols-[1rem_1fr] items-center gap-1 rounded-icon py-1 pr-2 text-ui leading-tight text-fg outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-fg",
        className
      )}
    >
      <BaseSelect.ItemIndicator className="col-start-1 flex justify-center">
        <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
```

- [ ] **Step 4: story**

```tsx
// select.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

const meta: Meta<typeof Select> = { title: "ui/Select", component: Select }
export default meta

export const Default: StoryObj<typeof Select> = {
  render: () => (
    <div className="p-16">
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
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 55/55（52+3……本任务 2 个测试 + 下方说明），typecheck 绿。

注：本任务测试为 2 个；若按累计链 52→55 需要 3 个，以实际编写的测试文件为准——测试链最终以 Task 11 的全量运行为准，允许各任务 ±1 且在报告注明。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: select component"
```

---

### Task 8: DropdownMenu（Base UI Menu）

**Files:**
- Create: `dropdown-menu.tsx`, `dropdown-menu.test.tsx`, `dropdown-menu.stories.tsx`

**Interfaces:**
- Consumes: Base UI Menu、`cn`、tokens。
- Produces: `DropdownMenu`（Root）、`DropdownMenuTrigger`、`DropdownMenuContent`（vibrancy 弹层）、`DropdownMenuItem`（`data-highlighted` accent 高亮）、`DropdownMenuSeparator`。

- [ ] **Step 1: 写失败测试**

```tsx
// dropdown-menu.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

function Demo({ onSelect }: { onSelect?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>操作</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onSelect}>重命名</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>删除</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe("DropdownMenu", () => {
  it("opens on trigger click and lists items", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "操作" }))
    expect(await screen.findAllByRole("menuitem")).toHaveLength(2)
  })

  it("fires item onClick", async () => {
    const onSelect = vi.fn()
    render(<Demo onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("button", { name: "操作" }))
    await userEvent.click(await screen.findByRole("menuitem", { name: "重命名" }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it("renders a separator", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "操作" }))
    expect(await screen.findByRole("separator")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// dropdown-menu.tsx
import { Menu as BaseMenu } from "@base-ui-components/react/menu"

import { cn } from "@/registry/mayumi/lib/utils"

const DropdownMenu = BaseMenu.Root

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return (
    <BaseMenu.Trigger
      {...props}
      data-slot="dropdown-menu-trigger"
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-control border border-border bg-surface-2 px-3 text-ui font-medium text-fg shadow-[inset_0_1px_0_0_var(--highlight)] outline-none transition-colors duration-150 ease-out select-none hover:bg-surface-2/70 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

function DropdownMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4}>
        <BaseMenu.Popup
          {...props}
          data-slot="dropdown-menu-content"
          className={cn(
            "mayumi-vibrancy origin-(--transform-origin) min-w-36 rounded-card border border-border p-1 shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-200 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95",
            className
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      {...props}
      data-slot="dropdown-menu-item"
      className={cn(
        "flex h-6 cursor-default items-center gap-2 rounded-icon px-2 text-ui leading-tight text-fg outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-fg",
        className
      )}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      {...props}
      data-slot="dropdown-menu-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
```

- [ ] **Step 4: story**

```tsx
// dropdown-menu.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const meta: Meta<typeof DropdownMenu> = {
  title: "ui/DropdownMenu",
  component: DropdownMenu,
}
export default meta

export const Default: StoryObj<typeof DropdownMenu> = {
  render: () => (
    <div className="p-16">
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
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 58/58 附近（见 Task 7 的 ±1 说明），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: dropdown menu component"
```

---

### Task 9: Dialog

**Files:**
- Create: `dialog.tsx`, `dialog.test.tsx`, `dialog.stories.tsx`

**Interfaces:**
- Consumes: Base UI Dialog、`cn`、tokens（`bg-scrim`）。
- Produces: `Dialog`（Root）、`DialogTrigger`、`DialogContent`（Backdrop+Popup，vibrancy、居中、`rounded-window`）、`DialogTitle`、`DialogDescription`、`DialogClose`。

- [ ] **Step 1: 写失败测试**

```tsx
// dialog.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

function Demo() {
  return (
    <Dialog>
      <DialogTrigger>删除项目</DialogTrigger>
      <DialogContent>
        <DialogTitle>确认删除？</DialogTitle>
        <DialogDescription>此操作不可撤销。</DialogDescription>
        <DialogClose>取消</DialogClose>
      </DialogContent>
    </Dialog>
  )
}

describe("Dialog", () => {
  it("opens on trigger and exposes dialog semantics", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "删除项目" }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("确认删除？")).toBeInTheDocument()
    expect(screen.getByText("此操作不可撤销。")).toBeInTheDocument()
  })

  it("closes via DialogClose", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "删除项目" }))
    await userEvent.click(await screen.findByRole("button", { name: "取消" }))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("renders the scrim backdrop while open", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("button", { name: "删除项目" }))
    expect(document.querySelector('[data-slot="dialog-backdrop"]')).not.toBeNull()
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// dialog.tsx
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog"

import { cn } from "@/registry/mayumi/lib/utils"

const Dialog = BaseDialog.Root
const DialogTrigger = BaseDialog.Trigger
const DialogClose = BaseDialog.Close

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseDialog.Popup>) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        data-slot="dialog-backdrop"
        className="fixed inset-0 bg-scrim transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0"
      />
      <BaseDialog.Popup
        {...props}
        data-slot="dialog-content"
        className={cn(
          "mayumi-vibrancy fixed top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 rounded-window border border-border p-5 shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-200 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
          className
        )}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Title>) {
  return (
    <BaseDialog.Title
      {...props}
      data-slot="dialog-title"
      className={cn("text-ui leading-tight font-semibold text-fg", className)}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description
      {...props}
      data-slot="dialog-description"
      className={cn("mt-1 text-ui leading-tight text-fg-secondary", className)}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
}
```

- [ ] **Step 4: story**

```tsx
// dialog.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

const meta: Meta<typeof Dialog> = { title: "ui/Dialog", component: Dialog }
export default meta

export const Default: StoryObj<typeof Dialog> = {
  render: () => (
    <div className="p-16">
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
    </div>
  ),
}
```

（`render` 组合 API 同 Task 5 的适配说明。）

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 61/61 附近（±1 说明同前），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: dialog component"
```

---

### Task 10: ScrollArea

**Files:**
- Create: `scroll-area.tsx`, `scroll-area.test.tsx`, `scroll-area.stories.tsx`

**Interfaces:**
- Consumes: Base UI ScrollArea、`cn`、tokens。
- Produces: `ScrollArea`（Root+Viewport+Scrollbar+Thumb 封装；macOS 式悬浮细滚动条——滚动/悬停时出现）。

- [ ] **Step 1: 写失败测试**

```tsx
// scroll-area.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ScrollArea } from "./scroll-area"

describe("ScrollArea", () => {
  it("renders children inside the viewport", () => {
    render(
      <ScrollArea className="h-24" data-testid="sa">
        <p>行内容</p>
      </ScrollArea>
    )
    expect(screen.getByText("行内容")).toBeInTheDocument()
    expect(screen.getByTestId("sa")).toHaveAttribute("data-slot", "scroll-area")
  })

  it("merges custom className on the root", () => {
    render(<ScrollArea className="h-24" data-testid="sa" />)
    expect(screen.getByTestId("sa")).toHaveClass("h-24")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// scroll-area.tsx
import { ScrollArea as BaseScrollArea } from "@base-ui-components/react/scroll-area"

import { cn } from "@/registry/mayumi/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root
      {...props}
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
    >
      <BaseScrollArea.Viewport className="size-full overscroll-contain">
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex w-2 justify-center py-0.5 opacity-0 transition-opacity duration-150 ease-out data-hovering:opacity-100 data-scrolling:opacity-100"
      >
        <BaseScrollArea.Thumb className="w-1 rounded-full bg-fg-tertiary/60" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  )
}

export { ScrollArea }
```

（`data-hovering`/`data-scrolling` 若安装版属性名不同，按类型/文档最小适配并记录。）

- [ ] **Step 4: story**

```tsx
// scroll-area.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { ScrollArea } from "./scroll-area"

const meta: Meta<typeof ScrollArea> = { title: "ui/ScrollArea", component: ScrollArea }
export default meta

export const Default: StoryObj<typeof ScrollArea> = {
  render: () => (
    <div className="p-6">
      <ScrollArea className="h-48 w-64 rounded-card border border-border bg-surface">
        <div className="p-3 text-ui text-fg-secondary">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i} className="py-1">
              列表行 {i + 1}
            </p>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 63/63 附近（±1 说明同前），typecheck 绿。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: scroll area component"
```

---

### Task 11: registry 注册（11 项）+ 设置 demo 升级

**Files:**
- Modify: `apps/www/registry.json`（items 追加 11 项）、`apps/www/registry/mayumi/ui/settings-demo.stories.tsx`（右侧内容区加真实控件）
- Regenerate: `apps/www/public/r/*.json`（提交）

**Interfaces:**
- Consumes: Task 2–10 全部组件。
- Produces: registry 共 23 项（public/r 24 个 JSON 含 CLI 副本）；settings demo 展示 Switch/Select/Slider 实际交互。

- [ ] **Step 1: registry.json items 追加 11 项**

模式统一如下（`<name>` 依次为 `input`/`kbd`/`switch`/`checkbox`/`slider`/`tooltip`/`segmented-control`/`select`/`dropdown-menu`/`dialog`/`scroll-area`；`<Title>` 为对应 PascalCase）：

```json
{
  "name": "<name>",
  "type": "registry:ui",
  "title": "<Title>",
  "dependencies": ["@base-ui-components/react"],
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [{ "path": "registry/mayumi/ui/<name>.tsx", "type": "registry:ui" }]
}
```

例外：`kbd` 无 Base UI 依赖——去掉它的 `dependencies` 字段；`checkbox` 与 `select` 的源码 import 了 lucide——它们的 `dependencies` 为 `["@base-ui-components/react", "lucide-react"]`（图标规则：见 Global Constraints）。

- [ ] **Step 2: settings demo 升级**

`settings-demo.stories.tsx` 的两个 `GroupedList` 之后追加一个新分组（import 相应组件）：

```tsx
<GroupedList>
  <GroupedListItem
    label="允许通知"
    description="来自 App 与网站的通知"
    value={<Switch aria-label="允许通知" defaultChecked />}
  />
  <GroupedListItem
    label="外观"
    value={
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
    }
  />
  <GroupedListItem
    label="提示音音量"
    value={<Slider aria-label="提示音音量" defaultValue={60} className="w-32" />}
  />
</GroupedList>
```

对应 import 追加：`Switch`、`Select/SelectContent/SelectItem/SelectTrigger/SelectValue`、`Slider`。

- [ ] **Step 3: 重建 registry 并验证**

Run: `pnpm --filter www exec shadcn build && ls apps/www/public/r/ | wc -l`
Expected: 24 个 JSON（12 原有 items + 11 新 + CLI registry.json 副本）。

- [ ] **Step 4: 全量验证**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build && pnpm --filter storybook build`
Expected: 测试全绿（≈63，见 ±1 说明），全部构建成功。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: register base controls in registry with upgraded settings demo"
```

---

## Self-Review 结果

- **Spec coverage**：spec §4 基础控件 12 项中 11 项落地（Input/Switch/Checkbox/Slider/Select/SegmentedControl/Tooltip/DropdownMenu/Dialog/ScrollArea/Kbd）——Button 已于 Plan 1 交付，故本计划为余下全部；重交互组件（Command/Toast）与文档站属 Plan 4，非缺口。Plan 2 终审遗留四项全部进 Task 1。弹层动效符合 spec §3 动效基调（CSS 过渡 + 强化曲线，不引入 motion）。
- **Placeholder scan**：无 TBD/TODO；各 Base UI 适配点均为显式两分支决策（以安装版类型为准、须记录 forcing error），非占位。测试累计数因 RC API 语义不确定允许 ±1 且以 Task 11 全量运行为准——这是显式核算规则而非模糊。
- **图标规则一致性**：lucide-react 于 Task 1 安装并完成存量替换（SearchField/GroupedList/TrafficLights），Task 3/7 的 Checkbox/Select 直接引用；registry 依赖声明同步（T1 改 3 个存量 item，T11 的 checkbox/select 带 lucide）——全库无内联 SVG 残留。
- **Type consistency**：`text-ui`/`rounded-icon`/`bg-scrim` 在 Task 1 定义后才被 Task 2–10 引用；所有 `React.ComponentProps<typeof BaseX.Part>` 签名模式统一；`{...props}` 前置 + 契约属性后写的顺序在全部组件中一致（Plan 2 裁决的延续）；Task 11 demo 升级引用的导出（Switch/Select 五件套/Slider）均在 Task 3/7/4 定义。
