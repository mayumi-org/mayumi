import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar"

import { cn } from "@/registry/mayumi/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

/**
 * 窗口最左侧的竖排图标栏（VS Code / Slack / Codex 的分区切换）。
 * 用 Base UI Toolbar 竖排：整条只占一个 Tab 站，上下方向键漫游焦点。
 */
function ActivityBar({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <BaseToolbar.Root
      {...props}
      data-slot="activity-bar"
      orientation="vertical"
      className={cn(
        "flex w-11 shrink-0 flex-col items-center gap-1 py-2",
        className
      )}
    />
  )
}

type ActivityBarItemProps = React.ComponentProps<typeof BaseToolbar.Button> & {
  /** 无障碍名称，同时作为右侧 Tooltip 的文字 */
  label: string
  active?: boolean
  /** 右上角的角标，通常放一个 Badge；仅作视觉提示，读屏信息请写进 label */
  badge?: React.ReactNode
}

function ActivityBarItem({
  className,
  label,
  active = false,
  badge,
  children,
  ...props
}: ActivityBarItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <BaseToolbar.Button
            {...props}
            data-slot="activity-bar-item"
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-label={label}
            className={cn(
              "relative inline-flex size-8 shrink-0 items-center justify-center rounded-control outline-none transition-colors duration-150 ease-out select-none focus-visible:ring-2 focus-visible:ring-accent/60 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
              active
                ? "bg-fill-active text-fg"
                : "text-fg-secondary hover:bg-fill-hover hover:text-fg active:bg-fill-active",
              className
            )}
          />
        }
      >
        {children}
        {badge != null ? (
          <span
            aria-hidden="true"
            data-slot="activity-bar-badge"
            className="pointer-events-none absolute top-0.5 right-0.5 flex"
          >
            {badge}
          </span>
        ) : null}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

/** 把之后的项推到底部（头像、设置） */
function ActivityBarSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      aria-hidden="true"
      data-slot="activity-bar-spacer"
      className={cn("flex-1", className)}
    />
  )
}

export { ActivityBar, ActivityBarItem, ActivityBarSpacer }
