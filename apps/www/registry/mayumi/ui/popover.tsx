import { Popover as BasePopover } from "@base-ui/react/popover"

import { cn } from "@/registry/mayumi/lib/utils"

const Popover = BasePopover.Root

function PopoverTrigger({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Trigger>) {
  return (
    <BasePopover.Trigger
      {...props}
      data-slot="popover-trigger"
      className={cn(className)}
    />
  )
}

type PopoverContentProps = React.ComponentProps<typeof BasePopover.Popup> &
  Pick<
    React.ComponentProps<typeof BasePopover.Positioner>,
    "side" | "align" | "sideOffset"
  >

function PopoverContent({
  className,
  side,
  align,
  sideOffset = 4,
  children,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BasePopover.Popup
          {...props}
          data-slot="popover-content"
          className={cn(
            "mayumi-vibrancy-thick origin-(--transform-origin) w-56 rounded-card border border-border p-3 text-ui text-fg shadow-[var(--shadow-overlay)] outline-none transition-[scale,opacity] duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
            className
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

function PopoverClose({
  className,
  ...props
}: React.ComponentProps<typeof BasePopover.Close>) {
  return (
    <BasePopover.Close
      {...props}
      data-slot="popover-close"
      className={cn(className)}
    />
  )
}

export { Popover, PopoverClose, PopoverContent, PopoverTrigger }
