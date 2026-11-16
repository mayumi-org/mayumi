import { Kbd } from "@/registry/mayumi/ui/kbd"

export function KbdDemo() {
  return (
    <p className="flex items-center gap-1 text-ui text-fg-secondary">
      打开命令面板 <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </p>
  )
}
