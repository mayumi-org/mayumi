import { ScrollArea } from "@/registry/mayumi/ui/scroll-area"

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-48 w-64 rounded-card border border-border bg-surface">
      <div className="p-3 text-ui text-fg-secondary">
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="py-1">
            列表行 {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
  )
}
