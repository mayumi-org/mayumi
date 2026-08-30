"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/mayumi/ui/avatar"

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>蒋</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/jiangweixian.png" alt="蒋威" />
        <AvatarFallback>蒋</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>MY</AvatarFallback>
      </Avatar>
    </div>
  )
}
