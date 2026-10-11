import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const cardVariants = cva("rounded-card border border-border", {
  variants: {
    /**
     * flat：中性 tint 填充，用于内容区里并列的次级卡片
     * raised：实色面 + 投影，作为「抬离窗口一层」的内容岛
     */
    variant: {
      flat: "bg-fill",
      raised: "bg-surface shadow-[var(--shadow-raised)]",
    },
  },
  defaultVariants: { variant: "flat" },
})

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      {...props}
      data-slot="card"
      data-variant={variant ?? "flat"}
      className={cn(cardVariants({ variant, className }))}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card-header"
      className={cn("flex flex-col gap-0.5 p-4 pb-0", className)}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      {...props}
      data-slot="card-title"
      className={cn("text-ui leading-tight font-semibold text-fg", className)}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      data-slot="card-description"
      className={cn("text-xs leading-relaxed text-fg-secondary", className)}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div {...props} data-slot="card-content" className={cn("p-4", className)} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="card-footer"
      className={cn("flex items-center gap-2 p-4 pt-0", className)}
    />
  )
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
}
