# Mayumi v2 — Mac-style shadcn Registry 设计文档

日期：2026-08-22
状态：已与维护者确认

## 1. 目标与定位

将 mayumi 从传统 npm 组件库（stitches + rollup）推倒重建为一个 **shadcn 第三方 registry**：mac-style 的 React 组件集，让用户快速搭建 Raycast / Linear 质感的桌面应用 UI（主要目标环境为 Tauri / Electron）。

风格定位：**不是像素级复刻 macOS 原生控件**，而是 "mac-style" 的现代桌面质感——暗色优先、细腻的半透明边框与内侧高光、克制的毛玻璃、紧凑排版、键盘驱动交互。对外描述为 "Mac-style React components for building desktop-grade app UIs (Raycast / Linear aesthetic)"。

旧代码全部删除（git 历史保留），npm 上的 `mayumi@0.0.4` 保持原样、不再更新、不发 deprecation。新版本只存在于 registry + 文档站。

## 2. 架构与分发

pnpm monorepo：

```
mayumi/
├── apps/
│   ├── www/                    # 文档站 + registry 宿主（Next.js）
│   │   ├── registry/
│   │   │   └── mayumi/
│   │   │       ├── ui/         # 组件源码（single source of truth，stories 同目录）
│   │   │       ├── lib/        # utils.ts (cn)、motion.ts (spring 预设)
│   │   │       └── styles/     # theme.css（全部 design tokens）
│   │   ├── registry.json       # registry 清单（每项声明 npm 依赖与文件）
│   │   ├── app/                # 文档页面 + demo
│   │   └── public/r/           # `shadcn build` 输出的静态 JSON
│   └── storybook/              # Storybook 开发工作台（不对外部署）
└── packages/                   # 暂空，未来需要时再加
```

- **分发**：`shadcn build` 将 `registry.json` + 源码编译为 `public/r/*.json`，随文档站部署到 Netlify（沿用 mayumi.netlify.app）。用户在 `components.json` 配置 `"registries": { "@mayumi": "https://mayumi.netlify.app/r/{name}.json" }` 后 `npx shadcn add @mayumi/button`。零服务端。
- **技术基线**：React 19、Tailwind CSS v4（CSS-first，`@theme` 定义 tokens）、Base UI primitives、motion、TypeScript 全量。
- **Netlify 构建**：`shadcn build && next build`。

## 3. 设计系统（tokens）

全部 tokens 以 CSS variables 定义于 `styles/theme.css`，dark-first，亮色模式同等支持（文档站用 next-themes 切换）。

- **色彩**：近黑但非纯黑的背景层级（base 约 `#0a0a0c`，elevated surface 逐层提亮）；低饱和强调色；文字用带透明度的白（90% / 60% / 40% 三级）而非实色灰。
- **边框与辉光**：1px 半透明白边（约 white/8）+ 顶部内侧高光（inset highlight），弹层与卡片带柔和大半径阴影。
- **毛玻璃 (vibrancy)**：`backdrop-blur` + 半透明背景，仅用于弹层（Dialog、DropdownMenu、Command、Toast）与 Sidebar，内容区不使用。
- **圆角**：窗口 12–16px、卡片 8–10px、控件 6px。
- **排版**：`--font-sans: Inter, -apple-system, system-ui, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`。Inter 覆盖拉丁字符（Raycast/Linear 质感），中文自动 fallback 到苹方/雅黑，与 macOS 原生混排逻辑一致；未安装 Inter 时降级到系统字体（Mac 上即 SF Pro）。正文 13–14px 桌面密度。
- **动效基调**：motion 的 spring 预设统一定义在 `lib/motion.ts`（`snappy` 弹层 / `smooth` 布局 / `gentle` hover），全库组件从同一处 import。简单 hover/fade 用纯 CSS 过渡，不引入 motion。

## 4. 组件清单（v1，共 24 个）

源码约定：cva 管理 variants、`cn()`（clsx + tailwind-merge）合并类名、`data-slot` 属性、React 19（无需 forwardRef）。交互组件基于 Base UI primitives（键盘导航与 ARIA 由其提供）。

**窗口层**

| 组件 | 说明 |
| --- | --- |
| `Window` | 圆角窗口容器、vibrancy 背景，无边框窗口根元素 |
| `TitleBar` | 拖拽区（`data-tauri-drag-region` / `-webkit-app-region`）+ 红绿灯插槽 |
| `TrafficLights` | 双模式：自绘（`onClose/onMinimize/onMaximize` 回调）与原生占位（仅预留 inset 空间）。不依赖 Tauri/Electron API，文档提供两平台接线示例 |
| `Toolbar` | 标题栏工具条：导航按钮、标题、右侧 actions |
| `Sidebar` | 侧边栏容器，半透明材质，可收合（motion spring） |

**列表层**：`SidebarNav` + `SidebarNavItem`（彩色圆角图标导航）、`GroupedList` + `GroupedListItem`（圆角分组列表，icon/label/value/chevron 插槽）、`SearchField`。

**基础控件**（Base UI + mac 皮肤）：`Button`、`Input`、`Switch`、`Checkbox`、`Slider`、`Select`、`SegmentedControl`、`Tooltip`、`DropdownMenu`、`Dialog`、`ScrollArea`（悬浮细滚动条）、`Kbd`。

**重交互组件**：`Command`（cmdk，Raycast 式 ⌘K 面板）、`Toast`（sonner，右上角滑入通知卡片）。

**共享基建**（同样经 registry 分发）：`lib/utils.ts`、`lib/motion.ts`、`styles/theme.css`。每个组件在 `registry.json` 中声明自身 npm 依赖（base-ui、motion、sonner、cmdk 等），`shadcn add` 时自动安装。

依赖选型（按 pick-ui-library 清单核定）：Base UI（primitives）、cmdk、Sonner、motion、cva、clsx、next-themes（仅文档站）。

## 5. 文档站与测试

- **文档站**：每组件一页——live demo + 源码 + 安装命令；首页放完整的「macOS 设置 app」复刻 demo，作为招牌与集成验收。文档站本身用这套组件搭建（dogfooding）。
- **Storybook**：`apps/storybook` 作为开发工作台，每个组件配 stories（与组件源码同目录，如 `button.stories.tsx`；`registry.json` 显式列出分发文件，stories 不会进入 registry 输出）。用于开发期隔离调试、variants 全量视觉验收与暗/亮双主题预览；仅本地/CI 使用，不对外部署。
- **测试**：Vitest + Testing Library，仅覆盖有行为逻辑的组件（TrafficLights 回调、Command 键盘导航、Sidebar 收合等）；纯视觉组件靠 Storybook 与文档站 demo 人工验收。
- **可访问性与降级**：交互行为来自 Base UI；动画尊重 `prefers-reduced-motion`（motion 内建）。

## 6. 收尾清理

删除旧的 `components/`、`example/`、`apps/`（旧文档站）、rollup 与 jest 配置、根 package.json 中的构建/发布脚本；保留 LICENSE 与 git 历史；重写 README；Netlify 配置指向新构建。
