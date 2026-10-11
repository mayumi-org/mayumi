import { cn } from "@/registry/mayumi/lib/utils"

function Toolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="toolbar"
      className={cn("flex min-w-0 flex-1 items-center gap-1", className)}
    />
  )
}

function ToolbarTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      {...props}
      data-slot="toolbar-title"
      className={cn("truncate text-ui font-semibold text-fg", className)}
    />
  )
}

export { Toolbar, ToolbarTitle }
