import { ArrowUp, Plus } from "lucide-react"

import { Button } from "@/registry/mayumi/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary">主要</Button>
        <Button variant="secondary">次要</Button>
        <Button variant="ghost">幽灵</Button>
        <Button variant="danger">危险</Button>
        <Button variant="tactile">take action</Button>
        <Button disabled>禁用</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="添加">
          <Plus aria-hidden="true" />
        </Button>
        <Button variant="secondary" size="icon-md" aria-label="添加">
          <Plus aria-hidden="true" />
        </Button>
        <Button
          variant="primary"
          size="icon-md"
          aria-label="发送"
          className="rounded-full"
        >
          <ArrowUp aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
