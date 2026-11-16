import { WakeSlider } from "@/registry/mayumi/ui/wake-slider"

export function WakeSliderDemo() {
  return (
    <div className="mx-auto w-full max-w-md space-y-3">
      <div>
        <h2 className="text-ui font-medium text-fg">音量</h2>
        <p className="mt-1 text-xs text-fg-tertiary">
          快速拖动刻度，经过的竖条会随速度抬升并回落。
        </p>
      </div>
      <WakeSlider aria-label="音量" defaultValue={50} />
    </div>
  )
}
