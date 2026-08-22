import { cn } from "@/registry/mayumi/lib/utils"

function TitleBar({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="titlebar"
      data-tauri-drag-region
      className={cn(
        "app-region-drag relative flex h-12 shrink-0 select-none items-center gap-2 px-3",
        className
      )}
      {...props}
    />
  )
}

export { TitleBar }
