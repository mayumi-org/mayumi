import { Switch } from "@/registry/mayumi/ui/switch"

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-4">
      <Switch aria-label="关闭态" />
      <Switch aria-label="开启态" defaultChecked />
      <Switch aria-label="禁用" disabled />
    </div>
  )
}
