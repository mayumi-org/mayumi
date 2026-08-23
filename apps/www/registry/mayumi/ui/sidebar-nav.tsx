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

function SidebarNavItem({
  className,
  active = false,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      {...props}
      type="button"
      data-slot="sidebar-nav-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-7 w-full items-center gap-2 rounded-control px-2 text-left text-ui leading-tight select-none outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60",
        active
          ? "bg-accent text-accent-fg"
          : "text-fg hover:bg-surface-2/70 active:bg-surface-2",
        className
      )}
    />
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
