import { Button } from "@/registry/mayumi/ui/button"
import { TitleBar } from "@/registry/mayumi/ui/titlebar"
import { Toolbar, ToolbarTitle } from "@/registry/mayumi/ui/toolbar"
import { Window } from "@/registry/mayumi/ui/window"

export function TitlebarDemo() {
  return (
    <Window className="h-40 w-full max-w-xl">
      <TitleBar>
        <Toolbar>
          <Button
            variant="ghost"
            size="sm"
            className="app-region-no-drag"
            aria-label="返回"
          >
            ←
          </Button>
          <ToolbarTitle className="ml-2">隐私与安全性</ToolbarTitle>
        </Toolbar>
      </TitleBar>
    </Window>
  )
}
