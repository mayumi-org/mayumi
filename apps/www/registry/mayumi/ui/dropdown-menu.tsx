import { Menu as BaseMenu } from "@base-ui-components/react/menu"

import { cn } from "@/registry/mayumi/lib/utils"

const DropdownMenu = BaseMenu.Root

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return (
    <BaseMenu.Trigger
      {...props}
      data-slot="dropdown-menu-trigger"
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-control border border-border bg-surface-2 px-3 text-ui font-medium text-fg shadow-[inset_0_1px_0_0_var(--highlight)] outline-none transition-colors duration-150 ease-out select-none hover:bg-surface-2/70 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

function DropdownMenuContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup>) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4}>
        <BaseMenu.Popup
          {...props}
          data-slot="dropdown-menu-content"
          className={cn(
            "mayumi-vibrancy origin-(--transform-origin) min-w-36 rounded-card border border-border p-1 shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-200 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95",
            className
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      {...props}
      data-slot="dropdown-menu-item"
      className={cn(
        "flex h-6 cursor-default items-center gap-2 rounded-icon px-2 text-ui leading-tight text-fg outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-fg",
        className
      )}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      {...props}
      data-slot="dropdown-menu-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
