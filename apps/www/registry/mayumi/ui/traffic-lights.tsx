import { Minus, Plus, X } from "lucide-react"

import { cn } from "@/registry/mayumi/lib/utils"

type TrafficLightsProps = React.ComponentProps<"div"> & {
  mode?: "controls" | "inset"
  onClose?: () => void
  onMinimize?: () => void
  onZoom?: () => void
}

const lights = [
  {
    key: "close",
    label: "Close window",
    dot: "bg-traffic-close",
    glyph: X,
  },
  {
    key: "minimize",
    label: "Minimize window",
    dot: "bg-traffic-minimize",
    glyph: Minus,
  },
  {
    key: "zoom",
    label: "Zoom window",
    dot: "bg-traffic-zoom",
    glyph: Plus,
  },
] as const

function TrafficLights({
  mode = "controls",
  onClose,
  onMinimize,
  onZoom,
  className,
  ...props
}: TrafficLightsProps) {
  if (mode === "inset") {
    return (
      <div
        {...props}
        data-slot="traffic-lights"
        aria-hidden="true"
        className={cn("w-[52px] shrink-0", className)}
      />
    )
  }
  const handlers = { close: onClose, minimize: onMinimize, zoom: onZoom }
  return (
    <div
      {...props}
      data-slot="traffic-lights"
      className={cn(
        "group/traffic app-region-no-drag flex shrink-0 items-center gap-2",
        className
      )}
    >
      {lights.map((light) => (
        <button
          key={light.key}
          type="button"
          aria-label={light.label}
          onClick={handlers[light.key]}
          className={cn(
            "flex size-3 items-center justify-center rounded-full text-transparent outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 group-hover/traffic:text-(--traffic-glyph)",
            light.dot
          )}
        >
          <light.glyph aria-hidden="true" className="size-2" strokeWidth={3} />
        </button>
      ))}
    </div>
  )
}

export { TrafficLights }
