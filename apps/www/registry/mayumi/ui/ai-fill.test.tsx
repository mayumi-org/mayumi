import { act, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AIFill } from "./ai-fill"

afterEach(() => {
  vi.useRealTimers()
})

describe("AIFill", () => {
  it("renders children statically when not triggered", () => {
    render(
      <AIFill trigger={false}>
        <p>row a</p>
        <p>row b</p>
      </AIFill>,
    )
    expect(screen.getByText("row a")).toBeInTheDocument()
    expect(document.querySelector(".aifill-bloomfield")).toBeNull()
    expect(document.querySelector(".aifill-item")).toBeNull()
  })

  it("plays the effect on the trigger edge with bottom-up stagger and callbacks", () => {
    vi.useFakeTimers()
    const onCovered = vi.fn()
    const onComplete = vi.fn()
    render(
      <AIFill trigger onCovered={onCovered} onComplete={onComplete}>
        <p>top</p>
        <p>bottom</p>
      </AIFill>,
    )
    expect(document.querySelector(".aifill-bloomfield")).not.toBeNull()

    // 自下而上 stagger：靠下的子节点延迟更短，先显影
    const items = document.querySelectorAll<HTMLElement>(".aifill-item")
    expect(items).toHaveLength(2)
    expect(items[0].style.animationDelay).toBe("240ms")
    expect(items[1].style.animationDelay).toBe("150ms")

    // 光晕遮住内容时回调（隐形换内容的时机）
    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(onCovered).toHaveBeenCalledOnce()
    expect(onComplete).not.toHaveBeenCalled()

    // 播放完毕：光晕卸载并回调
    act(() => {
      vi.advanceTimersByTime(1600)
    })
    expect(onComplete).toHaveBeenCalledOnce()
    expect(document.querySelector(".aifill-bloomfield")).toBeNull()
  })

  it("cancels cleanly when trigger resets mid-play", () => {
    vi.useFakeTimers()
    const onCovered = vi.fn()
    const onComplete = vi.fn()
    const { rerender } = render(
      <AIFill trigger onCovered={onCovered} onComplete={onComplete}>
        <p>row</p>
      </AIFill>,
    )
    act(() => {
      vi.advanceTimersByTime(100)
    })
    rerender(
      <AIFill trigger={false} onCovered={onCovered} onComplete={onComplete}>
        <p>row</p>
      </AIFill>,
    )
    expect(document.querySelector(".aifill-bloomfield")).toBeNull()
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(onCovered).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it("replays on the next trigger edge", () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    const { rerender } = render(
      <AIFill trigger onComplete={onComplete}>
        <p>row</p>
      </AIFill>,
    )
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    rerender(
      <AIFill trigger={false} onComplete={onComplete}>
        <p>row</p>
      </AIFill>,
    )
    rerender(
      <AIFill trigger onComplete={onComplete}>
        <p>row</p>
      </AIFill>,
    )
    expect(document.querySelector(".aifill-bloomfield")).not.toBeNull()
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(onComplete).toHaveBeenCalledTimes(2)
  })
})
