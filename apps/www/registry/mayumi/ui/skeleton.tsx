import { cn } from "@/registry/mayumi/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-control bg-fill motion-reduce:animate-none",
        className
      )}
    />
  )
}

export { Skeleton }
