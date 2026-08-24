"use client"

import { useState } from "react"

import { SearchField } from "@/registry/mayumi/ui/search-field"

export function SearchFieldDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="w-56 space-y-2">
      <SearchField
        placeholder="搜索"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="text-xs text-fg-tertiary">当前值：{value || "（空）"}</p>
    </div>
  )
}
