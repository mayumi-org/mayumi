import { cn } from "@/registry/mayumi/lib/utils"

function Toolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toolbar"
      className={cn("flex min-w-0 flex-1 items-center gap-1", className)}
      {...props}
    />
  )
}

function ToolbarTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="toolbar-title"
      className={cn("truncate text-[13px] font-semibold text-fg", className)}
      {...props}
    />
  )
}

export { Toolbar, ToolbarTitle }
