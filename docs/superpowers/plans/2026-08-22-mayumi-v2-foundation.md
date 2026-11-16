# Mayumi v2 Foundation Implementation Plan (Plan 1 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 清空旧代码，搭建 mac-style shadcn registry 的完整地基：monorepo、设计 tokens、registry 构建管线，并用第一个组件 Button 验证「源码 → registry JSON → Storybook → 测试」的端到端链路。

**Architecture:** pnpm monorepo。`apps/www` 是 Next.js 16 文档站兼 registry 宿主：组件源码放在 `apps/www/registry/mayumi/` 下（single source of truth），`shadcn build` 把 `registry.json` 编译成 `public/r/*.json` 静态分发。`apps/storybook` 是独立的开发工作台，stories 与组件源码同目录（不进入 registry 分发）。

**Tech Stack:** React 19.2 / Next 16.3 / Tailwind CSS 4.3（CSS-first tokens）/ cva + clsx + tailwind-merge / motion 13 / Storybook 10（react-vite）/ Vitest 4 + Testing Library / shadcn CLI 4.19。

**Spec:** `docs/superpowers/specs/2026-08-22-mayumi-v2-mac-style-registry-design.md`

**后续计划**（本计划完成后再写）：Plan 2 窗口层+列表层组件；Plan 3 基础控件；Plan 4 Command/Toast + 文档站 + 设置 demo。

## Global Constraints

- 工作分支：`bigsur`（当前分支，不新建）。
- Node >= 20（本机 22.22），pnpm 11（本机 11.9.0）。
- 依赖一律装当前最新版（`pnpm add` 不指定版本号即可），版本基线见 spec：react 19.2.x / next 16.3.x / tailwindcss 4.3.x / motion 13.1.x / storybook 10.5.x / vitest 4.1.x / typescript 7.0.x / shadcn CLI 4.19.x。
- npm 上的 `mayumi` 包不动：本仓库自此不再包含任何 npm publish 配置。
- 样式规则：所有颜色/圆角/字体只能引用 `theme.css` 的 tokens（禁止组件里写死色值）；正文字号 13px；组件根元素带 `data-slot` 属性；类名合并一律用 `cn()`；variants 一律用 cva。
- 动画规则：简单 hover/fade 用 CSS transition；spring 动画一律 import `lib/motion.ts` 的预设，不得内联 spring 参数。
- LICENSE、`.git/`、`docs/`、`.claude/`、`.github/`、`.vscode/`、`skills-lock.json` 保留，其余旧文件按 Task 1 清单删除。
- 提交信息用 conventional commits（feat/chore/test/docs），每个 Task 至少一次提交。

---

### Task 1: 清场 + monorepo 骨架

**Files:**
- Delete: `components/`, `example/`, `apps/`(旧), `rollup.config.js`, `jest.config.js`, `tsconfig.json`, `pnpm-lock.yaml`, `CHANGELOG.md`, `.changeset/`, `.husky/`, `.eslintrc.js`, `.npmrc`, `.agents/`, `node_modules/`
- Rewrite: `package.json`, `pnpm-workspace.yaml`, `README.md`, `.gitignore`
- Keep: `LICENSE`, `netlify.toml`(Task 8 修改), `docs/`, `.claude/`, `.github/`, `.vscode/`, `skills-lock.json`

**Interfaces:**
- Produces: 空 workspace（`apps/*`、`packages/*`），根脚本 `dev`/`build`/`test`/`storybook` 分别转发到子包。

- [ ] **Step 1: 删除旧代码**

```bash
cd /Volumes/ORICO/Users/jiangwei/projects/mayumi
rm -rf components example apps rollup.config.js jest.config.js tsconfig.json \
  pnpm-lock.yaml CHANGELOG.md .changeset .husky .eslintrc.js .npmrc .agents node_modules
```

- [ ] **Step 2: 重写根 `package.json`**

```json
{
  "name": "mayumi-monorepo",
  "private": true,
  "engines": { "node": ">=20" },
  "packageManager": "pnpm@11.9.0",
  "scripts": {
    "dev": "pnpm --filter www dev",
    "build": "pnpm --filter www build",
    "test": "pnpm --filter www test",
    "storybook": "pnpm --filter storybook dev"
  }
}
```

- [ ] **Step 3: 重写 `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: 重写 `README.md`（占位版，Plan 4 完善）**

```markdown
# mayumi

Mac-style React components for building desktop-grade app UIs (Raycast / Linear aesthetic). Distributed as a [shadcn registry](https://ui.shadcn.com/docs/registry) — you own the code.

> v2 rewrite in progress. The legacy npm package (`mayumi@0.0.4`) is frozen and unrelated to this codebase.

- Docs & registry: https://mayumi.netlify.app
- Add a component: `npx shadcn add @mayumi/button`
```

- [ ] **Step 5: 重写 `.gitignore`**

```
node_modules/
.next/
dist/
storybook-static/
*.log
.DS_Store
```

- [ ] **Step 6: 验证 workspace 为空但合法**

Run: `pnpm install`
Expected: 成功退出（无子包，仅生成新的 `pnpm-lock.yaml`）。

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore!: remove legacy library, reset to empty monorepo"
```

---

### Task 2: 脚手架 `apps/www`（Next 16 + Tailwind 4）

**Files:**
- Create: `apps/www/`（create-next-app 生成：`app/layout.tsx`、`app/page.tsx`、`app/globals.css`、`package.json`、`tsconfig.json` 等）

**Interfaces:**
- Produces: Next.js app，TS 路径别名 `@/*` → `apps/www/*`；`pnpm --filter www dev` 可启动。

- [ ] **Step 1: 生成 app**

```bash
cd /Volumes/ORICO/Users/jiangwei/projects/mayumi
pnpm create next-app@latest apps/www --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-pnpm --yes
```

Expected: 生成 Next 16 + Tailwind v4 项目（`globals.css` 首行是 `@import "tailwindcss";`）。若交互询问 Turbopack 等选项，全部接受默认值。

- [ ] **Step 2: 确认关键配置**

检查 `apps/www/tsconfig.json` 含 `"paths": { "@/*": ["./*"] }`；`apps/www/package.json` 的 `name` 字段改为 `"www"`（create-next-app 可能命名为 `www` 以外的值）。

- [ ] **Step 3: 验证 dev server**

Run: `pnpm --filter www build`
Expected: `next build` 成功。

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold apps/www with next 16 + tailwind 4"
```

---

### Task 3: 设计 tokens（theme.css）+ 全局布局

**Files:**
- Create: `apps/www/registry/mayumi/styles/theme.css`
- Modify: `apps/www/app/globals.css`（全量替换）, `apps/www/app/layout.tsx`（全量替换）, `apps/www/app/page.tsx`（全量替换）

**Interfaces:**
- Produces: Tailwind 工具类 `bg-background` `bg-surface` `bg-surface-2` `bg-overlay` `border-border` `text-fg` `text-fg-secondary` `text-fg-tertiary` `bg-accent` `text-accent-fg` `bg-danger` `rounded-window` `rounded-card` `rounded-control` `font-sans`；CSS 变量 `--highlight`（inset 高光）、`--shadow-overlay`。后续所有组件只用这些 tokens。

- [ ] **Step 1: 写 `theme.css`**

```css
/* mayumi design tokens — dark-first, light supported. Raycast/Linear aesthetic. */
:root {
  --background: #f2f2f4;
  --surface: #ffffff;
  --surface-2: #ececef;
  --overlay: rgba(252, 252, 253, 0.78);
  --border: rgba(0, 0, 0, 0.1);
  --highlight: rgba(255, 255, 255, 0.65);
  --fg: rgba(0, 0, 0, 0.88);
  --fg-secondary: rgba(0, 0, 0, 0.56);
  --fg-tertiary: rgba(0, 0, 0, 0.36);
  --accent: #5e6ad2;
  --accent-fg: #ffffff;
  --danger: #e5484d;
  --shadow-overlay: 0 16px 48px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.dark {
  --background: #0a0a0c;
  --surface: #141416;
  --surface-2: #1c1c20;
  --overlay: rgba(22, 22, 26, 0.72);
  --border: rgba(255, 255, 255, 0.08);
  --highlight: rgba(255, 255, 255, 0.06);
  --fg: rgba(255, 255, 255, 0.9);
  --fg-secondary: rgba(255, 255, 255, 0.6);
  --fg-tertiary: rgba(255, 255, 255, 0.4);
  --accent: #6e79d6;
  --accent-fg: #ffffff;
  --danger: #ec5d64;
  --shadow-overlay: 0 16px 48px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06);
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-overlay: var(--overlay);
  --color-border: var(--border);
  --color-fg: var(--fg);
  --color-fg-secondary: var(--fg-secondary);
  --color-fg-tertiary: var(--fg-tertiary);
  --color-accent: var(--accent);
  --color-accent-fg: var(--accent-fg);
  --color-danger: var(--danger);
  --radius-window: 14px;
  --radius-card: 10px;
  --radius-control: 6px;
  --font-sans: var(--font-inter, "Inter"), -apple-system, system-ui,
    "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
}
```

- [ ] **Step 2: 替换 `globals.css`**

```css
@import "tailwindcss";
@import "../registry/mayumi/styles/theme.css";

@custom-variant dark (&:where(.dark, .dark *));

body {
  @apply bg-background font-sans text-[13px] text-fg antialiased;
}
```

- [ ] **Step 3: 替换 `layout.tsx`（Inter 字体 + 默认暗色）**

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "mayumi",
  description: "Mac-style React components. Raycast / Linear aesthetic.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: 替换 `page.tsx`（临时 token 校样页，Plan 4 会重写）**

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-80 rounded-card border border-border bg-surface p-4 shadow-[var(--shadow-overlay)]">
        <p className="font-medium text-fg">mayumi v2</p>
        <p className="mt-1 text-fg-secondary">
          Design tokens live. 中文回退到苹方。
        </p>
        <p className="mt-1 text-fg-tertiary">tertiary text</p>
      </div>
    </main>
  )
}
```

- [ ] **Step 5: 验证**

Run: `pnpm --filter www build`
Expected: 构建成功。再 `pnpm dev` 人工目检一次：近黑背景、卡片有 1px 半透明边框、英文为 Inter、中文为苹方。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: mac-style design tokens (dark-first) and base layout"
```

---

### Task 4: Vitest 基建 + `lib/utils.ts`（cn）

**Files:**
- Create: `apps/www/vitest.config.ts`, `apps/www/vitest.setup.ts`, `apps/www/registry/mayumi/lib/utils.ts`, `apps/www/registry/mayumi/lib/utils.test.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string`（clsx + tailwind-merge）。后续所有组件 `import { cn } from "@/registry/mayumi/lib/utils"`。

- [ ] **Step 1: 安装依赖**

```bash
pnpm --filter www add clsx tailwind-merge
pnpm --filter www add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: 写 `vitest.config.ts` 与 `vitest.setup.ts`**

```ts
// apps/www/vitest.config.ts
import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    include: ["registry/**/*.test.{ts,tsx}"],
  },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
})
```

```ts
// apps/www/vitest.setup.ts
import "@testing-library/jest-dom/vitest"
```

`apps/www/package.json` 的 scripts 增加 `"test": "vitest run"`。

- [ ] **Step 3: 写失败测试**

```ts
// apps/www/registry/mayumi/lib/utils.test.ts
import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c")
  })
  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
})
```

- [ ] **Step 4: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（`./utils` 不存在）。

- [ ] **Step 5: 实现 `utils.ts`**

```ts
// apps/www/registry/mayumi/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: 运行确认通过**

Run: `pnpm --filter www test`
Expected: PASS（2 tests）。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: cn utility with vitest infrastructure"
```

---

### Task 5: `lib/motion.ts`（统一 spring 预设）

**Files:**
- Create: `apps/www/registry/mayumi/lib/motion.ts`, `apps/www/registry/mayumi/lib/motion.test.ts`

**Interfaces:**
- Produces: `springs.snappy | springs.smooth | springs.gentle`（motion 的 `Transition` 对象）。规则：弹层用 `snappy`、布局/收合用 `smooth`、hover 级微动效用 `gentle`。后续组件禁止内联 spring 参数。

- [ ] **Step 1: 安装 motion**

```bash
pnpm --filter www add motion
```

- [ ] **Step 2: 写失败测试**

```ts
// apps/www/registry/mayumi/lib/motion.test.ts
import { describe, expect, it } from "vitest"
import { springs } from "./motion"

describe("springs", () => {
  it("exposes the three canonical presets as spring transitions", () => {
    for (const name of ["snappy", "smooth", "gentle"] as const) {
      expect(springs[name].type).toBe("spring")
      expect(springs[name].stiffness).toBeGreaterThan(0)
      expect(springs[name].damping).toBeGreaterThan(0)
    }
  })
  it("orders presets from stiffest to softest", () => {
    expect(springs.snappy.stiffness!).toBeGreaterThan(springs.smooth.stiffness!)
    expect(springs.smooth.stiffness!).toBeGreaterThan(springs.gentle.stiffness!)
  })
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（`./motion` 不存在）。

- [ ] **Step 4: 实现 `motion.ts`**

```ts
// apps/www/registry/mayumi/lib/motion.ts
import type { Transition } from "motion/react"

/**
 * Canonical spring presets. snappy = popovers/dialogs, smooth = layout
 * (sidebar collapse, reorder), gentle = hover-level micro interactions.
 */
export const springs = {
  snappy: { type: "spring", stiffness: 480, damping: 34, mass: 0.9 },
  smooth: { type: "spring", stiffness: 260, damping: 30, mass: 1 },
  gentle: { type: "spring", stiffness: 170, damping: 26, mass: 1 },
} satisfies Record<string, Transition>
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test`
Expected: PASS（累计 4 tests）。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: canonical spring presets (snappy/smooth/gentle)"
```

---

### Task 6: Button 组件（TDD）

**Files:**
- Create: `apps/www/registry/mayumi/ui/button.tsx`, `apps/www/registry/mayumi/ui/button.test.tsx`

**Interfaces:**
- Consumes: `cn`（Task 4）。
- Produces: `Button`（props: `React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>`，variant: `primary | secondary | ghost | danger`，size: `sm | md | lg`，默认 `secondary`/`md`）与 `buttonVariants`。根元素 `data-slot="button"`。

- [ ] **Step 1: 安装 cva**

```bash
pnpm --filter www add class-variance-authority
```

- [ ] **Step 2: 写失败测试**

```tsx
// apps/www/registry/mayumi/ui/button.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("renders children and fires onClick", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies the primary variant class", () => {
    render(<Button variant="primary">Go</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-accent")
  })

  it("exposes data-slot and merges custom className", () => {
    render(<Button className="w-full">Go</Button>)
    const el = screen.getByRole("button")
    expect(el).toHaveAttribute("data-slot", "button")
    expect(el).toHaveClass("w-full")
  })
})
```

- [ ] **Step 3: 运行确认失败**

Run: `pnpm --filter www test`
Expected: FAIL（`./button` 不存在）。

- [ ] **Step 4: 实现 `button.tsx`**

```tsx
// apps/www/registry/mayumi/ui/button.tsx
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-control text-[13px] font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-accent/90",
        secondary:
          "border border-border bg-surface-2 text-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-surface-2/70",
        ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
        danger: "bg-danger text-accent-fg hover:bg-danger/90",
      },
      size: {
        sm: "h-6 px-2",
        md: "h-7 px-3",
        lg: "h-8 px-4",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 5: 运行确认通过**

Run: `pnpm --filter www test`
Expected: PASS（累计 8 tests）。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: button component (primary/secondary/ghost/danger)"
```

---

### Task 7: registry.json + shadcn build 管线

**Files:**
- Create: `apps/www/registry.json`, `apps/www/components.json`
- Modify: `apps/www/package.json`（build 脚本）
- Generate: `apps/www/public/r/*.json`（构建产物，提交入库）

**Interfaces:**
- Consumes: Task 3–6 的四个源文件。
- Produces: 静态 registry：`/r/theme.json` `/r/utils.json` `/r/motion.json` `/r/button.json`。用户侧用法：`npx shadcn add https://mayumi.netlify.app/r/button.json`。

- [ ] **Step 1: 写 `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/registry/mayumi/ui",
    "lib": "@/registry/mayumi/lib",
    "utils": "@/registry/mayumi/lib/utils",
    "hooks": "@/registry/mayumi/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 2: 写 `registry.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "mayumi",
  "homepage": "https://mayumi.netlify.app",
  "items": [
    {
      "name": "theme",
      "type": "registry:item",
      "title": "Mayumi Theme",
      "description": "Mac-style design tokens (dark-first).",
      "files": [
        {
          "path": "registry/mayumi/styles/theme.css",
          "type": "registry:file",
          "target": "~/app/mayumi-theme.css"
        }
      ]
    },
    {
      "name": "utils",
      "type": "registry:lib",
      "title": "cn utility",
      "dependencies": ["clsx", "tailwind-merge"],
      "files": [
        { "path": "registry/mayumi/lib/utils.ts", "type": "registry:lib" }
      ]
    },
    {
      "name": "motion",
      "type": "registry:lib",
      "title": "Spring presets",
      "dependencies": ["motion"],
      "files": [
        { "path": "registry/mayumi/lib/motion.ts", "type": "registry:lib" }
      ]
    },
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "dependencies": ["class-variance-authority"],
      "registryDependencies": [
        "https://mayumi.netlify.app/r/theme.json",
        "https://mayumi.netlify.app/r/utils.json"
      ],
      "files": [
        { "path": "registry/mayumi/ui/button.tsx", "type": "registry:ui" }
      ]
    }
  ]
}
```

- [ ] **Step 3: 更新 build 脚本**

`apps/www/package.json` scripts 改为：`"build": "shadcn build && next build"`，并安装 CLI：

```bash
pnpm --filter www add -D shadcn
```

- [ ] **Step 4: 构建 registry 并验证**

Run: `pnpm --filter www exec shadcn build`
Expected: 生成 `apps/www/public/r/{theme,utils,motion,button}.json`。若 schema 校验报错（`type`/`target` 字段与当前 CLI 版本有出入），以 `npx shadcn@latest build` 的报错信息为准修正 `registry.json` 后重跑——判定标准是 4 个 JSON 成功生成且 `button.json` 内含 `button.tsx` 的完整源码。

- [ ] **Step 5: 端到端冒烟（本地消费一次）**

```bash
cd $(mktemp -d) && pnpm create next-app@latest smoke --ts --app --tailwind --no-src-dir --import-alias "@/*" --use-pnpm --yes
cd smoke && npx shadcn@latest init --yes -d
npx shadcn@latest add /Volumes/ORICO/Users/jiangwei/projects/mayumi/apps/www/public/r/button.json
```

Expected: `components/ui/`（或 aliases 对应目录）出现 `button.tsx`，且 `theme`/`utils` 作为依赖一并落地、`clsx` 等 npm 依赖被安装。冒烟目录用完即弃。

- [ ] **Step 6: 验证整体构建**

Run: `pnpm --filter www build`
Expected: `shadcn build && next build` 全部成功。

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: shadcn registry pipeline with theme/utils/motion/button items"
```

---

### Task 8: Storybook 工作台

**Files:**
- Create: `apps/storybook/package.json`, `apps/storybook/.storybook/main.ts`, `apps/storybook/.storybook/preview.ts`, `apps/www/registry/mayumi/ui/button.stories.tsx`

**Interfaces:**
- Consumes: `apps/www/registry/**` 的组件与 `globals.css`。
- Produces: `pnpm storybook`（根脚本）启动工作台；stories 与组件同目录、命名 `<name>.stories.tsx`；`registry.json` 不引用 stories，因此不进分发。

- [ ] **Step 1: 手写 storybook app（不用交互式 init）**

```json
// apps/storybook/package.json
{
  "name": "storybook",
  "private": true,
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build"
  }
}
```

```bash
pnpm --filter storybook add -D storybook @storybook/react-vite react react-dom vite @tailwindcss/vite
```

- [ ] **Step 2: 写 `.storybook/main.ts`**

```ts
// apps/storybook/.storybook/main.ts
import path from "node:path"
import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../../www/registry/**/*.stories.@(ts|tsx)"],
  async viteFinal(viteConfig) {
    const tailwindcss = (await import("@tailwindcss/vite")).default
    viteConfig.plugins ??= []
    viteConfig.plugins.push(tailwindcss())
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = {
      ...viteConfig.resolve.alias,
      "@": path.resolve(__dirname, "../../www"),
    }
    return viteConfig
  },
}

export default config
```

- [ ] **Step 3: 写 `.storybook/preview.ts`（加载 tokens、暗/亮切换）**

```ts
// apps/storybook/.storybook/preview.ts
import type { Preview } from "@storybook/react-vite"

import "../../www/app/globals.css"

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Color scheme",
      toolbar: { icon: "mirror", items: ["dark", "light"], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: "dark" },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle(
        "dark",
        context.globals.theme !== "light"
      )
      document.body.classList.add("bg-background", "text-fg")
      return Story()
    },
  ],
}

export default preview
```

- [ ] **Step 4: 写 Button stories**

```tsx
// apps/www/registry/mayumi/ui/button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "ui/Button",
  component: Button,
  args: { children: "Button" },
}
export default meta

type Story = StoryObj<typeof Button>

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 p-6">
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} disabled>Disabled</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 p-6">
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
}
```

- [ ] **Step 5: 验证**

Run: `pnpm --filter storybook build`
Expected: `storybook-static` 构建成功。再 `pnpm storybook` 人工目检：Button 两组 stories 正常渲染，工具栏可切暗/亮。

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: storybook workbench with co-located stories"
```

---

### Task 9: Netlify 部署配置

**Files:**
- Rewrite: `netlify.toml`

**Interfaces:**
- Produces: Netlify 部署 `apps/www`（文档站 + `/r/*.json` registry 端点）。

- [ ] **Step 1: 重写 `netlify.toml`**

```toml
[build]
  base = "apps/www"
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/r/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

- [ ] **Step 2: 本地等价验证**

Run: `pnpm --filter www build`
Expected: 成功（Netlify 侧执行同一命令）。

- [ ] **Step 3: Commit + push 触发部署**

```bash
git add -A && git commit -m "chore: netlify deploys apps/www with registry endpoints"
```

Push 由维护者决定时机（推 `bigsur` 分支可先出 deploy preview）。部署后人工验证 `https://<preview>/r/button.json` 可访问。

---

## Self-Review 结果

- **Spec coverage**：本计划覆盖 spec 第 2 节（架构/分发/版本基线）、第 3 节（tokens/排版/动效基调）、第 5 节的 Storybook 与 Vitest 基建、第 6 节（清理）。组件清单（spec 第 4 节其余 23 个）与文档站页面（第 5 节）留给 Plan 2–4，属于有意的分批，不是缺口。
- **Placeholder scan**：无 TBD/TODO；Task 7 Step 4 的「以 CLI 报错为准修正」是对外部 schema 演进的显式兜底策略，附带了明确的完成判定标准。
- **Type consistency**：`cn` 签名（Task 4 定义，Task 6 消费）、`springs` 命名（Task 5 定义，后续 Plan 消费）、tokens 类名（Task 3 定义，Task 6/8 消费）已逐一核对一致。
