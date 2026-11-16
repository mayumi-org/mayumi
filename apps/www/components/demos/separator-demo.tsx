import { Separator } from "@/registry/mayumi/ui/separator"

export function SeparatorDemo() {
  return (
    <div className="flex w-80 flex-col gap-3 text-ui text-fg">
      <p>通用</p>
      <Separator />
      <div className="flex h-5 items-center gap-3 text-fg-secondary">
        <span>剪切</span>
        <Separator orientation="vertical" />
        <span>复制</span>
        <Separator orientation="vertical" />
        <span>粘贴</span>
      </div>
      <Separator>10月10日 15:38</Separator>
    </div>
  )
}
