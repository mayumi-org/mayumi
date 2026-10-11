import { cn } from "@/registry/mayumi/lib/utils"

function SidebarNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      {...props}
      data-slot="sidebar-nav"
      className={cn("flex flex-col gap-0.5", className)}
    />
  )
}

type SidebarNavItemProps = React.ComponentProps<"button"> & {
  active?: boolean
  /** accent：系统设置式蓝底选中；neutral：Finder / Codex 式灰底选中 */
  variant?: "accent" | "neutral"
  /** 贴右对齐的计数、状态图标、快捷键 */
  trailing?: React.ReactNode
}

function SidebarNavItem({
  className,
  active = false,
  variant = "accent",
  trailing,
  children,
  ...props
}: SidebarNavItemProps) {
  const accentActive = active && variant === "accent"
  return (
    <button
      {...props}
      type="button"
      data-slot="sidebar-nav-item"
      data-active={active || undefined}
      data-variant={variant}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-7 w-full min-w-0 items-center gap-2 rounded-control px-2 text-left text-ui leading-tight select-none outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60",
        accentActive
          ? "bg-accent text-accent-fg"
          : active
            ? "bg-fill-active text-fg"
            : "text-fg hover:bg-fill-hover active:bg-fill-active",
        className
      )}
    >
      {children}
      {trailing != null ? (
        <span
          data-slot="sidebar-nav-trailing"
          className={cn(
            "ml-auto flex shrink-0 items-center gap-1 pl-2 text-xs tabular-nums [&_svg]:size-3",
            accentActive ? "text-accent-fg/80" : "text-fg-tertiary"
          )}
        >
          {trailing}
        </span>
      ) : null}
    </button>
  )
}

function SidebarNavIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      data-slot="sidebar-nav-icon"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-icon bg-accent text-accent-fg [&_svg]:size-3.5",
        className
      )}
    />
  )
}

export { SidebarNav, SidebarNavIcon, SidebarNavItem }
