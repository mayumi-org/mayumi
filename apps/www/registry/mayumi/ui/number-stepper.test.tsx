import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { NumberStepper } from "./number-stepper"

const reducedMotion = vi.hoisted(() => ({ current: false }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}))

afterEach(() => {
  reducedMotion.current = false
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function value() {
  return screen.getByRole("spinbutton")
}

function prepare(element: HTMLElement) {
  element.setPointerCapture = vi.fn()
  element.releasePointerCapture = vi.fn()
  element.hasPointerCapture = vi.fn(() => true)
}

describe("NumberStepper", () => {
  it("exposes spinbutton semantics and steps with the buttons", async () => {
    render(<NumberStepper aria-label="数量" defaultValue={95} />)
    expect(value()).toHaveAttribute("aria-valuenow", "95")
    await userEvent.click(screen.getByRole("button", { name: "增加数值" }))
    expect(value()).toHaveAttribute("aria-valuenow", "96")
    await userEvent.click(screen.getByRole("button", { name: "减少数值" }))
    expect(value()).toHaveAttribute("aria-valuenow", "95")
  })

  it("clamps values and disables the corresponding button", async () => {
    render(<NumberStepper defaultValue={99} max={100} />)
    const increment = screen.getByRole("button", { name: "增加数值" })
    await userEvent.click(increment)
    expect(value()).toHaveAttribute("aria-valuenow", "100")
    expect(increment).toBeDisabled()
  })

  it("accelerates while a button is held", () => {
    vi.useFakeTimers()
    render(<NumberStepper defaultValue={95} />)
    const increment = screen.getByRole("button", { name: "增加数值" })
    fireEvent.pointerDown(increment, { pointerId: 1, isPrimary: true, button: 0 })
    act(() => {
      vi.advanceTimersByTime(1700)
    })
    fireEvent.pointerUp(increment, { pointerId: 1, isPrimary: true, button: 0 })
    expect(Number(value().getAttribute("aria-valuenow"))).toBeGreaterThan(105)
  })

  it("stops holding when the value reaches a boundary", () => {
    vi.useFakeTimers()
    reducedMotion.current = true
    render(<NumberStepper defaultValue={99} max={100} />)
    fireEvent.pointerDown(screen.getByRole("button", { name: "增加数值" }), {
      pointerId: 1,
      isPrimary: true,
      button: 0,
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(value()).toHaveAttribute("aria-valuenow", "100")
    expect(vi.getTimerCount()).toBe(0)
  })

  it("rolls each digit forward through a carry", async () => {
    render(<NumberStepper defaultValue={9} />)
    await userEvent.click(screen.getByRole("button", { name: "增加数值" }))
    expect(value()).toHaveAttribute("aria-valuenow", "10")
    const tens = document.querySelector('[data-place="1"]') as HTMLElement
    const ones = document.querySelector('[data-place="0"]') as HTMLElement
    await waitFor(() => {
      expect(tens.style.transform).toBe("translateY(-32px)")
      expect(ones.style.transform).toBe("translateY(0px)")
    })
  })

  it("settles digits immediately from the keyboard", async () => {
    render(<NumberStepper defaultValue={9} />)
    value().focus()
    await userEvent.keyboard("{ArrowUp}")
    expect(value()).toHaveAttribute("aria-valuenow", "10")
    expect((document.querySelector('[data-place="1"]') as HTMLElement).style.transform).toBe(
      "translateY(-32px)"
    )
  })

  it("supports optional vertical dragging", () => {
    reducedMotion.current = true
    render(<NumberStepper defaultValue={10} />)
    const element = value()
    prepare(element)
    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientY: 100 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientY: 70 })
    fireEvent.pointerUp(element, { pointerId: 1, isPrimary: true, clientY: 70 })
    expect(value()).toHaveAttribute("aria-valuenow", "12")
  })

  it("can disable dragging and the entire control", async () => {
    const { rerender } = render(<NumberStepper defaultValue={10} draggable={false} />)
    prepare(value())
    fireEvent.pointerDown(value(), { pointerId: 1, isPrimary: true, clientY: 100 })
    fireEvent.pointerMove(value(), { pointerId: 1, isPrimary: true, clientY: 50 })
    expect(value()).toHaveAttribute("aria-valuenow", "10")

    rerender(<NumberStepper defaultValue={10} disabled />)
    expect(value()).toHaveAttribute("aria-disabled", "true")
    expect(screen.getByRole("button", { name: "增加数值" })).toBeDisabled()
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<NumberStepper value={20} />)
    expect(value()).toHaveAttribute("aria-valuenow", "20")
    rerender(<NumberStepper value={30} />)
    expect(value()).toHaveAttribute("aria-valuenow", "30")
  })
})
