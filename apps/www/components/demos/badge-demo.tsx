import { Bell } from "lucide-react"

import { Badge } from "@/registry/mayumi/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex items-center gap-3">
      <Badge count={3} />
      <Badge count={128} />
      <Badge tone="accent">新</Badge>
      <Badge tone="neutral" count={12} />
      <Badge />
      <span className="relative ml-3 inline-flex">
        <Bell aria-hidden="true" className="size-5 text-fg-secondary" />
        <Badge className="absolute -top-1 -right-1.5" count={4} />
      </span>
    </div>
  )
}
