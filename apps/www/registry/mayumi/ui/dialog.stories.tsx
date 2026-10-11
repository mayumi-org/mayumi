import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

const meta: Meta<typeof Dialog> = { title: "ui/Dialog", component: Dialog }
export default meta

export const Default: StoryObj<typeof Dialog> = {
  render: () => (
    <div className="p-16">
      <Dialog>
        <DialogTrigger render={<Button variant="danger">删除项目</Button>} />
        <DialogContent>
          <DialogTitle>确认删除？</DialogTitle>
          <DialogDescription>
            项目将被移到废纸篓，此操作不可撤销。
          </DialogDescription>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose render={<Button variant="secondary">取消</Button>} />
            <DialogClose render={<Button variant="danger">删除</Button>} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ),
}
