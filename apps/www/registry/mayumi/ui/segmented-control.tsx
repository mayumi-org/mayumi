import { Tabs as BaseTabs } from "@base-ui/react/tabs"
import { type VariantProps, cva } from "class-variance-authority"

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

const segmentedControlItemVariants = cva(
  "inline-flex h-6 items-center justify-center rounded-icon text-ui leading-tight text-fg-secondary outline-none transition-colors duration-150 ease-out select-none focus-visible:ring-2 focus-visible:ring-accent/60 data-active:text-fg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        /** 文字项：均分拉伸，选中是浮起的亮面 */
        md: "flex-1 px-3 data-active:bg-surface-raised data-active:shadow-sm",
        /** 图标项（标题栏/工具栏的视图切换）：定宽方块，选中垫深灰底 */
        icon: "w-6 flex-none px-0 data-active:bg-fill-active [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: { size: "md" },
  }
)

function SegmentedControlItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab> &
  VariantProps<typeof segmentedControlItemVariants>) {
  return (
    <BaseTabs.Tab
      {...props}
      data-slot="segmented-control-item"
      data-size={size ?? "md"}
      className={cn(segmentedControlItemVariants({ size, className }))}
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
  segmentedControlItemVariants,
}
