# Mayumi v2 Plan 2 — 窗口层 + 列表层 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付桌面感的核心组件——Window/TitleBar/TrafficLights/Toolbar/Sidebar（窗口层）与 SidebarNav/GroupedList/SearchField（列表层）——并补上 CI 管线，最终用一个「macOS 设置窗口」集成 story 验收整体观感。

**Architecture:** 延续 Plan 1 的模式：组件在 `apps/www/registry/mayumi/ui/<name>.tsx`，测试与 stories 同目录，最后统一注册进 `registry.json` 并重建 `public/r/*.json`。新增的毛玻璃材质、红绿灯色板、app-region 工具类全部进 `theme.css`（tokens 单一来源）。Sidebar 是唯一用 motion 的组件（收合动画，`springs.smooth`）。

**Tech Stack:** React 19 / Tailwind v4 / motion 13（仅 Sidebar）/ cva + cn / Vitest 4 + Testing Library / Storybook 10 / shadcn CLI。不引入图标库——本计划的 3 个小图标（放大镜、chevron、红绿灯 glyph）内联 SVG。

**Spec:** `docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`

**前置状态（Plan 1 已交付）：** `cn`（`@/registry/mayumi/lib/utils`）、`springs`（`@/registry/mayumi/lib/motion`，四档：snappy/smooth/gentle 临界阻尼 + momentum）、theme tokens（含 `--ease-out`/`--ease-in-out` 强化曲线）、Button、vitest（9 tests 绿，config 为 `vitest.config.mts`）、storybook（`pnpm --filter storybook typecheck` 是 stories 唯一的类型检查）、registry 管线（`public/r/` 现有 5 个 JSON）。

## Global Constraints

- 工作分支 `bigsur`（当前分支，不新建）；conventional commits；每任务至少一次提交。
- 样式只用 `theme.css` tokens（颜色/圆角/字体/缓动禁止写死）；新色值必须先进 tokens 再引用。正文 13px；密集列表行 `leading-tight`。
- 组件根元素带 `data-slot`；类名合并用 `cn()`；React 19 无需 forwardRef。
- 动效规则（Apple 基调，spec §3）：spring 只准 import `springs` 预设，禁止内联参数；UI 弹簧临界阻尼；transform 类动效挂 `motion-safe:`；CSS 过渡显式列举属性（禁 `transition: all`），曲线用 `ease-out`（已映射强化曲线）。
- 毛玻璃：一律用本计划 Task 2 的 `.mayumi-vibrancy` 类——`prefers-reduced-transparency` 与 `prefers-contrast` 降级已内建，组件内禁止手写 `backdrop-blur`。
- TrafficLights 熟悉性硬约束：顺序恒为 关闭/最小化/缩放（左→右），色值 `#ff5f57`/`#febc2e`/`#28c840`（进 tokens），glyph 在**组 hover**时整组显现（非逐个）——看起来像 macOS 的东西必须行为也像。
- 组件不依赖 Tauri/Electron API：窗口控制走回调 props；拖拽用 `data-tauri-drag-region` 属性 + `-webkit-app-region` 类。
- TDD：行为逻辑先写失败测试（RED 因模块不存在/断言失败，GREEN 通过）；测试输出 pristine（警告即缺陷）。
- 每个组件任务交付：组件 + 测试 + story；最后 `pnpm --filter www test` 全绿且 `pnpm --filter storybook typecheck` 通过。
- 测试基线 9 个；各任务给出的累计数为准。

---

### Task 1: CI 管线 + 根 typecheck 脚本

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `package.json`（根，scripts 加一行）

**Interfaces:**
- Produces: push/PR 触发的 CI（install → test → stories typecheck → registry 产物新鲜度检查 → www build）；根 `pnpm typecheck`。

- [ ] **Step 1: 写 `.github/workflows/ci.yml`**

```yaml
name: ci

on:
  push:
    branches: [master, bigsur]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm typecheck
      - name: registry artifacts are fresh
        run: pnpm --filter www exec shadcn build && git diff --exit-code apps/www/public/r
      - run: pnpm --filter www build
```

- [ ] **Step 2: 根 `package.json` scripts 增加**

```json
"typecheck": "pnpm --filter storybook typecheck"
```

- [ ] **Step 3: 本地等价验证**

Run: `pnpm test && pnpm typecheck && pnpm --filter www exec shadcn build && git diff --exit-code apps/www/public/r`
Expected: 全部通过、diff 为空。

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "chore: ci pipeline with registry freshness check"
```

---

### Task 2: 窗口层 tokens——红绿灯色板、vibrancy 材质、app-region 工具类

**Files:**
- Modify: `apps/www/registry/mayumi/styles/theme.css`

**Interfaces:**
- Produces: 工具类 `bg-traffic-close` / `bg-traffic-minimize` / `bg-traffic-zoom`、CSS 变量 `--traffic-glyph`、类 `.mayumi-vibrancy`（含 a11y 降级）、工具类 `app-region-drag` / `app-region-no-drag`。后续任务只准引用这些，不得另写色值或 backdrop-filter。

- [ ] **Step 1: 在现有 `@theme inline` 块内追加三行（放在 `--ease-in-out` 之后）**

```css
  --color-traffic-close: #ff5f57;
  --color-traffic-minimize: #febc2e;
  --color-traffic-zoom: #28c840;
```

- [ ] **Step 2: 在 `:root` 与 `.dark` 两个块内各追加一行（红绿灯 glyph 在彩色圆上，两主题同值）**

```css
  --traffic-glyph: rgba(0, 0, 0, 0.55);
```

- [ ] **Step 3: 文件末尾追加材质与工具类**

```css
@utility app-region-drag {
  -webkit-app-region: drag;
}

@utility app-region-no-drag {
  -webkit-app-region: no-drag;
}

/*
 * Translucent chrome material. Accessibility fallbacks are baked in:
 * reduced-transparency / increased-contrast get a solid surface.
 */
.mayumi-vibrancy {
  background-color: var(--overlay);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
}

@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .mayumi-vibrancy {
    background-color: var(--surface);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
```

- [ ] **Step 4: 验证**

Run: `pnpm --filter www build`
Expected: 构建成功（tailwind 接受新 tokens/utilities）。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: chrome tokens, vibrancy material, app-region utilities"
```

---

### Task 3: Window

**Files:**
- Create: `apps/www/registry/mayumi/ui/window.tsx`, `window.test.tsx`, `window.stories.tsx`（同目录）

**Interfaces:**
- Consumes: `cn`；Task 2 的 `.mayumi-vibrancy`。
- Produces: `Window`（`React.ComponentProps<"div"> & { vibrancy?: boolean }`，默认 flex-col 圆角窗口框）与 `WindowBody`（flex-1 行容器）。`data-slot="window"` / `"window-body"`。

- [ ] **Step 1: 写失败测试 `window.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Window, WindowBody } from "./window"

describe("Window", () => {
  it("renders children in a framed window", () => {
    render(
      <Window>
        <WindowBody>content</WindowBody>
      </Window>
    )
    const win = screen.getByText("content").closest('[data-slot="window"]')
    expect(win).not.toBeNull()
    expect(win).toHaveClass("rounded-window")
  })

  it("applies the vibrancy material only when asked", () => {
    const { rerender } = render(<Window data-testid="w" />)
    expect(screen.getByTestId("w")).toHaveClass("bg-background")
    rerender(<Window data-testid="w" vibrancy />)
    expect(screen.getByTestId("w")).toHaveClass("mayumi-vibrancy")
    expect(screen.getByTestId("w")).not.toHaveClass("bg-background")
  })

  it("merges custom className", () => {
    render(<Window data-testid="w" className="flex-row" />)
    expect(screen.getByTestId("w")).toHaveClass("flex-row")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（`./window` 不存在）。

- [ ] **Step 3: 实现 `window.tsx`**

```tsx
import { cn } from "@/registry/mayumi/lib/utils"

function Window({
  className,
  vibrancy = false,
  ...props
}: React.ComponentProps<"div"> & { vibrancy?: boolean }) {
  return (
    <div
      data-slot="window"
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden rounded-window border border-border text-[13px] text-fg shadow-[var(--shadow-overlay)]",
        vibrancy ? "mayumi-vibrancy" : "bg-background",
        className
      )}
      {...props}
    />
  )
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window-body"
      className={cn("flex min-h-0 flex-1", className)}
      {...props}
    />
  )
}

export { Window, WindowBody }
```

- [ ] **Step 4: 写 `window.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Window, WindowBody } from "./window"

const meta: Meta<typeof Window> = {
  title: "ui/Window",
  component: Window,
}
export default meta

type Story = StoryObj<typeof Window>

export const Solid: Story = {
  render: () => (
    <div className="p-8">
      <Window className="h-80 w-[560px]">
        <WindowBody>
          <div className="flex flex-1 items-center justify-center text-fg-secondary">
            solid window
          </div>
        </WindowBody>
      </Window>
    </div>
  ),
}

export const Vibrancy: Story = {
  render: () => (
    <div className="bg-[url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=1200')] bg-cover p-8">
      <Window vibrancy className="h-80 w-[560px]">
        <WindowBody>
          <div className="flex flex-1 items-center justify-center text-fg-secondary">
            vibrancy window
          </div>
        </WindowBody>
      </Window>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 12 tests PASS（9+3），typecheck 通过。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: window component"
```

---

### Task 4: TitleBar + Toolbar

**Files:**
- Create: `apps/www/registry/mayumi/ui/titlebar.tsx`, `titlebar.test.tsx`, `titlebar.stories.tsx`, `apps/www/registry/mayumi/ui/toolbar.tsx`, `toolbar.test.tsx`

**Interfaces:**
- Consumes: `cn`；Task 2 的 `app-region-drag` / `app-region-no-drag`。
- Produces: `TitleBar`（`React.ComponentProps<"header">`，拖拽区，`data-tauri-drag-region` + `app-region-drag`，h-12）；`Toolbar`（`React.ComponentProps<"div">`，flex-1 行容器）与 `ToolbarTitle`（`React.ComponentProps<"h1">`）。约定：TitleBar/Toolbar 里的交互元素由使用者加 `app-region-no-drag`（story 示范）。

- [ ] **Step 1: 写失败测试**

```tsx
// titlebar.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { TitleBar } from "./titlebar"

describe("TitleBar", () => {
  it("is a drag region for both tauri and electron", () => {
    render(<TitleBar data-testid="tb" />)
    const el = screen.getByTestId("tb")
    expect(el).toHaveAttribute("data-tauri-drag-region")
    expect(el).toHaveClass("app-region-drag")
  })

  it("renders children", () => {
    render(<TitleBar>chrome</TitleBar>)
    expect(screen.getByText("chrome")).toBeInTheDocument()
  })
})
```

```tsx
// toolbar.test.tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Toolbar, ToolbarTitle } from "./toolbar"

describe("Toolbar", () => {
  it("renders the title as a heading", () => {
    render(
      <Toolbar>
        <ToolbarTitle>隐私与安全性</ToolbarTitle>
      </Toolbar>
    )
    expect(
      screen.getByRole("heading", { name: "隐私与安全性" })
    ).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(<Toolbar data-testid="t" className="justify-end" />)
    expect(screen.getByTestId("t")).toHaveClass("justify-end")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现**

```tsx
// titlebar.tsx
import { cn } from "@/registry/mayumi/lib/utils"

function TitleBar({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="titlebar"
      data-tauri-drag-region
      className={cn(
        "app-region-drag relative flex h-12 shrink-0 select-none items-center gap-2 px-3",
        className
      )}
      {...props}
    />
  )
}

export { TitleBar }
```

```tsx
// toolbar.tsx
import { cn } from "@/registry/mayumi/lib/utils"

function Toolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar"
      className={cn("flex min-w-0 flex-1 items-center gap-1", className)}
      {...props}
    />
  )
}

function ToolbarTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="toolbar-title"
      className={cn("truncate text-[13px] font-semibold text-fg", className)}
      {...props}
    />
  )
}

export { Toolbar, ToolbarTitle }
```

- [ ] **Step 4: 写 `titlebar.stories.tsx`（示范 no-drag 约定）**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { TitleBar } from "./titlebar"
import { Toolbar, ToolbarTitle } from "./toolbar"
import { Window } from "./window"

const meta: Meta<typeof TitleBar> = {
  title: "ui/TitleBar",
  component: TitleBar,
}
export default meta

type Story = StoryObj<typeof TitleBar>

export const WithToolbar: Story = {
  render: () => (
    <div className="p-8">
      <Window className="h-40 w-[560px]">
        <TitleBar>
          <Toolbar>
            <Button variant="ghost" size="sm" className="app-region-no-drag" aria-label="返回">
              ←
            </Button>
            <Button variant="ghost" size="sm" className="app-region-no-drag" aria-label="前进">
              →
            </Button>
            <ToolbarTitle className="ml-2">隐私与安全性</ToolbarTitle>
          </Toolbar>
          <Button variant="secondary" size="sm" className="app-region-no-drag">
            高级…
          </Button>
        </TitleBar>
      </Window>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 16 tests PASS（12+4），typecheck 通过。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: titlebar and toolbar components"
```

---

### Task 5: TrafficLights（自绘 + 原生占位双模式）

**Files:**
- Create: `apps/www/registry/mayumi/ui/traffic-lights.tsx`, `traffic-lights.test.tsx`, `traffic-lights.stories.tsx`

**Interfaces:**
- Consumes: `cn`；Task 2 的 traffic tokens、`--traffic-glyph`、`app-region-no-drag`。
- Produces: `TrafficLights`（`React.ComponentProps<"div"> & { mode?: "controls" | "inset"; onClose?: () => void; onMinimize?: () => void; onZoom?: () => void }`）。`controls`：三个 12px 圆钮，组 hover 显 glyph；`inset`：仅 52px 占位（配合原生红绿灯 overlay）。`data-slot="traffic-lights"`。

- [ ] **Step 1: 写失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { TrafficLights } from "./traffic-lights"

describe("TrafficLights", () => {
  it("renders close/minimize/zoom in macOS order", () => {
    render(<TrafficLights />)
    const buttons = screen.getAllByRole("button")
    expect(buttons.map((b) => b.getAttribute("aria-label"))).toEqual([
      "Close window",
      "Minimize window",
      "Zoom window",
    ])
  })

  it("fires the matching callback per light", async () => {
    const onClose = vi.fn()
    const onZoom = vi.fn()
    render(<TrafficLights onClose={onClose} onZoom={onZoom} />)
    await userEvent.click(screen.getByRole("button", { name: "Close window" }))
    await userEvent.click(screen.getByRole("button", { name: "Zoom window" }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(onZoom).toHaveBeenCalledOnce()
  })

  it("inset mode renders a spacer with no buttons", () => {
    render(<TrafficLights mode="inset" data-testid="spacer" />)
    expect(screen.queryAllByRole("button")).toHaveLength(0)
    expect(screen.getByTestId("spacer")).toHaveAttribute("aria-hidden", "true")
  })

  it("merges custom className", () => {
    render(<TrafficLights data-testid="tl" className="ml-4" />)
    expect(screen.getByTestId("tl")).toHaveClass("ml-4")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `traffic-lights.tsx`**

```tsx
import { cn } from "@/registry/mayumi/lib/utils"

type TrafficLightsProps = React.ComponentProps<"div"> & {
  mode?: "controls" | "inset"
  onClose?: () => void
  onMinimize?: () => void
  onZoom?: () => void
}

const lights = [
  {
    key: "close",
    label: "Close window",
    dot: "bg-traffic-close",
    glyph: <path d="M2 2l4 4M6 2L2 6" />,
  },
  {
    key: "minimize",
    label: "Minimize window",
    dot: "bg-traffic-minimize",
    glyph: <path d="M1.5 4h5" />,
  },
  {
    key: "zoom",
    label: "Zoom window",
    dot: "bg-traffic-zoom",
    glyph: <path d="M4 1.5v5M1.5 4h5" />,
  },
] as const

function TrafficLights({
  mode = "controls",
  onClose,
  onMinimize,
  onZoom,
  className,
  ...props
}: TrafficLightsProps) {
  if (mode === "inset") {
    return (
      <div
        data-slot="traffic-lights"
        aria-hidden="true"
        className={cn("w-[52px] shrink-0", className)}
        {...props}
      />
    )
  }
  const handlers = { close: onClose, minimize: onMinimize, zoom: onZoom }
  return (
    <div
      data-slot="traffic-lights"
      className={cn(
        "group/traffic app-region-no-drag flex shrink-0 items-center gap-2",
        className
      )}
      {...props}
    >
      {lights.map((light) => (
        <button
          key={light.key}
          type="button"
          aria-label={light.label}
          onClick={handlers[light.key]}
          className={cn(
            "flex size-3 items-center justify-center rounded-full text-transparent outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 group-hover/traffic:text-(--traffic-glyph)",
            light.dot
          )}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 8 8"
            className="size-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            {light.glyph}
          </svg>
        </button>
      ))}
    </div>
  )
}

export { TrafficLights }
```

- [ ] **Step 4: 写 `traffic-lights.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { TitleBar } from "./titlebar"
import { TrafficLights } from "./traffic-lights"
import { Window } from "./window"

const meta: Meta<typeof TrafficLights> = {
  title: "ui/TrafficLights",
  component: TrafficLights,
}
export default meta

type Story = StoryObj<typeof TrafficLights>

export const Controls: Story = {
  render: () => (
    <div className="p-8">
      <Window className="w-[360px]">
        <TitleBar>
          <TrafficLights
            onClose={() => console.log("close")}
            onMinimize={() => console.log("minimize")}
            onZoom={() => console.log("zoom")}
          />
        </TitleBar>
      </Window>
    </div>
  ),
}

export const NativeInset: Story = {
  render: () => (
    <div className="p-8">
      <Window className="w-[360px]">
        <TitleBar>
          <TrafficLights mode="inset" />
          <span className="text-fg-secondary">原生红绿灯占位（overlay 模式）</span>
        </TitleBar>
      </Window>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 20 tests PASS（16+4），typecheck 通过。目检 storybook：hover 到红绿灯**组**上时三个 glyph 同时出现。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: traffic lights component"
```

---

### Task 6: SearchField

**Files:**
- Create: `apps/www/registry/mayumi/ui/search-field.tsx`, `search-field.test.tsx`, `search-field.stories.tsx`

**Interfaces:**
- Consumes: `cn`。
- Produces: `SearchField`（`React.ComponentProps<"input">`；`className` 作用于外层包裹 div）。内部 `type="search"`（可被 props 覆盖），放大镜为装饰性内联 SVG。`data-slot="search-field"`。

- [ ] **Step 1: 写失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { SearchField } from "./search-field"

describe("SearchField", () => {
  it("is a searchbox and accepts typing", async () => {
    render(<SearchField placeholder="搜索" />)
    const input = screen.getByRole("searchbox")
    await userEvent.type(input, "wifi")
    expect(input).toHaveValue("wifi")
  })

  it("forwards input props and keeps the icon decorative", () => {
    render(<SearchField placeholder="搜索" data-testid="sf" />)
    expect(screen.getByPlaceholderText("搜索")).toBeInTheDocument()
    const wrapper = screen.getByTestId("sf")
    expect(wrapper.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("merges className onto the wrapper", () => {
    render(<SearchField data-testid="sf" className="mx-2" />)
    expect(screen.getByTestId("sf")).toHaveClass("mx-2")
  })
})
```

注：`data-testid`/`className` 落在包裹 div 上；其余 props（placeholder 等）转发给 input。测试据此断言。

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `search-field.tsx`**

```tsx
import { cn } from "@/registry/mayumi/lib/utils"

function SearchField({
  className,
  "data-testid": testId,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div
      data-slot="search-field"
      data-testid={testId}
      className={cn("relative", className)}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-fg-tertiary"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="h-7 w-full rounded-control border border-border bg-surface-2/50 pr-2 pl-7 text-[13px] text-fg outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-fg-tertiary focus:border-accent/60 focus:ring-2 focus:ring-accent/30 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
    </div>
  )
}

export { SearchField }
```

（TS 对 `"data-testid"` 解构的支持：`React.ComponentProps<"input">` 含 index-signature 外的 data-* 需显式声明——若 tsc 报错，将解构改为 `const { className, ...props } = allProps` 并把 `data-testid` 通过 `props` 留在 input 上、测试改为查 `closest('[data-slot="search-field"]')`。以 typecheck 实际结果为准，在报告中记录选择。）

- [ ] **Step 4: 写 `search-field.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SearchField } from "./search-field"

const meta: Meta<typeof SearchField> = {
  title: "ui/SearchField",
  component: SearchField,
}
export default meta

type Story = StoryObj<typeof SearchField>

export const Default: Story = {
  render: () => (
    <div className="w-56 p-6">
      <SearchField placeholder="搜索" />
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 23 tests PASS（20+3），typecheck 通过。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: search field component"
```

---

### Task 7: SidebarNav + SidebarNavItem + SidebarNavIcon

**Files:**
- Create: `apps/www/registry/mayumi/ui/sidebar-nav.tsx`, `sidebar-nav.test.tsx`, `sidebar-nav.stories.tsx`

**Interfaces:**
- Consumes: `cn`。
- Produces: `SidebarNav`（`React.ComponentProps<"nav">`）；`SidebarNavItem`（`React.ComponentProps<"button"> & { active?: boolean }`，active 时 `bg-accent text-accent-fg` + `aria-current="page"` + `data-active`）；`SidebarNavIcon`（`React.ComponentProps<"span">`，20px 彩色圆角图标底座，颜色由调用方传 `className` 如 `bg-traffic-zoom` 或自定义——图标底色属于内容而非 chrome，允许调用方指定）。

- [ ] **Step 1: 写失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"

describe("SidebarNav", () => {
  it("marks the active item for a11y and styling", () => {
    render(
      <SidebarNav>
        <SidebarNavItem active>Wi-Fi</SidebarNavItem>
        <SidebarNavItem>蓝牙</SidebarNavItem>
      </SidebarNav>
    )
    const active = screen.getByRole("button", { name: "Wi-Fi" })
    expect(active).toHaveAttribute("aria-current", "page")
    expect(active).toHaveClass("bg-accent")
    expect(screen.getByRole("button", { name: "蓝牙" })).not.toHaveAttribute(
      "aria-current"
    )
  })

  it("fires onClick", async () => {
    const onClick = vi.fn()
    render(<SidebarNavItem onClick={onClick}>网络</SidebarNavItem>)
    await userEvent.click(screen.getByRole("button", { name: "网络" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("renders the icon tile with custom color class", () => {
    render(
      <SidebarNavItem>
        <SidebarNavIcon data-testid="icon" className="bg-traffic-zoom" />
        Wi-Fi
      </SidebarNavItem>
    )
    expect(screen.getByTestId("icon")).toHaveClass("bg-traffic-zoom")
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `sidebar-nav.tsx`**

```tsx
import { cn } from "@/registry/mayumi/lib/utils"

function SidebarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-nav"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function SidebarNavItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      data-slot="sidebar-nav-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-7 w-full items-center gap-2 rounded-control px-2 text-left text-[13px] leading-tight select-none outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60",
        active
          ? "bg-accent text-accent-fg"
          : "text-fg hover:bg-surface-2/70 active:bg-surface-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarNavIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sidebar-nav-icon"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-accent text-accent-fg [&_svg]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export { SidebarNav, SidebarNavIcon, SidebarNavItem }
```

- [ ] **Step 4: 写 `sidebar-nav.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"

const meta: Meta<typeof SidebarNav> = {
  title: "ui/SidebarNav",
  component: SidebarNav,
}
export default meta

type Story = StoryObj<typeof SidebarNav>

export const Default: Story = {
  render: () => (
    <div className="w-56 p-6">
      <SidebarNav>
        <SidebarNavItem>
          <SidebarNavIcon className="bg-traffic-close" />
          通用
        </SidebarNavItem>
        <SidebarNavItem active>
          <SidebarNavIcon className="bg-traffic-zoom" />
          Wi-Fi
        </SidebarNavItem>
        <SidebarNavItem>
          <SidebarNavIcon className="bg-traffic-minimize" />
          蓝牙
        </SidebarNavItem>
      </SidebarNav>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 26 tests PASS（23+3），typecheck 通过。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: sidebar nav components"
```

---

### Task 8: Sidebar（vibrancy 材质，可收合）

**Files:**
- Create: `apps/www/registry/mayumi/ui/sidebar.tsx`, `sidebar.test.tsx`, `sidebar.stories.tsx`
- Modify: `apps/www/vitest.setup.ts`（追加 matchMedia 兜底 stub——motion 的 `useReducedMotion` 在 jsdom 下需要）

**Interfaces:**
- Consumes: `cn`、`springs.smooth`（收合）、`.mayumi-vibrancy`。
- Produces: `Sidebar`（client 组件；`{ collapsed?: boolean; width?: number }` + motion.aside props；收合动画宽度 0↔width，`reduced-motion` 时零时长；收合时 `aria-hidden` + `inert`）。`data-slot="sidebar"`。内层固定宽度容器避免动画中内容回流。

宽度动画说明（供审查者）：收合本质是布局让位，无 transform 等价实现（同手风琴的 height 豁免）；动画由 motion 驱动、`initial={false}` 首帧不动画。

- [ ] **Step 1: `vitest.setup.ts` 追加（文件已存在，在末尾加）**

```ts
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
```

- [ ] **Step 2: 写失败测试 `sidebar.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Sidebar } from "./sidebar"

describe("Sidebar", () => {
  it("renders children on the vibrancy material", () => {
    render(<Sidebar data-testid="sb">nav</Sidebar>)
    const el = screen.getByTestId("sb")
    expect(el).toHaveClass("mayumi-vibrancy")
    expect(screen.getByText("nav")).toBeInTheDocument()
  })

  it("hides from the a11y tree when collapsed", () => {
    render(
      <Sidebar data-testid="sb" collapsed>
        nav
      </Sidebar>
    )
    const el = screen.getByTestId("sb")
    expect(el).toHaveAttribute("data-collapsed")
    expect(el).toHaveAttribute("aria-hidden", "true")
    expect(el).toHaveAttribute("inert")
  })

  it("is fully present when expanded", () => {
    render(<Sidebar data-testid="sb">nav</Sidebar>)
    const el = screen.getByTestId("sb")
    expect(el).not.toHaveAttribute("data-collapsed")
    expect(el).not.toHaveAttribute("aria-hidden")
  })
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 4: 实现 `sidebar.tsx`**

```tsx
"use client"

import { motion, useReducedMotion } from "motion/react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

type SidebarProps = React.ComponentProps<typeof motion.aside> & {
  collapsed?: boolean
  width?: number
}

function Sidebar({
  collapsed = false,
  width = 240,
  className,
  children,
  ...props
}: SidebarProps) {
  const reduce = useReducedMotion()
  return (
    <motion.aside
      data-slot="sidebar"
      data-collapsed={collapsed || undefined}
      aria-hidden={collapsed || undefined}
      inert={collapsed || undefined}
      initial={false}
      animate={{ width: collapsed ? 0 : width }}
      transition={reduce ? { duration: 0 } : springs.smooth}
      className={cn(
        "mayumi-vibrancy flex h-full shrink-0 flex-col overflow-hidden border-r border-border",
        className
      )}
      {...props}
    >
      <div style={{ width }} className="flex min-h-0 flex-1 flex-col gap-2 p-2">
        {children}
      </div>
    </motion.aside>
  )
}

export { Sidebar }
```

- [ ] **Step 5: 写 `sidebar.stories.tsx`（组合 SearchField + SidebarNav，含收合切换）**

```tsx
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { SearchField } from "./search-field"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"
import { Window, WindowBody } from "./window"

const meta: Meta<typeof Sidebar> = {
  title: "ui/Sidebar",
  component: Sidebar,
}
export default meta

type Story = StoryObj<typeof Sidebar>

function CollapsibleDemo() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="p-8">
      <Window className="h-96 w-[640px]">
        <WindowBody>
          <Sidebar collapsed={collapsed}>
            <SearchField placeholder="搜索" />
            <SidebarNav>
              <SidebarNavItem active>
                <SidebarNavIcon className="bg-traffic-zoom" />
                Wi-Fi
              </SidebarNavItem>
              <SidebarNavItem>
                <SidebarNavIcon className="bg-traffic-minimize" />
                蓝牙
              </SidebarNavItem>
            </SidebarNav>
          </Sidebar>
          <div className="flex flex-1 items-start p-4">
            <Button onClick={() => setCollapsed((c) => !c)}>
              {collapsed ? "展开侧栏" : "收起侧栏"}
            </Button>
          </div>
        </WindowBody>
      </Window>
    </div>
  )
}

export const Collapsible: Story = { render: () => <CollapsibleDemo /> }
```

- [ ] **Step 6: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 29 tests PASS（26+3），typecheck 通过。目检 storybook：收合动画平滑无过冲（临界阻尼），系统开启"减弱动态效果"时瞬时切换。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: collapsible sidebar component"
```

---

### Task 9: GroupedList + GroupedListItem

**Files:**
- Create: `apps/www/registry/mayumi/ui/grouped-list.tsx`, `grouped-list.test.tsx`, `grouped-list.stories.tsx`

**Interfaces:**
- Consumes: `cn`。
- Produces: `GroupedList`（`React.ComponentProps<"div">`，圆角分组容器，`divide-y`）；`GroupedListItem`（`React.ComponentProps<"button"> & { icon?: ReactNode; label: ReactNode; description?: ReactNode; value?: ReactNode; chevron?: boolean }`——有 `onClick` 时渲染为 button（hover/active 底色反馈），否则渲染为静态 div）。`data-slot="grouped-list"` / `"grouped-list-item"`。

- [ ] **Step 1: 写失败测试**

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { GroupedList, GroupedListItem } from "./grouped-list"

describe("GroupedList", () => {
  it("interactive rows are buttons and fire onClick", async () => {
    const onClick = vi.fn()
    render(
      <GroupedList>
        <GroupedListItem label="App 管理" onClick={onClick} chevron />
      </GroupedList>
    )
    await userEvent.click(screen.getByRole("button", { name: /App 管理/ }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("static rows are not buttons", () => {
    render(
      <GroupedList>
        <GroupedListItem label="版本" value="1.0.0" />
      </GroupedList>
    )
    expect(screen.queryByRole("button")).toBeNull()
    expect(screen.getByText("版本")).toBeInTheDocument()
  })

  it("renders value and description slots", () => {
    render(
      <GroupedList>
        <GroupedListItem
          label="敏感内容警告"
          description="检测敏感图片与视频"
          value="关闭"
        />
      </GroupedList>
    )
    expect(screen.getByText("关闭")).toBeInTheDocument()
    expect(screen.getByText("检测敏感图片与视频")).toBeInTheDocument()
  })

  it("shows a chevron only when asked", () => {
    const { rerender } = render(
      <GroupedList>
        <GroupedListItem data-testid="row" label="a" />
      </GroupedList>
    )
    expect(screen.getByTestId("row").querySelector("svg")).toBeNull()
    rerender(
      <GroupedList>
        <GroupedListItem data-testid="row" label="a" chevron />
      </GroupedList>
    )
    expect(screen.getByTestId("row").querySelector("svg")).not.toBeNull()
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `grouped-list.tsx`**

```tsx
import { cn } from "@/registry/mayumi/lib/utils"

function GroupedList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grouped-list"
      className={cn(
        "divide-y divide-border overflow-hidden rounded-card border border-border bg-surface",
        className
      )}
      {...props}
    />
  )
}

type GroupedListItemProps = React.ComponentProps<"button"> & {
  icon?: React.ReactNode
  label: React.ReactNode
  description?: React.ReactNode
  value?: React.ReactNode
  chevron?: boolean
}

function GroupedListItem({
  icon,
  label,
  description,
  value,
  chevron = false,
  className,
  onClick,
  ...props
}: GroupedListItemProps) {
  const interactive = Boolean(onClick)
  const Comp = (interactive ? "button" : "div") as "button"
  return (
    <Comp
      {...(interactive ? { type: "button" as const } : {})}
      data-slot="grouped-list-item"
      onClick={onClick}
      className={cn(
        "flex min-h-10 w-full items-center gap-3 px-3 py-2 text-left leading-tight",
        interactive &&
          "outline-none transition-colors duration-150 ease-out hover:bg-surface-2/50 focus-visible:bg-surface-2/50 active:bg-surface-2",
        className
      )}
      {...props}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[13px] text-fg">{label}</span>
        {description ? (
          <span className="truncate text-xs text-fg-tertiary">
            {description}
          </span>
        ) : null}
      </span>
      {value ? (
        <span className="shrink-0 text-[13px] text-fg-secondary">{value}</span>
      ) : null}
      {chevron ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 8 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="size-3 shrink-0 text-fg-tertiary"
        >
          <path d="M1.5 1.5 6 6l-4.5 4.5" />
        </svg>
      ) : null}
    </Comp>
  )
}

export { GroupedList, GroupedListItem }
```

- [ ] **Step 4: 写 `grouped-list.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { SidebarNavIcon } from "./sidebar-nav"

const meta: Meta<typeof GroupedList> = {
  title: "ui/GroupedList",
  component: GroupedList,
}
export default meta

type Story = StoryObj<typeof GroupedList>

export const Settings: Story = {
  render: () => (
    <div className="w-[480px] space-y-4 p-6">
      <GroupedList>
        <GroupedListItem
          icon={<SidebarNavIcon className="bg-traffic-minimize" />}
          label="专注模式"
          value="0"
          chevron
          onClick={() => {}}
        />
        <GroupedListItem
          icon={<SidebarNavIcon />}
          label="自动化"
          value="10"
          chevron
          onClick={() => {}}
        />
        <GroupedListItem
          icon={<SidebarNavIcon className="bg-traffic-close" />}
          label="App 管理"
          value="2"
          chevron
          onClick={() => {}}
        />
      </GroupedList>
      <GroupedList>
        <GroupedListItem
          label="敏感内容警告"
          description="检测敏感图片与视频"
          value="关闭"
        />
      </GroupedList>
    </div>
  ),
}
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test && pnpm --filter storybook typecheck`
Expected: 33 tests PASS（29+4），typecheck 通过。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: grouped list components"
```

---

### Task 10: registry 注册 + 「设置窗口」集成 story

**Files:**
- Modify: `apps/www/registry.json`（items 追加 8 项）
- Create: `apps/www/registry/mayumi/ui/settings-demo.stories.tsx`（story-only，不进 registry）
- Regenerate: `apps/www/public/r/*.json`（提交）

**Interfaces:**
- Consumes: Task 3–9 全部组件。
- Produces: registry 新增 `/r/{window,titlebar,toolbar,traffic-lights,search-field,sidebar-nav,sidebar,grouped-list}.json`（共 13 个 JSON）；Storybook `demo/Settings` 集成场景。

- [ ] **Step 1: `registry.json` 的 `items` 数组末尾追加 8 项**

```json
{
  "name": "window",
  "type": "registry:ui",
  "title": "Window",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [{ "path": "registry/mayumi/ui/window.tsx", "type": "registry:ui" }]
},
{
  "name": "titlebar",
  "type": "registry:ui",
  "title": "TitleBar",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [{ "path": "registry/mayumi/ui/titlebar.tsx", "type": "registry:ui" }]
},
{
  "name": "toolbar",
  "type": "registry:ui",
  "title": "Toolbar",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [{ "path": "registry/mayumi/ui/toolbar.tsx", "type": "registry:ui" }]
},
{
  "name": "traffic-lights",
  "type": "registry:ui",
  "title": "TrafficLights",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [
    { "path": "registry/mayumi/ui/traffic-lights.tsx", "type": "registry:ui" }
  ]
},
{
  "name": "search-field",
  "type": "registry:ui",
  "title": "SearchField",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [
    { "path": "registry/mayumi/ui/search-field.tsx", "type": "registry:ui" }
  ]
},
{
  "name": "sidebar-nav",
  "type": "registry:ui",
  "title": "SidebarNav",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [
    { "path": "registry/mayumi/ui/sidebar-nav.tsx", "type": "registry:ui" }
  ]
},
{
  "name": "sidebar",
  "type": "registry:ui",
  "title": "Sidebar",
  "dependencies": ["motion"],
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json",
    "https://mayumi.netlify.app/r/motion.json"
  ],
  "files": [{ "path": "registry/mayumi/ui/sidebar.tsx", "type": "registry:ui" }]
},
{
  "name": "grouped-list",
  "type": "registry:ui",
  "title": "GroupedList",
  "registryDependencies": [
    "https://mayumi.netlify.app/r/theme.json",
    "https://mayumi.netlify.app/r/utils.json"
  ],
  "files": [
    { "path": "registry/mayumi/ui/grouped-list.tsx", "type": "registry:ui" }
  ]
}
```

- [ ] **Step 2: 写 `settings-demo.stories.tsx`（复刻系统设置的集成场景）**

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { GroupedList, GroupedListItem } from "./grouped-list"
import { SearchField } from "./search-field"
import { Sidebar } from "./sidebar"
import { SidebarNav, SidebarNavIcon, SidebarNavItem } from "./sidebar-nav"
import { TitleBar } from "./titlebar"
import { Toolbar, ToolbarTitle } from "./toolbar"
import { TrafficLights } from "./traffic-lights"
import { Window, WindowBody } from "./window"

const meta: Meta = { title: "demo/Settings" }
export default meta

export const SettingsWindow: StoryObj = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Window className="h-[560px] w-[820px] flex-row">
        <Sidebar width={220} className="h-full">
          <div className="flex h-12 shrink-0 items-center px-1">
            <TrafficLights />
          </div>
          <SearchField placeholder="搜索" />
          <SidebarNav>
            <SidebarNavItem>
              <SidebarNavIcon className="bg-traffic-zoom" />
              Wi-Fi
            </SidebarNavItem>
            <SidebarNavItem>
              <SidebarNavIcon />
              蓝牙
            </SidebarNavItem>
            <SidebarNavItem>
              <SidebarNavIcon className="bg-traffic-minimize" />
              网络
            </SidebarNavItem>
            <SidebarNavItem active>
              <SidebarNavIcon className="bg-traffic-close" />
              隐私与安全性
            </SidebarNavItem>
          </SidebarNav>
        </Sidebar>
        <div className="flex min-w-0 flex-1 flex-col">
          <TitleBar>
            <Toolbar>
              <Button variant="ghost" size="sm" className="app-region-no-drag" aria-label="返回">
                ←
              </Button>
              <ToolbarTitle className="ml-1">隐私与安全性</ToolbarTitle>
            </Toolbar>
          </TitleBar>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-6">
            <GroupedList>
              <GroupedListItem
                icon={<SidebarNavIcon className="bg-traffic-minimize" />}
                label="专注模式"
                value="0"
                chevron
                onClick={() => {}}
              />
              <GroupedListItem
                icon={<SidebarNavIcon />}
                label="自动化"
                value="10"
                chevron
                onClick={() => {}}
              />
              <GroupedListItem
                icon={<SidebarNavIcon className="bg-traffic-close" />}
                label="App 管理"
                value="2"
                chevron
                onClick={() => {}}
              />
            </GroupedList>
            <GroupedList>
              <GroupedListItem
                label="敏感内容警告"
                description="检测敏感图片与视频"
                value="关闭"
                chevron
                onClick={() => {}}
              />
            </GroupedList>
          </div>
        </div>
      </Window>
    </div>
  ),
}
```

- [ ] **Step 3: 重建 registry 并验证**

Run: `pnpm --filter www exec shadcn build && ls apps/www/public/r/ | wc -l`
Expected: 13 个 JSON（原 5 + 新 8），`window.json` 等内嵌完整源码。

- [ ] **Step 4: 全量验证**

Run: `pnpm --filter www test && pnpm typecheck && pnpm --filter www build && pnpm --filter storybook build`
Expected: 33 tests 全绿，全部构建成功。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: register window/list layer in registry with settings demo"
```

---

## Self-Review 结果

- **Spec coverage**：spec §4 窗口层 5 组件（Window/TitleBar/TrafficLights/Toolbar/Sidebar）→ Task 3/4/5/8；列表层 3 组（SidebarNav+Item/GroupedList+Item/SearchField）→ Task 7/9/6；红绿灯双模式（自绘+占位）→ Task 5；Sidebar motion spring 收合 → Task 8（springs.smooth，临界阻尼）；毛玻璃仅用于 Sidebar/弹层且带 a11y 降级 → Task 2。终审遗留建议（CI + 根 typecheck + registry 新鲜度）→ Task 1。基础控件/Command/Toast/文档站页面属 Plan 3/4，非缺口。
- **Placeholder scan**：无 TBD/TODO；Task 6 的 `data-testid` 类型兜底是显式两分支决策（以 typecheck 为准、须记录），非占位。
- **Type consistency**：`cn`/`springs.smooth` 签名与 Plan 1 一致；跨任务消费核对——Task 10 demo 用到的每个导出（`Window`/`WindowBody`/`TitleBar`/`Toolbar`/`ToolbarTitle`/`TrafficLights`/`SearchField`/`Sidebar`/`SidebarNav`/`SidebarNavItem`/`SidebarNavIcon`/`GroupedList`/`GroupedListItem`/`Button`）均在 Task 3–9 或 Plan 1 中定义；`bg-traffic-*`/`.mayumi-vibrancy`/`app-region-*` 均在 Task 2 定义后才被引用；测试累计数已逐任务核算（9→12→16→20→23→26→29→33）。
