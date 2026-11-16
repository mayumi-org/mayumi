import { Separator as BaseSeparator } from "@base-ui/react/separator"

import { cn } from "@/registry/mayumi/lib/utils"

type SeparatorProps = React.ComponentProps<typeof BaseSeparator>

/**
 * 带 children 时渲染成「线 — 文字 — 线」的分组标题（时间分隔、列表分段）。
 * separator 角色的子内容不会被读屏读出，所以带文字时外层不挂这个角色，两侧的线只做装饰。
 */
function Separator({
  className,
  orientation = "horizontal",
  children,
  ...props
}: SeparatorProps) {
  if (children != null) {
    return (
      <div
        {...(props as React.ComponentProps<"div">)}
        data-slot="separator"
        className={cn(
          "flex w-full items-center gap-3 text-xs text-fg-tertiary",
          className
        )}
      >
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span className="shrink-0 tabular-nums">{children}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
    )
  }

  return (
    <BaseSeparator
      {...props}
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "vertical" ? "w-px self-stretch" : "h-px w-full",
        className
      )}
    />
  )
}

export { Separator }
