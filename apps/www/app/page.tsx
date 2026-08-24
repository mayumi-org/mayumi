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
