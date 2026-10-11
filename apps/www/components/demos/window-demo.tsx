import { Window, WindowBody } from "@/registry/mayumi/ui/window"

export function WindowDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <Window className="h-60 w-72">
        <WindowBody>
          <div className="flex flex-1 items-center justify-center text-fg-secondary">
            solid window
          </div>
        </WindowBody>
      </Window>
      <div className="rounded-window bg-gradient-to-br from-accent/40 via-traffic-zoom/30 to-traffic-close/30 p-4">
        <Window vibrancy className="h-60 w-72">
          <WindowBody>
            <div className="flex flex-1 items-center justify-center text-fg-secondary">
              vibrancy window
            </div>
          </WindowBody>
        </Window>
      </div>
    </div>
  )
}
