import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog"
import { Button } from "./button"

const meta: Meta<typeof AlertDialog> = {
  title: "ui/AlertDialog",
  component: AlertDialog,
}
export default meta

export const Default: StoryObj<typeof AlertDialog> = {
  render: () => (
    <div className="p-16">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="danger">删除订阅</Button>} />
        <AlertDialogContent>
          <AlertDialogTitle>确认删除该订阅源？</AlertDialogTitle>
          <AlertDialogDescription>
            此操作将移除其下未收藏的会话与缓存文章，无法撤销。
          </AlertDialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <AlertDialogClose render={<Button variant="secondary">取消</Button>} />
            <AlertDialogClose render={<Button variant="danger">确认删除</Button>} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
}
