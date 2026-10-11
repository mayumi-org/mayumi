import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "./button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./command"
import { Window } from "./window"

const meta: Meta<typeof Command> = { title: "ui/Command", component: Command }
export default meta

export const Inline: StoryObj<typeof Command> = {
  render: () => (
    <div className="p-8">
      <Window className="h-96 w-[560px]">
        <Command>
          <CommandInput placeholder="搜索命令…" autoFocus />
          <CommandList>
            <CommandEmpty>无结果</CommandEmpty>
            <CommandGroup heading="常用">
              <CommandItem value="打开设置">
                打开设置<CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
              <CommandItem value="锁定屏幕">
                锁定屏幕<CommandShortcut>⌃⌘Q</CommandShortcut>
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
    </div>
  ),
}

function PaletteDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>打开命令面板 ⌘K</Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="搜索命令…" autoFocus />
        <CommandList>
          <CommandEmpty>无结果</CommandEmpty>
          <CommandItem value="打开设置" onSelect={() => setOpen(false)}>
            打开设置
          </CommandItem>
          <CommandItem value="锁定屏幕" onSelect={() => setOpen(false)}>
            锁定屏幕
          </CommandItem>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export const Palette: StoryObj<typeof Command> = { render: () => <PaletteDemo /> }
