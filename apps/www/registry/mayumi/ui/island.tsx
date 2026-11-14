import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const islandVariants = cva(
  "relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-island border border-border",
  {
    variants: {
      /**
       * default：主工作浮岛容器（桌面端 `--island-bg` + `--shadow-island`，standalone 回退 `--surface` + `--shadow-raised`）
       * sub：次级内嵌区块（如底部上下文托架）
       */
      variant: {
        default:
          "bg-[var(--island-bg,var(--surface))] shadow-[var(--shadow-island,var(--shadow-raised))]",
        sub: "bg-[var(--island-sub,var(--surface-2))]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Island({
  className,
  variant,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof islandVariants>) {
  return (
    <section
      {...props}
      data-slot="island"
      data-variant={variant ?? "default"}
      className={cn(islandVariants({ variant, className }))}
    />
  )
}

function IslandHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      {...props}
      data-slot="island-header"
      className={cn(
        "flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border px-4",
        className
      )}
    />
  )
}

function IslandTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      {...props}
      data-slot="island-title"
      className={cn("truncate text-ui font-semibold text-fg", className)}
    />
  )
}

function IslandContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="island-content"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    />
  )
}

function IslandFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      {...props}
      data-slot="island-footer"
      className={cn("shrink-0 border-t border-border px-4 py-3", className)}
    />
  )
}

export {
  Island,
  IslandContent,
  IslandFooter,
  IslandHeader,
  IslandTitle,
  islandVariants,
}
