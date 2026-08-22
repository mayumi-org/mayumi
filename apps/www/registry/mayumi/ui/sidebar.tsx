"use client"

import type { HTMLMotionProps } from "motion/react"
import { motion, useReducedMotion } from "motion/react"

import { springs } from "@/registry/mayumi/lib/motion"
import { cn } from "@/registry/mayumi/lib/utils"

type SidebarProps = Omit<HTMLMotionProps<"aside">, "children"> & {
  collapsed?: boolean
  width?: number
  children?: React.ReactNode
}

function Sidebar({
  collapsed = false,
  width = 240,
  className,
  children,
  ...props
}: SidebarProps) {
  const reduce = useReducedMotion()
  return (
    <motion.aside
      data-slot="sidebar"
      data-collapsed={collapsed || undefined}
      aria-hidden={collapsed || undefined}
      inert={collapsed || undefined}
      initial={false}
      animate={{ width: collapsed ? 0 : width }}
      transition={reduce ? { duration: 0 } : springs.smooth}
      className={cn(
        "mayumi-vibrancy flex h-full shrink-0 flex-col overflow-hidden border-r border-border",
        className
      )}
      {...props}
    >
      <div style={{ width }} className="flex min-h-0 flex-1 flex-col gap-2 p-2">
        {children}
      </div>
    </motion.aside>
  )
}

export { Sidebar }
