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
        <DocsNav
          entries={docs.map(({ slug, title, description, group, notes }) => ({
            slug,
            title,
            description,
            group,
            notes,
          }))}
        />
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
