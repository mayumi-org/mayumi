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
              className="flex data-[side=bottom]:top-[-6px] data-[side=bottom]:rotate-180 data-[side=left]:right-[-10px] data-[side=left]:-rotate-90 data-[side=right]:left-[-10px] data-[side=right]:rotate-90 data-[side=top]:bottom-[-6px]"
            >
              <svg
                aria-hidden="true"
                width="14"
                height="6"
                viewBox="0 0 14 6"
                fill="none"
              >
                <path
                  d="M0 0h14L8.06 5.35a1.6 1.6 0 0 1-2.12 0L0 0Z"
                  className="fill-surface"
                />
                <path
                  d="M0.5 0.5 5.94 5.35a1.6 1.6 0 0 0 2.12 0L13.5 0.5"
                  className="stroke-border"
                  strokeLinecap="round"
                />
              </svg>
            </BaseTooltip.Arrow>
          ) : null}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
