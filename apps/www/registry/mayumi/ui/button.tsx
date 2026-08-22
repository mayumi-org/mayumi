import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-control text-[13px] font-medium outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-accent/90",
        secondary:
          "border border-border bg-surface-2 text-fg shadow-[inset_0_1px_0_0_var(--highlight)] hover:bg-surface-2/70",
        ghost: "text-fg-secondary hover:bg-surface-2 hover:text-fg",
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
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
