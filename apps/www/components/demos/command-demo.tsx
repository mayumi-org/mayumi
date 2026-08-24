"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/mayumi/ui/command"
import { Window } from "@/registry/mayumi/ui/window"

export function CommandDemo() {
  return (
    <Window className="h-96 w-full max-w-xl">
      <Command>
        <CommandInput placeholder="搜索命令…" />
        <CommandList>
          <CommandEmpty>无结果</CommandEmpty>
          <CommandGroup heading="常用">
            <CommandItem value="打开设置">
              打开设置
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem value="锁定屏幕">
              锁定屏幕
              <CommandShortcut>⌃⌘Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="系统">
            <CommandItem value="关于本机">关于本机</CommandItem>
            <CommandItem value="强制退出" disabled>
              强制退出
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </Window>
  )
}
