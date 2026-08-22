import { cn } from "@/registry/mayumi/lib/utils"

function Window({
  className,
  vibrancy = false,
  ...props
}: React.ComponentProps<"div"> & { vibrancy?: boolean }) {
  return (
    <div
      data-slot="window"
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-hidden rounded-window border border-border text-[13px] text-fg shadow-[var(--shadow-overlay)]",
        vibrancy ? "mayumi-vibrancy" : "bg-background",
        className
      )}
      {...props}
    />
  )
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="window-body"
      className={cn("flex min-h-0 flex-1", className)}
      {...props}
    />
  )
}

export { Window, WindowBody }
