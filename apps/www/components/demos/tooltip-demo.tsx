"use client"

import { Button } from "@/registry/mayumi/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/mayumi/ui/tooltip"

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger render={<Button variant="secondary">悬停</Button>} />
          <TooltipContent>ChatGPT</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost">无尾</Button>} />
          <TooltipContent arrow={false}>极简模式</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
