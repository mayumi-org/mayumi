"use client"

import { Button } from "@/registry/mayumi/ui/button"
import { toast } from "@/registry/mayumi/ui/toast"

// Toaster 已在根布局（app/layout.tsx）mount 一次，这里只 import toast() 复用它，
// 不要在 demo 里再渲染 <Toaster />（会造成重复挂载）。
export function ToastDemo() {
  return (
    <div className="flex gap-2">
      <Button onClick={() => toast("已保存")}>基础通知</Button>
      <Button
        variant="secondary"
        onClick={() => toast("同步完成", { description: "3 个项目已更新" })}
      >
        带描述
      </Button>
    </div>
  )
}
