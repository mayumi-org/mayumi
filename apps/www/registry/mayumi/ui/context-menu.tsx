import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu"

import { cn } from "@/registry/mayumi/lib/utils"

const ContextMenu = BaseContextMenu.Root

function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Trigger>) {
  return (
    <BaseContextMenu.Trigger
      {...props}
      data-slot="context-menu-trigger"
      className={cn(className)}
    />
  )
}

type ContextMenuContentProps = React.ComponentProps<typeof BaseContextMenu.Popup> &
  Pick<
    React.ComponentProps<typeof BaseContextMenu.Positioner>,
    "side" | "align" | "sideOffset"
  >

function ContextMenuContent({
  className,
  side,
  align,
  sideOffset = 4,
  children,
  ...props
}: ContextMenuContentProps) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseContextMenu.Popup
          {...props}
          data-slot="context-menu-content"
          className={cn(
            "mayumi-vibrancy-thick origin-(--transform-origin) min-w-36 rounded-card border border-border p-1 shadow-[var(--shadow-overlay)] outline-none transition-[scale,opacity] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95",
            className
          )}
        >
          {children}
        </BaseContextMenu.Popup>
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  )
}

function ContextMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Item>) {
  return (
    <BaseContextMenu.Item
      {...props}
      data-slot="context-menu-item"
      className={cn(
        "flex h-6 cursor-default items-center gap-2 rounded-icon px-2 text-ui leading-tight text-fg outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-fg",
        className
      )}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseContextMenu.Separator>) {
  return (
    <BaseContextMenu.Separator
      {...props}
      data-slot="context-menu-separator"
      className={cn("mx-2 my-1 h-px bg-border", className)}
    />
  )
}

export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
}
