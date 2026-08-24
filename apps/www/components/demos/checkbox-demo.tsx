import { Checkbox } from "@/registry/mayumi/ui/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="未选" />
      <Checkbox aria-label="已选" defaultChecked />
      <Checkbox aria-label="禁用" disabled />
    </div>
  )
}
