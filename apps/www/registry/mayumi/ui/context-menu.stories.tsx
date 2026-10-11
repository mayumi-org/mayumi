import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./context-menu"

const meta: Meta<typeof ContextMenu> = {
  title: "ui/ContextMenu",
  component: ContextMenu,
}
export default meta

export const Default: StoryObj<typeof ContextMenu> = {
  render: () => (
    <div className="p-16">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-10 w-56 items-center rounded-card border border-border bg-surface px-3 text-ui text-fg">
          右键这条记录
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>重命名</ContextMenuItem>
          <ContextMenuItem>复制</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="data-highlighted:bg-danger">
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  ),
}
