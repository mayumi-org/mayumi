import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "./button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./popover"

const meta: Meta<typeof Popover> = {
  title: "ui/Popover",
  component: Popover,
}
export default meta

export const Default: StoryObj<typeof Popover> = {
  render: () => (
    <div className="p-16">
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">筛选</Button>} />
        <PopoverContent>
          <p className="font-medium text-fg">按状态过滤</p>
          <p className="mt-1 text-fg-secondary">进行中、已完成</p>
          <PopoverClose render={<Button size="sm" className="mt-3" />}>
            完成
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
