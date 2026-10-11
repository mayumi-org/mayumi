import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const meta: Meta<typeof DropdownMenu> = {
  title: "ui/DropdownMenu",
  component: DropdownMenu,
}
export default meta

export const Default: StoryObj<typeof DropdownMenu> = {
  render: () => (
    <div className="p-16">
      <DropdownMenu>
        <DropdownMenuTrigger>操作</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>重命名</DropdownMenuItem>
          <DropdownMenuItem>复制</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="data-highlighted:bg-danger">
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
