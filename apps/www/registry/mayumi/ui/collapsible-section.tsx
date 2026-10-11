import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible"
import { ChevronRight } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

function CollapsibleSection({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Root>) {
  return (
    <BaseCollapsible.Root
      {...props}
      data-slot="collapsible-section"
      className={cn("flex flex-col", className)}
    />
  )
}

/** 分组标题行。展开态由 Base UI 的 data-panel-open 驱动箭头旋转 */
function CollapsibleSectionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Trigger>) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      data-slot="collapsible-section-trigger"
      className={cn(
        "group flex h-7 w-full items-center gap-1 rounded-control px-1 text-left text-xs leading-tight text-fg-tertiary outline-none transition-colors duration-150 ease-out select-none hover:text-fg-secondary focus-visible:ring-2 focus-visible:ring-accent/60",
        className
      )}
    >
      <ChevronRight
        aria-hidden="true"
        className="size-3 shrink-0 group-data-panel-open:rotate-90 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
      />
      {children}
    </BaseCollapsible.Trigger>
  )
}

/**
 * 展开高度来自 Base UI 的 --collapsible-panel-height。
 * 高度变化是运动，走 motion-safe 门控。
 */
function CollapsibleSectionPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseCollapsible.Panel>) {
  return (
    <BaseCollapsible.Panel
      {...props}
      data-slot="collapsible-section-panel"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden data-ending-style:h-0 data-starting-style:h-0 motion-safe:transition-[height] motion-safe:duration-200 motion-safe:ease-out",
        className
      )}
    />
  )
}

export {
  CollapsibleSection,
  CollapsibleSectionPanel,
  CollapsibleSectionTrigger,
}
