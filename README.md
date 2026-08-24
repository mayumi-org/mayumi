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
