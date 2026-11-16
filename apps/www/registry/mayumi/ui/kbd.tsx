import { cn } from "@/registry/mayumi/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      {...props}
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-icon border border-border bg-surface-2 px-1 font-sans text-xs tabular-nums text-fg-secondary",
        className
      )}
    />
  )
}

export { Kbd }
