import { Tabs as BaseTabs } from "@base-ui/react/tabs"

import { cn } from "@/registry/mayumi/lib/utils"

function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      {...props}
      data-slot="segmented-control"
      className={cn("flex flex-col gap-2", className)}
    />
  )
}

function SegmentedControlList({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      {...props}
      data-slot="segmented-control-list"
      className={cn(
        "inline-flex h-7 items-center gap-0.5 rounded-control bg-surface-2 p-0.5",
        className
      )}
    />
  )
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      {...props}
      data-slot="segmented-control-item"
      className={cn(
        "inline-flex h-6 flex-1 items-center justify-center rounded-icon px-3 text-ui leading-tight text-fg-secondary outline-none transition-colors duration-150 ease-out select-none focus-visible:ring-2 focus-visible:ring-accent/60 data-active:bg-surface-raised data-active:text-fg data-active:shadow-sm disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

function SegmentedControlPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      {...props}
      data-slot="segmented-control-panel"
      className={cn("outline-none", className)}
    />
  )
}

export {
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList,
  SegmentedControlPanel,
}
