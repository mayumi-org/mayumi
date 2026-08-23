import { Select as BaseSelect } from "@base-ui/react/select"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

const Select = BaseSelect.Root
const SelectValue = BaseSelect.Value

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>) {
  return (
    <BaseSelect.Trigger
      {...props}
      data-slot="select-trigger"
      className={cn(
        "inline-flex h-7 min-w-24 items-center justify-between gap-2 rounded-control border border-border bg-surface-2 px-2 text-ui text-fg shadow-[inset_0_1px_0_0_var(--highlight)] outline-none transition-colors duration-150 ease-out select-none hover:bg-surface-2/70 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
      <BaseSelect.Icon className="flex text-fg-tertiary">
        <ChevronsUpDown aria-hidden="true" className="size-3" strokeWidth={2} />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

type SelectContentProps = React.ComponentProps<typeof BaseSelect.Popup> &
  Pick<
    React.ComponentProps<typeof BaseSelect.Positioner>,
    "side" | "align" | "sideOffset"
  >

function SelectContent({
  className,
  side,
  align,
  sideOffset = 4,
  children,
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseSelect.Popup
          {...props}
          data-slot="select-content"
          className={cn(
            "mayumi-vibrancy origin-(--transform-origin) min-w-24 rounded-card border border-border p-1 shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-200 ease-out outline-none data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-95 motion-safe:data-starting-style:scale-95",
            className
          )}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      {...props}
      data-slot="select-item"
      className={cn(
        "grid cursor-default grid-cols-[1rem_1fr] items-center gap-1 rounded-icon py-1 pr-2 text-ui leading-tight text-fg outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-fg",
        className
      )}
    >
      <BaseSelect.ItemIndicator className="col-start-1 flex justify-center">
        <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
