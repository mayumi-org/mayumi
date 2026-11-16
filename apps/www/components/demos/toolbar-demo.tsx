import { Button } from "@/registry/mayumi/ui/button"
import { Toolbar, ToolbarTitle } from "@/registry/mayumi/ui/toolbar"
import { Window } from "@/registry/mayumi/ui/window"

export function ToolbarDemo() {
  return (
    <Window className="h-24 w-full max-w-xl">
      <div className="flex h-full items-center px-3">
        <Toolbar>
          <ToolbarTitle>下载</ToolbarTitle>
        </Toolbar>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm">
            清除
          </Button>
          <Button variant="secondary" size="sm">
            全部暂停
          </Button>
        </div>
      </div>
    </Window>
  )
}
