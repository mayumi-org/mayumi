import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { TimeScrubber } from "./time-scrubber"

const reducedMotion = vi.hoisted(() => ({ current: false }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}))

afterEach(() => {
  reducedMotion.current = false
  vi.restoreAllMocks()
})

function ruler() {
  return screen.getByRole("slider")
}

function prepare(element: HTMLElement) {
  element.setPointerCapture = vi.fn()
  element.releasePointerCapture = vi.fn()
  element.hasPointerCapture = vi.fn(() => true)
}

describe("TimeScrubber", () => {
  it("exposes the time through slider semantics", () => {
    render(<TimeScrubber aria-label="会议时间" defaultValue={570} />)
    expect(ruler()).toHaveAttribute("aria-valuenow", "570")
    expect(ruler()).toHaveAttribute("aria-valuetext", "9:30 AM")
  })

  it("supports 24-hour labels", () => {
    render(<TimeScrubber defaultValue={810} format="24h" />)
    expect(ruler()).toHaveAttribute("aria-valuetext", "13:30")
  })

  it("changes by one step immediately from the keyboard", async () => {
    const onValueChange = vi.fn()
    render(<TimeScrubber defaultValue={570} onValueChange={onValueChange} />)
    ruler().focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onValueChange).toHaveBeenLastCalledWith(585)
    expect(ruler()).toHaveAttribute("aria-valuenow", "585")
  })

  it("drags the ruler and snaps to the nearest step", async () => {
    const onValueChange = vi.fn()
    render(<TimeScrubber defaultValue={570} momentum={0} onValueChange={onValueChange} />)
    const element = ruler()
    prepare(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 150 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 110 })
    fireEvent.pointerUp(element, { pointerId: 1, isPrimary: true, clientX: 110 })

    await waitFor(() => expect(onValueChange).toHaveBeenLastCalledWith(585), {
      timeout: 3000,
    })
  })

  it("ignores additional pointers", () => {
    render(<TimeScrubber defaultValue={570} />)
    const element = ruler()
    prepare(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 150 })
    fireEvent.pointerDown(element, { pointerId: 2, clientX: 150 })
    fireEvent.pointerMove(element, { pointerId: 2, clientX: 50 })
    expect(ruler()).toHaveAttribute("aria-valuenow", "570")
  })

  it("settles on a step when pointer capture is lost", () => {
    reducedMotion.current = true
    render(<TimeScrubber defaultValue={570} />)
    const element = ruler()
    prepare(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 150 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 110 })
    fireEvent.lostPointerCapture(element, { pointerId: 1 })
    expect(ruler()).toHaveAttribute("aria-valuenow", "585")
  })

  it("snaps immediately after dragging with reduced motion", () => {
    reducedMotion.current = true
    render(<TimeScrubber defaultValue={570} momentum={0} />)
    const element = ruler()
    prepare(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 150 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 110 })
    fireEvent.pointerUp(element, { pointerId: 1, isPrimary: true, clientX: 110 })
    expect(ruler()).toHaveAttribute("aria-valuenow", "585")
  })

  it("supports horizontal trackpad gestures without trapping vertical scrolling", async () => {
    reducedMotion.current = true
    render(<TimeScrubber defaultValue={570} />)
    const element = ruler()

    fireEvent.wheel(element, { deltaX: 0, deltaY: 30 })
    expect(ruler()).toHaveAttribute("aria-valuenow", "570")
    fireEvent.wheel(element, { deltaX: 30, deltaY: 0 })
    await waitFor(() => expect(ruler()).toHaveAttribute("aria-valuenow", "585"))
  })

  it("follows an externally controlled value", () => {
    const { rerender } = render(<TimeScrubber value={570} />)
    expect(ruler()).toHaveAttribute("aria-valuenow", "570")
    rerender(<TimeScrubber value={720} />)
    expect(ruler()).toHaveAttribute("aria-valuenow", "720")
  })
})
