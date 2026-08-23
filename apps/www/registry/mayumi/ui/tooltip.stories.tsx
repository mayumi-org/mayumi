import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const meta: Meta<typeof Tooltip> = { title: "ui/Tooltip", component: Tooltip }
export default meta

export const Default: StoryObj<typeof Tooltip> = {
  render: () => (
    <div className="p-16">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary">悬停查看</Button>} />
          <TooltipContent>从触发器缩放而出</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}
