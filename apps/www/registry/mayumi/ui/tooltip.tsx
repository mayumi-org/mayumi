import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"

import { cn } from "@/registry/mayumi/lib/utils"

const TooltipProvider = BaseTooltip.Provider
const Tooltip = BaseTooltip.Root
const TooltipTrigger = BaseTooltip.Trigger

type TooltipContentProps = React.ComponentProps<typeof BaseTooltip.Popup> &
  Pick<
    React.ComponentProps<typeof BaseTooltip.Positioner>,
    "side" | "align" | "sideOffset"
  > & { arrow?: boolean }

function TooltipContent({
  className,
  side,
  align,
  sideOffset = 7,
  arrow = true,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset}>
        <BaseTooltip.Popup
          {...props}
          data-slot="tooltip-content"
          className={cn(
            "origin-(--transform-origin) rounded-full border border-border bg-surface px-3 py-1.5 text-xs leading-tight text-fg shadow-[var(--shadow-overlay)] transition-[scale,opacity] duration-[125ms] ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 motion-safe:data-ending-style:scale-97 motion-safe:data-starting-style:scale-97",
            className
          )}
        >
          {arrow ? (
            <BaseTooltip.Arrow
              data-slot="tooltip-arrow"
              className="flex size-2.5 data-[side=bottom]:-top-[5px] data-[side=bottom]:rotate-180 data-[side=left]:-right-[5px] data-[side=left]:-rotate-90 data-[side=right]:-left-[5px] data-[side=right]:rotate-90 data-[side=top]:-bottom-[5px]"
            >
              {/* 半嵌入菱形：上半嵌进胶囊盖住其边框，露出的下尖与胶囊描边连续 */}
              <div className="size-2.5 rotate-45 rounded-[2px] border-r border-b border-border bg-surface" />
            </BaseTooltip.Arrow>
          ) : null}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
