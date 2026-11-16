"use client"

import { Button } from "@/registry/mayumi/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/mayumi/ui/popover"

export function PopoverDemo() {
  return (
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
  )
}
