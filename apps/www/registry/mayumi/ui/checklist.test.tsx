import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Checklist } from "./checklist"

const reducedMotion = vi.hoisted(() => ({ current: false }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}))

const items = [
  { id: "design", label: "确认设计" },
  { id: "build", label: "完成构建" },
]

afterEach(() => {
  reducedMotion.current = false
})

describe("Checklist", () => {
  it("toggles items and reports values in item order", async () => {
    const onValueChange = vi.fn()
    render(<Checklist items={items} onValueChange={onValueChange} />)

    await userEvent.click(screen.getByRole("checkbox", { name: "完成构建" }))
    expect(onValueChange).toHaveBeenLastCalledWith(["build"])
    await userEvent.click(screen.getByRole("checkbox", { name: "确认设计" }))
    expect(onValueChange).toHaveBeenLastCalledWith(["design", "build"])
    expect(screen.getByRole("checkbox", { name: "确认设计" })).toBeChecked()
  })

  it("supports controlled values", async () => {
    const onValueChange = vi.fn()
    render(<Checklist items={items} value={[]} onValueChange={onValueChange} />)

    await userEvent.click(screen.getByRole("checkbox", { name: "确认设计" }))
    expect(onValueChange).toHaveBeenCalledWith(["design"])
    expect(screen.getByRole("checkbox", { name: "确认设计" })).not.toBeChecked()
  })

  it("respects disabled items", async () => {
    const onValueChange = vi.fn()
    render(
      <Checklist
        items={[{ id: "locked", label: "不可修改", disabled: true }]}
        onValueChange={onValueChange}
      />
    )

    await userEvent.click(screen.getByRole("checkbox", { name: "不可修改" }))
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("collapses when complete and expands when an item is unchecked", async () => {
    render(<Checklist items={items} stackOnComplete />)

    await userEvent.click(screen.getByRole("checkbox", { name: "确认设计" }))
    await userEvent.click(screen.getByRole("checkbox", { name: "完成构建" }))
    expect(document.querySelector('[data-slot="checklist"]')).toHaveAttribute(
      "data-collapsed"
    )

    await userEvent.click(screen.getByRole("checkbox", { name: "确认设计" }))
    expect(document.querySelector('[data-slot="checklist"]')).not.toHaveAttribute(
      "data-collapsed"
    )
  })

  it("overlaps completed rows when stacking is enabled", () => {
    const threeItems = [...items, { id: "ship", label: "发布" }]
    render(
      <Checklist
        items={threeItems}
        value={["design", "build", "ship"]}
        stackOnComplete
      />
    )

    expect(document.querySelector('[data-slot="checklist-item"]')).toHaveStyle({
      transform: "translate3d(-2px, 62px, 0) rotate(-1.5deg)",
    })
  })

  it("does not collapse by default", () => {
    render(<Checklist items={items} value={["design", "build"]} />)

    expect(document.querySelector('[data-slot="checklist"]')).toHaveAttribute(
      "data-complete"
    )
    expect(document.querySelector('[data-slot="checklist"]')).not.toHaveAttribute(
      "data-collapsed"
    )
  })

  it("puts the focus indicator on the checkbox box", () => {
    render(<Checklist items={items} />)

    expect(screen.getByRole("checkbox", { name: "确认设计" })).not.toHaveClass(
      "focus-visible:ring-2"
    )
    expect(document.querySelector('[data-slot="checklist-content"]')).not.toHaveClass(
      "group-focus-visible:ring-2"
    )
    expect(document.querySelector('[data-slot="checklist-box"]')).toHaveClass(
      "group-focus-visible:ring-2"
    )
  })

  it("keeps the list expanded with reduced motion", () => {
    reducedMotion.current = true
    render(<Checklist items={items} value={["design", "build"]} stackOnComplete />)

    expect(document.querySelector('[data-slot="checklist"]')).toHaveAttribute(
      "data-complete"
    )
    expect(document.querySelector('[data-slot="checklist"]')).not.toHaveAttribute(
      "data-collapsed"
    )
  })
})
