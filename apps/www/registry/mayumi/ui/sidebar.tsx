"use client"

import { type VariantProps, cva } from "class-variance-authority"
import type { HTMLMotionProps } from "motion/react"
import { motion, useReducedMotion } from "motion/react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

const sidebarVariants = cva("flex shrink-0 flex-col overflow-hidden", {
  variants: {
    /**
     * default：通栏贴边 + 右边框（Ventura 设置风格）
     * floating：悬浮岛式，圆角独立面板、与窗口边缘留距（Tahoe 风格）
     * plain：透明融入窗口背景（Linear 风格——内容区作岛时用）
     */
    variant: {
      default:
        "mayumi-vibrancy h-full border-r border-border data-collapsed:border-r-0",
      floating:
        "mayumi-vibrancy m-2 h-auto self-stretch rounded-card border border-border shadow-[var(--shadow-raised)] data-collapsed:mx-0 data-collapsed:border-0 data-collapsed:shadow-none",
      plain: "h-full bg-transparent",
    },
  },
  defaultVariants: { variant: "default" },
})

type SidebarProps = Omit<HTMLMotionProps<"aside">, "children"> &
  VariantProps<typeof sidebarVariants> & {
    collapsed?: boolean
    width?: number
    children?: React.ReactNode
  }

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
      data-variant={variant ?? "default"}
      aria-hidden={collapsed || undefined}
      inert={collapsed || undefined}
      initial={false}
      // 减少动态效果时把「宽度滑移」换成淡入淡出（Apple 的降级方式是替换运动，不是取消反馈）：
      // 收起先淡出再瞬时收宽，展开先瞬时展宽再淡入。
      animate={
        reduce
          ? { width: collapsed ? 0 : width, opacity: collapsed ? 0 : 1 }
          : { width: collapsed ? 0 : width, opacity: 1 }
      }
      transition={
        reduce
          ? {
              width: { duration: 0, delay: collapsed ? 0.15 : 0 },
              opacity: { duration: 0.15, ease: "linear" },
            }
          : springs.smooth
      }
      className={cn(sidebarVariants({ variant, className }))}
    >
      <div style={{ width }} className="flex min-h-0 flex-1 flex-col gap-2 p-2">
        {children}
      </div>
    </motion.aside>
  )
}

export { Sidebar, sidebarVariants }
