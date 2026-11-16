"use client"

import { Button } from "@/registry/mayumi/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/registry/mayumi/ui/dialog"

export function DialogDemo() {
  return (
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
  )
}
