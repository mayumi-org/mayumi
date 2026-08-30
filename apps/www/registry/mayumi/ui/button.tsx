import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const buttonVariants = cva(
  // 按下反馈：默认缩放；减少动态效果时降级为压暗，而不是完全没有反馈
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-control text-ui font-medium outline-none transition-[background-color,border-color,color,scale,filter] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-97 motion-reduce:active:brightness-90",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-accent/90",
        // secondary 是凸起控件：hover 用更实的面推进一档，而不是靠降低透明度
        secondary:
          "border border-border bg-surface-2 text-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-surface-2-hover",
        // ghost 直接坐在 chrome 上，用中性 tint 才不会在毛玻璃上糊掉
        ghost: "text-fg-secondary hover:bg-fill-hover hover:text-fg",
        danger: "bg-danger text-accent-fg hover:bg-danger/90",
      },
      size: {
        sm: "h-6 px-2",
        md: "h-7 px-3",
        lg: "h-8 px-4",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      {...props}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
    />
  )
}

export { Button, buttonVariants }
