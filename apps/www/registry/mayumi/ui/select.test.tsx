import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

function Demo({
  onValueChange,
  side,
}: {
  onValueChange?: (v: unknown) => void
  side?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <Select defaultValue="auto" onValueChange={onValueChange}>
      <SelectTrigger aria-label="外观">
        <SelectValue />
      </SelectTrigger>
      <SelectContent side={side}>
        <SelectItem value="auto">自动</SelectItem>
        <SelectItem value="light">浅色</SelectItem>
        <SelectItem value="dark">深色</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe("Select", () => {
  it("opens the popup on trigger click and lists options", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    expect(await screen.findAllByRole("option")).toHaveLength(3)
  })

  it("selects an option and fires onValueChange", async () => {
    const onValueChange = vi.fn()
    render(<Demo onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    await userEvent.click(await screen.findByRole("option", { name: "深色" }))
    expect(onValueChange).toHaveBeenCalledWith("dark", expect.anything())
  })

  it("covers the trigger like a macOS pop-up button", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    const popup = (await screen.findByRole("option", { name: "自动" })).closest(
      "[data-slot='select-content']"
    )
    // 浮层至少和触发器一样宽；data-side=none（Base UI 的「盖在触发器上」状态，
    // jsdom 里量不到 rect 所以永远退化成 bottom）时还要更宽 —— 那时浮层被左移
    // 一个勾选槽的距离，不加宽右边就会露出一截触发器残边。
    expect(popup).toHaveClass("min-w-[var(--anchor-width,6rem)]")
    expect(popup).toHaveClass(
      "data-[side=none]:min-w-[calc(var(--anchor-width,6rem)+1.5rem)]"
    )
  })

  it("appears without scaling when it covers the trigger", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    const popup = (await screen.findByRole("option", { name: "自动" })).closest(
      "[data-slot='select-content']"
    )
    // AppKit 的弹出式菜单是瞬间出现的：盖在触发器上时只淡入、不缩放
    expect(popup).toHaveClass("data-[side=none]:duration-[120ms]")
    expect(popup).toHaveClass(
      "motion-safe:not-data-[side=none]:data-starting-style:scale-95"
    )
    expect(popup).not.toHaveClass("motion-safe:data-starting-style:scale-95")
  })

  it("highlights the selected item while nothing else is active", async () => {
    render(<Demo />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    const option = await screen.findByRole("option", { name: "自动" })
    expect(option).toHaveAttribute("data-selected")
    // 指针移出浮层后 active 会被清空，整个菜单一行都不高亮；
    // 这条 :has() 规则负责把当前项重新画成蓝底
    expect(option).toHaveClass(
      "group-[&:not(:has([data-highlighted]))]/content:data-selected:bg-accent"
    )
    expect(option.closest("[data-slot='select-content']")).toHaveClass(
      "group/content"
    )
  })

  it("forwards side to the positioner", async () => {
    render(<Demo side="bottom" />)
    await userEvent.click(screen.getByRole("combobox", { name: "外观" }))
    const option = await screen.findByRole("option", { name: "自动" })
    expect(option.closest("[data-side]")).toHaveAttribute("data-side", "bottom")
  })
})
