"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/mayumi/ui/dropdown-menu"

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>操作</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>重命名</DropdownMenuItem>
        <DropdownMenuItem>复制</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="data-highlighted:bg-danger">
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
