import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar"

import { cn } from "@/registry/mayumi/lib/utils"

/**
 * 源列表底部的 +/− 条（Finder 边栏、系统设置权限列表的那一条）。
 * 用 Base UI Toolbar 而不是裸 div：它给出 role="toolbar" 和方向键漫游焦点，
 * 一组图标按钮在 Tab 序列里只占一站。
 */
function ListToolbar({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <BaseToolbar.Root
      {...props}
      data-slot="list-toolbar"
      className={cn(
        "flex h-8 items-center gap-0.5 border-t border-border px-1",
        className
      )}
    />
  )
}

function ListToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Button>) {
  return (
    <BaseToolbar.Button
      {...props}
      data-slot="list-toolbar-button"
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-icon text-fg-secondary outline-none transition-colors duration-150 ease-out select-none hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-accent/60 active:bg-fill-active data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0",
        className
      )}
    />
  )
}

function ListToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseToolbar.Separator>) {
  return (
    <BaseToolbar.Separator
      {...props}
      data-slot="list-toolbar-separator"
      className={cn("mx-1 h-4 w-px shrink-0 bg-border", className)}
    />
  )
}

/** 把工具条推到右侧，用于「左边 +/−、右边操作」的布局 */
function ListToolbarSpacer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      aria-hidden="true"
      data-slot="list-toolbar-spacer"
      className={cn("flex-1", className)}
    />
  )
}

export {
  ListToolbar,
  ListToolbarButton,
  ListToolbarSeparator,
  ListToolbarSpacer,
}
