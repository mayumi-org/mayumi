import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/registry/mayumi/lib/utils"

const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full select-none",
  {
    variants: {
      tone: {
        danger: "bg-danger text-accent-fg",
        accent: "bg-accent text-accent-fg",
        neutral: "bg-fill-active text-fg-secondary",
      },
      dot: {
        true: "size-2",
        false: "h-4 min-w-4 px-1 text-xs leading-none font-semibold tabular-nums",
      },
    },
    defaultVariants: { tone: "danger", dot: false },
  }
)

type BadgeProps = Omit<React.ComponentProps<"span">, "children"> &
  Pick<VariantProps<typeof badgeVariants>, "tone"> & {
    children?: React.ReactNode
    /** 数字角标；超过 max 显示为 `${max}+`，为 0 时不渲染 */
    count?: number
    max?: number
  }

/** 没有 children 也没有 count 时渲染成小圆点 */
function Badge({
  className,
  tone,
  count,
  max = 99,
  children,
  ...props
}: BadgeProps) {
  if (count === 0 && children == null) return null
  const content =
    children ?? (count === undefined ? null : count > max ? `${max}+` : count)
  const dot = content == null

  return (
    <span
      {...props}
      data-slot="badge"
      data-dot={dot || undefined}
      className={cn(badgeVariants({ tone, dot, className }))}
    >
      {content}
    </span>
  )
}

export { Badge, badgeVariants }
