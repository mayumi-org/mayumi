import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { WakeSlider } from "./wake-slider"

const reducedMotion = vi.hoisted(() => ({ current: false }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}))

afterEach(() => {
  reducedMotion.current = false
  vi.restoreAllMocks()
})

function control() {
  return document.querySelector('[data-slot="wake-slider-control"]') as HTMLElement
}

function mockTrackRect(element: HTMLElement) {
  element.setPointerCapture = vi.fn()
  element.releasePointerCapture = vi.fn()
  element.hasPointerCapture = vi.fn(() => true)
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    right: 300,
    bottom: 52,
    width: 300,
    height: 52,
    x: 0,
    y: 0,
    toJSON: () => {},
  } as DOMRect)
}

function scales() {
  return Array.from(document.querySelectorAll('[data-slot="wake-slider-bar"]')).map(
    (bar) =>
      Number(
        (bar as HTMLElement).style.transform.match(/scaleY\(([\d.]+)\)/)?.[1] ?? 1
      )
  )
}

describe("WakeSlider", () => {
  it("exposes the value via the slider role", () => {
    render(<WakeSlider aria-label="音量" defaultValue={30} />)
    expect(screen.getByRole("slider", { name: "音量" })).toHaveAttribute(
      "aria-valuenow",
      "30"
    )
  })

  it("moves with keyboard arrows without starting the wake", async () => {
    const onValueChange = vi.fn()
    render(<WakeSlider aria-label="音量" defaultValue={30} onValueChange={onValueChange} />)
    const thumb = screen.getByRole("slider")
    thumb.focus()
    await userEvent.keyboard("{ArrowRight}")

    expect(onValueChange).toHaveBeenCalled()
    expect(document.querySelector('[data-slot="wake-slider-bar"]')).toHaveStyle({
      transform: "scaleY(1)",
    })
  })

  it("renders the requested number of bars", () => {
    render(<WakeSlider aria-label="音量" bars={20} />)
    expect(document.querySelectorAll('[data-slot="wake-slider-bar"]')).toHaveLength(20)
  })

  it("raises crossed bars with energy from a drag", async () => {
    render(<WakeSlider aria-label="音量" defaultValue={0} />)
    const element = control()
    mockTrackRect(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 0 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 240 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 250 })
    fireEvent.pointerUp(element, { pointerId: 1, isPrimary: true, clientX: 250 })

    await waitFor(() => {
      const bars = document.querySelectorAll('[data-slot="wake-slider-bar"]')
      expect(
        Array.from(bars).some(
          (bar) => (bar as HTMLElement).style.transform !== "scaleY(1)"
        )
      ).toBe(true)
    })

    await waitFor(
      () => {
        const bars = document.querySelectorAll('[data-slot="wake-slider-bar"]')
        for (const bar of bars) {
          expect(bar).toHaveStyle({ transform: "scaleY(1.000)" })
        }
      },
      { timeout: 3000 }
    )
  })

  it("resets raised bars when the bar count changes", async () => {
    const { rerender } = render(<WakeSlider aria-label="音量" defaultValue={0} />)
    const element = control()
    mockTrackRect(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 0 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 240 })
    await waitFor(() => {
      expect(scales().some((scale) => scale > 1)).toBe(true)
    })

    rerender(<WakeSlider aria-label="音量" defaultValue={0} bars={20} />)
    expect(scales().every((scale) => scale === 1)).toBe(true)
  })

  it("ignores additional pointers during a drag", async () => {
    render(<WakeSlider aria-label="音量" defaultValue={0} />)
    const element = control()
    mockTrackRect(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 0 })
    fireEvent.pointerDown(element, { pointerId: 2, clientX: 0 })
    fireEvent.pointerMove(element, { pointerId: 2, clientX: 240 })
    expect(scales().every((scale) => scale === 1)).toBe(true)

    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 240 })
    await waitFor(() => {
      expect(scales().some((scale) => scale > 1)).toBe(true)
    })
  })

  it("stops the wake when pointer capture is lost", () => {
    render(<WakeSlider aria-label="音量" defaultValue={0} />)
    const element = control()
    mockTrackRect(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 0 })
    fireEvent.lostPointerCapture(element, { pointerId: 1 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 240 })
    expect(scales().every((scale) => scale === 1)).toBe(true)
  })

  it("allows wake values above 60", async () => {
    render(<WakeSlider aria-label="音量" defaultValue={0} wake={100} />)
    const element = control()
    mockTrackRect(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 0 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 240 })
    await waitFor(() => {
      expect(scales().some((scale) => scale > 2.6)).toBe(true)
    })
  })

  it("does not start a wake with reduced motion", () => {
    reducedMotion.current = true
    render(<WakeSlider aria-label="音量" defaultValue={0} />)
    const element = control()
    mockTrackRect(element)

    fireEvent.pointerDown(element, { pointerId: 1, isPrimary: true, clientX: 0 })
    fireEvent.pointerMove(element, { pointerId: 1, isPrimary: true, clientX: 240 })

    const bars = document.querySelectorAll('[data-slot="wake-slider-bar"]')
    for (const bar of bars) {
      expect(bar).toHaveStyle({ transform: "scaleY(1)" })
    }
  })
})
