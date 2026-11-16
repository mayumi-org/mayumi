import { cn } from "@/registry/mayumi/lib/utils"

/**
 * 空列表 / 空内容区的占位。整体居中、字号克制——
 * 它是「这里暂时没东西」的说明，不是要抢注意力的插画位。
 */
function EmptyState({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-10 text-center",
        className
      )}
    />
  )
}

/** 图标槽：中性 tint 圆底，避免用彩色抢内容区的视觉权重 */
function EmptyStateIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      aria-hidden="true"
      data-slot="empty-state-icon"
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-fill text-fg-tertiary [&_svg]:size-5 [&_svg]:shrink-0",
        className
      )}
    />
  )
}

function EmptyStateTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      data-slot="empty-state-title"
      className={cn("text-ui leading-tight font-medium text-fg", className)}
    />
  )
}

function EmptyStateDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      {...props}
      data-slot="empty-state-description"
      className={cn(
        "max-w-xs text-xs leading-relaxed text-fg-secondary",
        className
      )}
    />
  )
}

function EmptyStateActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      data-slot="empty-state-actions"
      className={cn("flex items-center gap-2 pt-1", className)}
    />
  )
}

export {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
}
