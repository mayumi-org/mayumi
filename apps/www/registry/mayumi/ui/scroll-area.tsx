import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area"

import { cn } from "@/registry/mayumi/lib/utils"

type RawViewportProps = React.ComponentProps<typeof BaseScrollArea.Viewport> & {
  [key: `data-${string}`]: unknown
}

export interface ScrollAreaProps
  extends React.ComponentProps<typeof BaseScrollArea.Root> {
  orientation?: "vertical" | "horizontal" | "both"
  hideScrollbar?: boolean
  viewportRef?: RawViewportProps["ref"]
  viewportProps?: Omit<RawViewportProps, "ref">
}

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  hideScrollbar = false,
  viewportRef,
  viewportProps,
  ...props
}: ScrollAreaProps) {
  const showVertical =
    !hideScrollbar && (orientation === "vertical" || orientation === "both")
  const showHorizontal =
    !hideScrollbar && (orientation === "horizontal" || orientation === "both")
  const { className: viewportClassName, ...restViewportProps } =
    viewportProps ?? {}

  return (
    <BaseScrollArea.Root
      {...props}
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
    >
      <BaseScrollArea.Viewport
        {...restViewportProps}
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          viewportClassName
        )}
      >
        {children}
      </BaseScrollArea.Viewport>
      {showVertical && (
        <BaseScrollArea.Scrollbar
          data-slot="scroll-area-scrollbar"
          orientation="vertical"
          className="flex w-2 justify-center py-0.5 opacity-0 transition-opacity duration-150 ease-out data-hovering:opacity-100 data-scrolling:opacity-100"
        >
          <BaseScrollArea.Thumb className="w-1 rounded-full bg-fg-tertiary/60" />
        </BaseScrollArea.Scrollbar>
      )}
      {showHorizontal && (
        <BaseScrollArea.Scrollbar
          data-slot="scroll-area-scrollbar"
          orientation="horizontal"
          className="flex h-2 items-center px-0.5 opacity-0 transition-opacity duration-150 ease-out data-hovering:opacity-100 data-scrolling:opacity-100"
        >
          <BaseScrollArea.Thumb className="h-1 rounded-full bg-fg-tertiary/60" />
        </BaseScrollArea.Scrollbar>
      )}
    </BaseScrollArea.Root>
  )
}

export { ScrollArea }
