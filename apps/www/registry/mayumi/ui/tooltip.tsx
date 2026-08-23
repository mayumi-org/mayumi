import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"

import { cn } from "@/registry/mayumi/lib/utils"

const TooltipProvider = BaseTooltip.Provider
const Tooltip = BaseTooltip.Root
const TooltipTrigger = BaseTooltip.Trigger

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Popup> & { sideOffset?: number }) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner sideOffset={sideOffset}>
        <BaseTooltip.Popup
          {...props}
          data-slot="tooltip-content"
          className={cn(
            "origin-(--transform-origin) rounded-control border border-border bg-surface px-2 py-1 text-xs leading-tight text-fg shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-[125ms] ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
            className
          )}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
