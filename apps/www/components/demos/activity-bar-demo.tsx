"use client"

import { AtSign, Clock, House, Library, Settings } from "lucide-react"
import { useState } from "react"

import {
  ActivityBar,
  ActivityBarItem,
  ActivityBarSpacer,
} from "@/registry/mayumi/ui/activity-bar"
import { Badge } from "@/registry/mayumi/ui/badge"

const ITEMS = [
  { id: "home", label: "首页", icon: House },
  { id: "library", label: "资料库", icon: Library },
  { id: "history", label: "历史", icon: Clock },
  { id: "mentions", label: "提及，3 条未读", icon: AtSign, badge: <Badge count={3} /> },
]

export function ActivityBarDemo() {
  const [current, setCurrent] = useState("home")
  return (
    <ActivityBar aria-label="分区" className="h-72 rounded-card border border-border">
      {ITEMS.map(({ id, label, icon: Icon, badge }) => (
        <ActivityBarItem
          key={id}
          label={label}
          active={current === id}
          badge={badge}
          onClick={() => setCurrent(id)}
        >
          <Icon aria-hidden="true" />
        </ActivityBarItem>
      ))}
      <ActivityBarSpacer />
      <ActivityBarItem label="设置">
        <Settings aria-hidden="true" />
      </ActivityBarItem>
    </ActivityBar>
  )
}
