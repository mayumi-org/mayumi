import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Button } from "./button"

describe("Button", () => {
  it("draws the bevel highlight inside the border, not as a second one", () => {
    render(<Button variant="secondary">按钮</Button>)
    const el = screen.getByRole("button")
    // 边框 + inset 高光在几何上就是 2px 顶边；能不能读成斜面取决于两条线的对比。
    // 暗色下 --highlight 被置为 transparent，只留一条 hairline（见 theme.css）。
    expect(el).toHaveClass("border")
    expect(el).toHaveClass("shadow-[inset_0_1px_0_0_var(--highlight)]")
  })

  it("renders children and fires onClick", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    )
    await userEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("applies the primary variant class", () => {
    render(<Button variant="primary">Go</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-accent")
  })

  it("exposes data-slot and merges custom className", () => {
    render(<Button className="w-full">Go</Button>)
    const el = screen.getByRole("button")
    expect(el).toHaveAttribute("data-slot", "button")
    expect(el).toHaveClass("w-full")
  })

  it("stamps a fingerprint at the pointer on each press", () => {
    render(<Button variant="tactile">take action</Button>)
    const button = screen.getByRole("button", { name: "take action" })
    button.getBoundingClientRect = () =>
      ({
        x: 10,
        y: 20,
        left: 10,
        top: 20,
        right: 210,
        bottom: 60,
        width: 200,
        height: 40,
        toJSON() {},
      }) as DOMRect

    fireEvent.pointerDown(button, { clientX: 60, clientY: 40, button: 0 })
    const mark = button.querySelector("[data-slot='button-fingerprint']")
    expect(mark).not.toBeNull()
    expect(mark).toHaveStyle({ left: "50px", top: "20px" })

    fireEvent.pointerDown(button, { clientX: 110, clientY: 30, button: 0 })
    expect(button.querySelectorAll("[data-slot='button-fingerprint']")).toHaveLength(2)
  })

  it("does not stamp flat variants", () => {
    render(<Button variant="primary">Go</Button>)
    fireEvent.pointerDown(screen.getByRole("button"), {
      clientX: 10,
      clientY: 10,
      button: 0,
    })
    expect(document.querySelector("[data-slot='button-fingerprint']")).toBeNull()
  })

  it("sinks on press instead of scaling", () => {
    render(<Button variant="tactile">take action</Button>)
    const button = screen.getByRole("button", { name: "take action" })
    expect(button).toHaveClass("motion-safe:active:translate-y-(--tactile-depth)")
    expect(button.className).not.toContain("scale-97")
  })

  // 减少动态效果时按下仍要有反馈，只是从缩放降级为压暗
  it("keeps a press affordance under reduced motion", () => {
    render(<Button>Go</Button>)
    const el = screen.getByRole("button")
    expect(el).toHaveClass("motion-safe:active:scale-97")
    expect(el).toHaveClass("motion-reduce:active:brightness-90")
  })

  it("squares icon-only sizes without horizontal padding", () => {
    render(
      <>
        <Button size="icon-sm" aria-label="小" />
        <Button size="icon-md" aria-label="中" />
        <Button size="icon-lg" aria-label="大" />
      </>
    )
    expect(screen.getByRole("button", { name: "小" })).toHaveClass("size-6")
    expect(screen.getByRole("button", { name: "中" })).toHaveClass("size-7")
    expect(screen.getByRole("button", { name: "大" })).toHaveClass("size-8")
    expect(screen.getByRole("button", { name: "中" }).className).not.toMatch(
      /\bpx-/
    )
  })

  it("lets className round an icon button", () => {
    render(<Button size="icon-md" aria-label="发送" className="rounded-full" />)
    const el = screen.getByRole("button", { name: "发送" })
    expect(el).toHaveClass("rounded-full")
    expect(el).not.toHaveClass("rounded-control")
  })

  it("gives tactile icon buttons the same depth as their text sizes", () => {
    render(<Button variant="tactile" size="icon-md" aria-label="播放" />)
    const el = screen.getByRole("button", { name: "播放" })
    expect(el).toHaveClass("size-10")
    expect(el).toHaveClass("[--tactile-depth:4px]")
  })
})
