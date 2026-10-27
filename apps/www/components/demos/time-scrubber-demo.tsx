import { TimeScrubber } from "@/registry/mayumi/ui/time-scrubber"

export function TimeScrubberDemo() {
  return (
    <div className="mx-auto w-full max-w-md space-y-5">
      <div className="text-center">
        <h2 className="text-ui font-medium text-fg">会议时间</h2>
        <p className="mt-1 text-xs text-fg-tertiary">
          拖动时间尺，松手后会按惯性滑动并吸附到最近的 15 分钟。
        </p>
      </div>
      <TimeScrubber aria-label="会议时间" defaultValue={570} />
    </div>
  )
}
