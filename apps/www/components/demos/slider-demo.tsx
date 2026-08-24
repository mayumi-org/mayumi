import { Slider } from "@/registry/mayumi/ui/slider"

export function SliderDemo() {
  return (
    <div className="w-64">
      <Slider aria-label="音量" defaultValue={30} />
    </div>
  )
}
