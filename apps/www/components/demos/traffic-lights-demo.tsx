"use client"

import { TitleBar } from "@/registry/mayumi/ui/titlebar"
import { toast } from "@/registry/mayumi/ui/toast"
import { TrafficLights } from "@/registry/mayumi/ui/traffic-lights"
import { Window } from "@/registry/mayumi/ui/window"

// Toaster 已在根布局（app/layout.tsx）mount 一次，这里只调用 toast() 复用它，
// 不要在 demo 里再渲染 <Toaster />。
export function TrafficLightsDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <Window className="w-72">
        <TitleBar>
          <TrafficLights
            onClose={() => toast("clicked close")}
            onMinimize={() => toast("clicked minimize")}
            onZoom={() => toast("clicked zoom")}
          />
          <span className="text-ui text-fg-secondary">controls</span>
        </TitleBar>
      </Window>
      <Window className="w-72">
        <TitleBar>
          <TrafficLights mode="inset" />
          <span className="text-ui text-fg-secondary">inset 占位</span>
        </TitleBar>
      </Window>
    </div>
  )
}
