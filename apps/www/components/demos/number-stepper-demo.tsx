import { NumberStepper } from "@/registry/mayumi/ui/number-stepper"

export function NumberStepperDemo() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-5">
      <div className="text-center">
        <h2 className="text-ui font-medium text-fg">参与人数</h2>
        <p className="mt-1 text-xs text-fg-tertiary">
          点击或长按加减按钮，也可以上下拖动数字。
        </p>
      </div>
      <NumberStepper aria-label="参与人数" defaultValue={95} max={999} />
    </div>
  )
}
