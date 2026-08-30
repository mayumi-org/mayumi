"use client"

import { Inbox } from "lucide-react"

import { Button } from "@/registry/mayumi/ui/button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/registry/mayumi/ui/empty-state"

// 容器不带边框：文档页的预览框已经是同色描边，再来一层会读成两个同心框
export function EmptyStateDemo() {
  return (
    <div className="w-full max-w-sm rounded-card bg-fill">
      <EmptyState>
        <EmptyStateIcon>
          <Inbox />
        </EmptyStateIcon>
        <EmptyStateTitle>无项目</EmptyStateTitle>
        <EmptyStateDescription>
          还没有 App 请求过屏幕录制权限。它们会在首次请求时出现在这里。
        </EmptyStateDescription>
        <EmptyStateActions>
          <Button variant="secondary" size="sm">
            手动添加
          </Button>
        </EmptyStateActions>
      </EmptyState>
    </div>
  )
}
