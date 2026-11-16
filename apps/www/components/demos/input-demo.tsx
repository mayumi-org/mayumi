import { Input } from "@/registry/mayumi/ui/input"

export function InputDemo() {
  return (
    <div className="w-64 space-y-2">
      <Input placeholder="名称" />
      <Input placeholder="禁用" disabled />
    </div>
  )
}
