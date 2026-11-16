import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Splitter } from "./splitter"

describe("Splitter", () => {
  it("exposes accessible separator attributes clamped to min/max", () => {
    render(<Splitter defaultValue={900} min={270} max={520} aria-label="Resize source" />)
    const sep = screen.getByRole("separator", { name: "Resize source" })
    expect(sep).toHaveAttribute("aria-orientation", "vertical")
    expect(sep).toHaveAttribute("aria-valuemin", "270")
    expect(sep).toHaveAttribute("aria-valuemax", "520")
    expect(sep).toHaveAttribute("aria-valuenow", "520")
  })

  it("supports keyboard arrow adjustment and clamping", async () => {
    const onChange = vi.fn()
    const onCommit = vi.fn()
    render(
      <Splitter
        defaultValue={300}
        min={270}
        max={520}
        step={20}
        onValueChange={onChange}
        onValueCommit={onCommit}
      />
    )
    const sep = screen.getByRole("separator")
    sep.focus()

    await userEvent.keyboard("{ArrowRight}")
    expect(onChange).toHaveBeenLastCalledWith(320)
    expect(onCommit).toHaveBeenLastCalledWith(320, { velocity: 0 })

    await userEvent.keyboard("{Home}")
    expect(onChange).toHaveBeenLastCalledWith(270)

    await userEvent.keyboard("{ArrowLeft}")
    expect(onChange).toHaveBeenLastCalledWith(270)

    await userEvent.keyboard("{End}")
    expect(onChange).toHaveBeenLastCalledWith(520)
  })

  it("inverts drag and arrow direction for right-docked panels", async () => {
    const onChange = vi.fn()
    render(
      <Splitter
        defaultValue={376}
        min={270}
        max={520}
        step={24}
        invert
        onValueChange={onChange}
      />
    )
    const sep = screen.getByRole("separator")
    sep.focus()

    await userEvent.keyboard("{ArrowLeft}")
    expect(onChange).toHaveBeenLastCalledWith(400)

    await userEvent.keyboard("{ArrowRight}")
    expect(onChange).toHaveBeenLastCalledWith(376)
  })

  it("tracks pointer drag, clamps bounds, and commits with release velocity", () => {
    const onChange = vi.fn()
    const onCommit = vi.fn()
    render(
      <Splitter
        defaultValue={300}
        min={270}
        max={400}
        onValueChange={onChange}
        onValueCommit={onCommit}
      />
    )
    const sep = screen.getByRole("separator")

    fireEvent.pointerDown(sep, { button: 0, clientX: 100, pointerId: 1 })
    expect(sep).toHaveAttribute("data-dragging", "true")

    fireEvent(window, new PointerEvent("pointermove", { clientX: 150 }))
    expect(onChange).toHaveBeenLastCalledWith(350)

    fireEvent(window, new PointerEvent("pointermove", { clientX: 500 }))
    expect(onChange).toHaveBeenLastCalledWith(400)

    fireEvent(window, new PointerEvent("pointerup", { clientX: 500 }))
    expect(sep).not.toHaveAttribute("data-dragging")
    expect(onCommit).toHaveBeenCalledWith(400, expect.objectContaining({ velocity: expect.any(Number) }))
  })
})
