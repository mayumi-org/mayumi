import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area"

import { cn } from "@/registry/mayumi/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseScrollArea.Root>) {
  return (
    <BaseScrollArea.Root
      {...props}
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
    >
      <BaseScrollArea.Viewport className="size-full overscroll-contain">
        {children}
      </BaseScrollArea.Viewport>
      <BaseScrollArea.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex w-2 justify-center py-0.5 opacity-0 transition-opacity duration-150 ease-out data-hovering:opacity-100 data-scrolling:opacity-100"
      >
        <BaseScrollArea.Thumb className="w-1 rounded-full bg-fg-tertiary/60" />
      </BaseScrollArea.Scrollbar>
    </BaseScrollArea.Root>
  )
}

export { ScrollArea }
