import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"

function Demo({ onSelect }: { onSelect?: (v: string) => void }) {
  return (
    <Command>
      <CommandInput placeholder="搜索命令…" />
      <CommandList>
        <CommandEmpty>无结果</CommandEmpty>
        <CommandItem value="打开设置" onSelect={onSelect}>
          打开设置
        </CommandItem>
        <CommandItem value="锁定屏幕" onSelect={onSelect}>
          锁定屏幕
        </CommandItem>
      </CommandList>
    </Command>
  )
}

describe("Command", () => {
  it("filters items by typing", async () => {
    render(<Demo />)
    await userEvent.type(screen.getByPlaceholderText("搜索命令…"), "设置")
    expect(screen.getByText("打开设置")).toBeInTheDocument()
    expect(screen.queryByText("锁定屏幕")).toBeNull()
  })

  it("shows the empty state when nothing matches", async () => {
    render(<Demo />)
    await userEvent.type(screen.getByPlaceholderText("搜索命令…"), "zzz")
    expect(screen.getByText("无结果")).toBeInTheDocument()
  })

  it("fires onSelect when an item is clicked", async () => {
    const onSelect = vi.fn()
    render(<Demo onSelect={onSelect} />)
    await userEvent.click(screen.getByText("打开设置"))
    expect(onSelect).toHaveBeenCalledWith("打开设置")
  })

  it("renders as a centered palette dialog", () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="搜索命令…" />
        <CommandList>
          <CommandItem value="a">动作 A</CommandItem>
        </CommandList>
      </CommandDialog>
    )
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("动作 A")).toBeInTheDocument()
  })

  // 快捷键高频唤起的界面立即出现，不做开合动效
  it("opens without a transition", () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="搜索命令…" />
      </CommandDialog>
    )
    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("data-transition", "instant")
    expect(dialog.className).not.toMatch(/transition-\[scale,opacity\]/)
    expect(dialog.className).not.toMatch(/data-starting-style:/)
  })
})
