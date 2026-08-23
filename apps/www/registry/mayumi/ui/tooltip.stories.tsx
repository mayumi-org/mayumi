import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import { SidebarNavIcon } from "./sidebar-nav"
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

export const DockStyle: StoryObj<typeof Tooltip> = {
  render: () => (
    <div className="flex items-end gap-3 p-16 pt-32">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <button type="button" aria-label="ChatGPT">
                <SidebarNavIcon className="size-12 rounded-card bg-traffic-zoom" />
              </button>
            }
          />
          <TooltipContent>ChatGPT</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <button type="button" aria-label="微信">
                <SidebarNavIcon className="size-12 rounded-card bg-traffic-minimize" />
              </button>
            }
          />
          <TooltipContent>微信</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <button type="button" aria-label="终端">
                <SidebarNavIcon className="size-12 rounded-card bg-traffic-close" />
              </button>
            }
          />
          <TooltipContent arrow={false}>无尾巴模式</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
}
