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
          <BaseSlider.Indicator data-slot="slider-indicator" className="rounded-full bg-accent" />
          <BaseSlider.Thumb
            data-slot="slider-thumb"
            className="size-4 rounded-full border border-border bg-accent-fg shadow-sm outline-none transition-[scale] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 motion-safe:data-dragging:scale-125 motion-reduce:data-dragging:scale-105 motion-safe:[@media(hover:hover)_and_(pointer:fine)]:hover:scale-110 motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:hover:scale-105"
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

export { Slider }
