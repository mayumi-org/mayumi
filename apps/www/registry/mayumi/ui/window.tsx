import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const windowVariants = cva(
  "relative flex h-full min-h-0 flex-col overflow-hidden rounded-window border border-border text-ui text-fg shadow-[var(--shadow-overlay)]",
  {
    variants: {
      /** 透明窗口场景（Tauri/Electron）开启毛玻璃材质，否则用实色背景 */
      vibrancy: {
        true: "mayumi-vibrancy",
        false: "bg-background",
      },
    },
    defaultVariants: { vibrancy: false },
  }
)

function Window({
  className,
  vibrancy,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof windowVariants>) {
  return (
    <div
      {...props}
      data-slot="window"
      className={cn(windowVariants({ vibrancy, className }))}
    />
  )
}

function WindowBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="window-body"
      className={cn("flex min-h-0 flex-1", className)}
    />
  )
}

export { Window, WindowBody, windowVariants }
