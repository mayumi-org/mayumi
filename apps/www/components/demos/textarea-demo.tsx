import { Textarea } from "@/registry/mayumi/ui/textarea"

export function TextareaDemo() {
  return (
    <div className="w-72 space-y-2">
      <Textarea placeholder="说点什么…" rows={3} />
      <Textarea placeholder="禁用" rows={2} disabled />
    </div>
  )
}
