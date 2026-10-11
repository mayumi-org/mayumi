import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

describe("Card", () => {
  it("renders every slot", () => {
    render(
      <Card data-testid="c">
        <CardHeader>
          <CardTitle>屏幕录制</CardTitle>
          <CardDescription>允许下列 App 录制屏幕</CardDescription>
        </CardHeader>
        <CardContent>内容</CardContent>
        <CardFooter>底部</CardFooter>
      </Card>
    )
    expect(screen.getByTestId("c")).toHaveAttribute("data-slot", "card")
    expect(screen.getByRole("heading", { name: "屏幕录制" })).toBeInTheDocument()
    expect(screen.getByText("允许下列 App 录制屏幕")).toBeInTheDocument()
    expect(screen.getByText("内容")).toBeInTheDocument()
    expect(screen.getByText("底部")).toBeInTheDocument()
  })

  it("defaults to the flat tint fill", () => {
    render(<Card data-testid="c" />)
    const el = screen.getByTestId("c")
    expect(el).toHaveAttribute("data-variant", "flat")
    expect(el).toHaveClass("bg-fill")
  })

  it("raised carries a solid surface and a shadow", () => {
    render(<Card data-testid="c" variant="raised" />)
    const el = screen.getByTestId("c")
    expect(el).toHaveAttribute("data-variant", "raised")
    expect(el).toHaveClass("bg-surface")
    // 抬离一层要靠投影读出来，只换底色不够
    expect(el).toHaveClass("shadow-[var(--shadow-raised)]")
  })
})
