import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"

describe("Avatar", () => {
  it("shows the fallback when no image resolves", () => {
    render(
      <Avatar data-testid="a">
        <AvatarFallback>蒋</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByTestId("a")).toHaveAttribute("data-slot", "avatar")
    expect(screen.getByText("蒋")).toBeInTheDocument()
  })

  it("keeps the fallback until the image actually loads", () => {
    render(
      <Avatar>
        <AvatarImage src="/a.png" alt="蒋威" />
        <AvatarFallback>蒋</AvatarFallback>
      </Avatar>
    )
    // 图片没解码完就先不挂到 DOM 上——避免加载中闪出一块空白方框
    expect(screen.queryByAltText("蒋威")).toBeNull()
    expect(screen.getByText("蒋")).toBeInTheDocument()
  })

  it("supports the three sizes", () => {
    const { rerender } = render(<Avatar data-testid="a" />)
    expect(screen.getByTestId("a")).toHaveClass("size-8")
    rerender(<Avatar data-testid="a" size="sm" />)
    expect(screen.getByTestId("a")).toHaveClass("size-5")
    rerender(<Avatar data-testid="a" size="lg" />)
    expect(screen.getByTestId("a")).toHaveClass("size-12")
  })

  it("keeps a neutral tint base so it composites on any material", () => {
    render(<Avatar data-testid="a" />)
    expect(screen.getByTestId("a")).toHaveClass("bg-fill")
  })
})
