"use client"

import type { HTMLMotionProps } from "motion/react"
import { motion, useReducedMotion } from "motion/react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

type SidebarProps = Omit<HTMLMotionProps<"aside">, "children"> & {
  collapsed?: boolean
  width?: number
  /**
   * default：通栏贴边 + 右边框（Ventura 设置风格）
   * floating：悬浮岛式，圆角独立面板、与窗口边缘留距（Tahoe 风格）
   * plain：透明融入窗口背景，无材质无边框（Linear 风格——内容区作岛时用）
   */
  variant?: "default" | "floating" | "plain"
  children?: React.ReactNode
}

const variantClasses = {
  default:
    "mayumi-vibrancy h-full border-r border-border data-collapsed:border-r-0",
  floating:
    "mayumi-vibrancy m-2 h-auto self-stretch rounded-card border border-border data-collapsed:mx-0 data-collapsed:border-0",
  plain: "h-full bg-transparent",
} as const

function Sidebar({
  collapsed = false,
  width = 240,
  variant = "default",
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
      data-variant={variant}
      aria-hidden={collapsed || undefined}
      inert={collapsed || undefined}
      initial={false}
      animate={{ width: collapsed ? 0 : width }}
      transition={reduce ? { duration: 0 } : springs.smooth}
      className={cn(
        "flex shrink-0 flex-col overflow-hidden",
        variantClasses[variant],
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
