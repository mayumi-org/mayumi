import Link from "next/link"

import { DocsNav } from "@/components/docs-nav"
import { MobileDocsNav } from "@/components/mobile-docs-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { docsMeta } from "@/lib/docs-meta"
import { Kbd } from "@/registry/mayumi/ui/kbd"
import { Sidebar } from "@/registry/mayumi/ui/sidebar"

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-dvh">
      <Sidebar width={240} className="hidden h-full md:flex">
        <div className="flex items-center justify-between px-1 pt-1">
          <Link href="/" className="text-ui font-semibold text-fg">
            mayumi
          </Link>
          <ThemeToggle />
        </div>
        <DocsNav entries={docsMeta} />
        <p className="flex items-center gap-1 px-1 text-xs text-fg-tertiary">
          随处可按 <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </p>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 移动端顶部栏：菜单抽屉 + 标题 + 主题切换 */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4 md:hidden">
          <MobileDocsNav entries={docsMeta} />
          <Link href="/" className="text-ui font-semibold text-fg">
            mayumi
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
