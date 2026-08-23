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
    glyph: <path d="M2 2l4 4M6 2L2 6" />,
  },
  {
    key: "minimize",
    label: "Minimize window",
    dot: "bg-traffic-minimize",
    glyph: <path d="M1.5 4h5" />,
  },
  {
    key: "zoom",
    label: "Zoom window",
    dot: "bg-traffic-zoom",
    glyph: <path d="M4 1.5v5M1.5 4h5" />,
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
      data-slot="traffic-lights"
      className={cn(
        "group/traffic app-region-no-drag flex shrink-0 items-center gap-2",
        className
      )}
      {...props}
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
          <svg
            aria-hidden="true"
            viewBox="0 0 8 8"
            className="size-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            {light.glyph}
          </svg>
        </button>
      ))}
    </div>
  )
}

export { TrafficLights }
