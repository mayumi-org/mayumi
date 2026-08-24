"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/mayumi/ui/select"

export function SelectDemo() {
  return (
    <Select defaultValue="auto">
      <SelectTrigger aria-label="外观">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">自动</SelectItem>
        <SelectItem value="light">浅色</SelectItem>
        <SelectItem value="dark">深色</SelectItem>
      </SelectContent>
    </Select>
  )
}
