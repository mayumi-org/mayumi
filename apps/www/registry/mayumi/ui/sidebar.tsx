"use client"

import type { HTMLMotionProps } from "motion/react"
import { motion, useReducedMotion } from "motion/react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

type SidebarProps = Omit<HTMLMotionProps<"aside">, "children"> & {
  collapsed?: boolean
  width?: number
  /** 悬浮岛式（macOS Tahoe 风格）：四角圆角、与窗口边缘留距的独立面板 */
  floating?: boolean
  children?: React.ReactNode
}

function Sidebar({
  collapsed = false,
  width = 240,
  floating = false,
  className,
  children,
  ...props
}: SidebarProps) {
  const reduce = useReducedMotion()
  return (
    <motion.aside
      {...props}
      data-slot="sidebar"
      data-collapsed={collapsed || undefined}
      data-floating={floating || undefined}
      aria-hidden={collapsed || undefined}
      inert={collapsed || undefined}
      initial={false}
      animate={{ width: collapsed ? 0 : width }}
      transition={reduce ? { duration: 0 } : springs.smooth}
      className={cn(
        "mayumi-vibrancy flex shrink-0 flex-col overflow-hidden",
        floating
          ? "m-2 h-auto self-stretch rounded-card border border-border data-collapsed:mx-0 data-collapsed:border-0"
          : "h-full border-r border-border data-collapsed:border-r-0",
        className
      )}
    >
      <div style={{ width }} className="flex min-h-0 flex-1 flex-col gap-2 p-2">
        {children}
      </div>
    </motion.aside>
  )
}

export { Sidebar }
