import { Tabs as BaseTabs } from "@base-ui/react/tabs"

import { cn } from "@/registry/mayumi/lib/utils"

function Tabs({ className, ...props }: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      {...props}
      data-slot="tabs"
      className={cn("flex flex-col gap-3", className)}
    />
  )
}

function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      {...props}
      data-slot="tabs-list"
      className={cn(
        "relative flex items-center gap-4 border-b border-border",
        className
      )}
    >
      {children}
      <TabsIndicator />
    </BaseTabs.List>
  )
}

/**
 * 下划线指示条。位置来自 Base UI 暴露的 --active-tab-left/width，
 * 滑动本身是运动，走 motion-safe 门控——减少动态效果时直接落到新位置。
 */
function TabsIndicator({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Indicator>) {
  return (
    <BaseTabs.Indicator
      {...props}
      data-slot="tabs-indicator"
      className={cn(
        "absolute bottom-0 left-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full bg-accent motion-safe:transition-[translate,width] motion-safe:duration-200 motion-safe:ease-out",
        className
      )}
    />
  )
}

function TabsTab({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      {...props}
      data-slot="tabs-tab"
      className={cn(
        "-mb-px inline-flex h-8 items-center gap-1.5 border-b-2 border-transparent px-0.5 text-ui leading-tight text-fg-secondary outline-none transition-colors duration-150 ease-out select-none hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/60 data-active:text-fg disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
    />
  )
}

function TabsPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      {...props}
      data-slot="tabs-panel"
      className={cn("outline-none", className)}
    />
  )
}

export { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab }
