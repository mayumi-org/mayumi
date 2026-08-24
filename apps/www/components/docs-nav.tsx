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

// entries 是 Server Component 传给 Client Component 的 props：DocEntry.Demo 是函数，
// RSC 边界不允许直接传函数，这里裁剪成可序列化的子集（调用方负责剔除 Demo）。
type DocsNavEntry = Omit<DocEntry, "Demo">

export function DocsNav({ entries }: { entries: DocsNavEntry[] }) {
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
