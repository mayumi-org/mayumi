import { Switch as BaseSwitch } from "@base-ui/react/switch"

import { cn } from "@/registry/mayumi/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root>) {
  return (
    <BaseSwitch.Root
      {...props}
      data-slot="switch"
      className={cn(
        "inline-flex h-4 w-7 shrink-0 items-center rounded-full border border-border bg-surface-2 p-px outline-none transition-colors duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 data-checked:border-accent data-checked:bg-accent disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        // 减少动态效果时旋钮直接落位，不做位移动画（颜色变化仍保留，它不是运动）
        className="aspect-square h-full rounded-full bg-accent-fg shadow-sm data-checked:translate-x-3 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
      />
    </BaseSwitch.Root>
  )
}

export { Switch }
