"use client"

import { PanelLeft, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import type { DocMeta } from "@/lib/docs-meta"
import { DocsNav } from "@/components/docs-nav"
import { cn } from "@/registry/mayumi/lib/utils"

/**
 * 移动端文档导航：顶部栏的菜单按钮 + 左侧滑出抽屉。
 * 常驻挂载、transform 驱动开关，避免挂载抖动；路由变化自动关闭。
 */
export function MobileDocsNav({ entries }: { entries: DocMeta[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // 路由变化自动关闭抽屉（渲染期调整 state，避免 effect 级联渲染）
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  // 抽屉打开时锁死页面滚动
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="打开组件导航"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex size-8 items-center justify-center rounded-control text-fg-secondary transition-colors hover:bg-fill-hover hover:text-fg"
      >
        <PanelLeft aria-hidden="true" className="size-4" />
      </button>

      {/* 抽屉：常驻挂载，关态移出视口并禁用指针/焦点 */}
      <div
        className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-scrim transition-opacity duration-200 ease-out",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col gap-3 border-r border-border bg-surface p-4 transition-transform duration-250 ease-out",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-1">
            <Link href="/" className="text-ui font-semibold text-fg">
              mayumi
            </Link>
            <button
              type="button"
              aria-label="关闭组件导航"
              onClick={() => setOpen(false)}
              className="flex size-8 items-center justify-center rounded-control text-fg-secondary transition-colors hover:bg-fill-hover hover:text-fg"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
          <DocsNav entries={entries} />
        </div>
      </div>
    </div>
  )
}
