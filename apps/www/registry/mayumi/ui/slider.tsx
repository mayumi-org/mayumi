import { Slider as BaseSlider } from "@base-ui/react/slider"

import { cn } from "@/registry/mayumi/lib/utils"

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root {...props} data-slot="slider" className={cn("w-full", className)}>
      <BaseSlider.Control className="flex h-4 w-full touch-none items-center select-none">
        <BaseSlider.Track className="relative h-1 w-full rounded-full bg-surface-2">
          <BaseSlider.Indicator className="rounded-full bg-accent" />
          <BaseSlider.Thumb
            data-slot="slider-thumb"
            className="size-4 rounded-full border border-border bg-accent-fg shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export { Slider }
