import { Input as BaseInput } from "@base-ui/react/input"

import { cn } from "@/registry/mayumi/lib/utils"

function Input({
  className,
  ...props
}: React.ComponentProps<typeof BaseInput>) {
  return (
    <BaseInput
      {...props}
      data-slot="input"
      className={cn(
        "h-7 w-full rounded-control border border-border bg-fill px-2 text-ui text-fg outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-fg-tertiary focus:border-accent/60 focus:ring-2 focus:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    />
  )
}

export { Input }
