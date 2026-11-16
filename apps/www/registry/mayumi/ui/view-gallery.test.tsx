import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ViewGallery, type ViewGalleryItem, useViewGalleryTilt } from "./view-gallery"

const reducedMotion = vi.hoisted(() => ({ current: false }))
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}))

afterEach(() => {
  reducedMotion.current = false
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const items: ViewGalleryItem[] = [
  { id: "a", name: "Alpha", description: "first", preview: <div>preview-a</div> },
  { id: "b", name: "Beta", description: "second", preview: <div>preview-b</div> },
  { id: "c", name: "Gamma", description: "third", preview: <div>preview-c</div> },
]

function carousel() {
  return screen.getByRole("group", { name: /available items/i })
}

describe("ViewGallery", () => {
  it("starts on the applied item with the apply button disabled", () => {
    render(<ViewGallery items={items} appliedId="b" onApply={vi.fn()} />)
    expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Beta selected" })).toBeDisabled()
    expect(screen.getByText("Applied: Beta")).toBeInTheDocument()
  })

  it("navigates with the arrow buttons and disables them at the edges", async () => {
    render(<ViewGallery items={items} />)
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(screen.getByRole("heading", { name: "Gamma" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("navigates with the keyboard and the dots", async () => {
    render(<ViewGallery items={items} />)
    fireEvent.keyDown(carousel(), { key: "ArrowRight" })
    expect(screen.getByRole("heading", { name: "Beta" })).toBeInTheDocument()
    fireEvent.keyDown(carousel(), { key: "ArrowLeft" })
    expect(screen.getByRole("heading", { name: "Alpha" })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Show Gamma" }))
    expect(screen.getByRole("heading", { name: "Gamma" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Show Gamma" })).toHaveAttribute("aria-current", "true")
  })

  it("calls onApply with the active id", async () => {
    const onApply = vi.fn()
    render(<ViewGallery items={items} appliedId="a" onApply={onApply} />)
    await userEvent.click(screen.getByRole("button", { name: "Next" }))
    await userEvent.click(screen.getByRole("button", { name: "Use Beta" }))
    expect(onApply).toHaveBeenCalledWith("b")
  })

  it("surfaces an error when applying fails", async () => {
    const onApply = vi.fn().mockRejectedValue(new Error("nope"))
    render(<ViewGallery items={items} onApply={onApply} />)
    await userEvent.click(screen.getByRole("button", { name: "Use Alpha" }))
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't apply")
  })

  it("hides the apply affordances without onApply", () => {
    render(<ViewGallery items={items} />)
    expect(screen.queryByRole("button", { name: /use /i })).not.toBeInTheDocument()
    expect(screen.queryByText(/applied:/i)).not.toBeInTheDocument()
  })

  it("waits for onApply to settle before re-enabling", async () => {
    let resolveApply: () => void = () => {}
    const onApply = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveApply = resolve
        }),
    )
    render(<ViewGallery items={items} onApply={onApply} />)
    const button = screen.getByRole("button", { name: "Use Alpha" })
    await userEvent.click(button)
    expect(onApply).toHaveBeenCalledWith("a")
    expect(button).toBeDisabled()
    expect(button).toHaveTextContent("Saving…")
    resolveApply()
    await waitFor(() => expect(button).toBeEnabled())
  })
})

describe("useViewGalleryTilt", () => {
  let finePointer = true
  let frameId = 0
  let frameTime = 0
  let callbacks = new Map<number, FrameRequestCallback>()

  function Slide({ active = true }: { active?: boolean }) {
    const { slideRef, previewRef } = useViewGalleryTilt({ active, position: "active" })
    return (
      <div ref={slideRef} data-testid="slide">
        <div ref={previewRef} data-testid="preview" />
      </div>
    )
  }

  function advanceFrames(count = 120) {
    for (let index = 0; index < count; index += 1) {
      const pending = [...callbacks.values()]
      callbacks.clear()
      frameTime += 16.67
      for (const callback of pending) {
        callback(frameTime)
      }
    }
  }

  beforeEach(() => {
    finePointer = true
    frameId = 0
    frameTime = 0
    callbacks = new Map()
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: finePointer,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }))
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameId += 1
      callbacks.set(frameId, callback)
      return frameId
    })
    vi.stubGlobal("cancelAnimationFrame", (id: number) => callbacks.delete(id))
    Element.prototype.getBoundingClientRect = vi.fn(
      () =>
        ({
          x: 100,
          y: 100,
          width: 367,
          height: 500,
          top: 100,
          left: 100,
          right: 467,
          bottom: 600,
          toJSON: () => ({}),
        }) as DOMRect,
    )
  })

  it("tilts toward the pointer with a subtle scale and resets on leave", () => {
    render(<Slide />)
    const slide = screen.getByTestId("slide")
    const preview = screen.getByTestId("preview")

    fireEvent.pointerEnter(slide, { clientX: 450, clientY: 120, pointerType: "mouse" })
    expect(preview).toHaveAttribute("data-tilting", "true")
    advanceFrames()
    expect(preview.style.transform).toContain("rotateX(")
    expect(preview.style.transform).toContain("rotateY(")
    const scale = Number(preview.style.transform.match(/scale\(([\d.]+)\)/)?.[1])
    expect(scale).toBeCloseTo(1.02, 3)

    fireEvent.pointerLeave(slide, { pointerType: "mouse" })
    advanceFrames(240)
    expect(preview.style.getPropertyValue("--glow-opacity")).toBe("0")
    expect(preview).not.toHaveAttribute("data-tilting")
    expect(preview.style.transform).toBe("")
  })

  it("does not animate for reduced motion", () => {
    reducedMotion.current = true
    render(<Slide />)
    fireEvent.pointerEnter(screen.getByTestId("slide"), { clientX: 450, clientY: 120, pointerType: "mouse" })
    expect(screen.getByTestId("preview")).not.toHaveAttribute("data-tilting")
  })

  it("does not animate for coarse pointers or touch events", () => {
    finePointer = false
    const { rerender } = render(<Slide />)
    fireEvent.pointerEnter(screen.getByTestId("slide"), { clientX: 450, clientY: 120, pointerType: "mouse" })
    expect(screen.getByTestId("preview")).not.toHaveAttribute("data-tilting")

    finePointer = true
    rerender(<Slide />)
    fireEvent.pointerEnter(screen.getByTestId("slide"), { clientX: 450, clientY: 120, pointerType: "touch" })
    expect(screen.getByTestId("preview")).not.toHaveAttribute("data-tilting")
  })

  it("clears stale transform and glow when the slide becomes inactive", () => {
    const { rerender } = render(<Slide />)
    const slide = screen.getByTestId("slide")
    const preview = screen.getByTestId("preview")
    fireEvent.pointerEnter(slide, { clientX: 450, clientY: 120, pointerType: "mouse" })
    advanceFrames(20)
    expect(preview).toHaveAttribute("data-tilting", "true")

    rerender(<Slide active={false} />)
    expect(preview.style.transform).toBe("")
    expect(preview.style.getPropertyValue("--glow-opacity")).toBe("0")
    expect(preview).not.toHaveAttribute("data-tilting")
  })
})
