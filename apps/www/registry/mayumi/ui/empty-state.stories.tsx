import type { Meta, StoryObj } from "@storybook/react-vite"
import { Inbox } from "lucide-react"
import { Button } from "./button"
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "./empty-state"

const meta: Meta<typeof EmptyState> = {
  title: "ui/EmptyState",
  component: EmptyState,
}
export default meta

export const Default: StoryObj<typeof EmptyState> = {
  render: () => (
    <div className="w-96 rounded-card border border-border bg-surface">
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
  ),
}
