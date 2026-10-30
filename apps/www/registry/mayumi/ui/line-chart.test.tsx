import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { LineChart } from "./line-chart"

const data = [
  { label: "周一", value: 12 },
  { label: "周二", value: 18 },
  { label: "周三", value: 9 },
  { label: "周四", value: 24 },
]

function svg() {
  return document.querySelector('[data-slot="line-chart-svg"]') as SVGSVGElement
}

describe("LineChart", () => {
  it("renders a line and an accessible data table", () => {
    render(<LineChart aria-label="每周访问量" data={data} />)
    expect(screen.getByRole("group", { name: "每周访问量" })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="line-chart-line"]')).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "24" })).toBeInTheDocument()
    expect(document.querySelector('[data-slot="line-chart-area"]')).toBeInTheDocument()
  })

  it("shows the nearest value from pointer input", () => {
    render(<LineChart data={data} />)
    vi.spyOn(svg(), "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 640,
      bottom: 200,
      width: 640,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect)
    fireEvent.pointerMove(svg(), { clientX: 431, clientY: 50 })
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("周三")
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("9")
  })

  it("supports keyboard inspection without animation", async () => {
    render(<LineChart data={data} />)
    screen.getByRole("group").focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("周一")
    await userEvent.keyboard("{ArrowRight}")
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("周二")
    await userEvent.keyboard("{End}")
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("周四")
    await userEvent.keyboard("{Escape}")
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).not.toBeInTheDocument()
  })

  it("can hide the area, grid, and labels", () => {
    render(<LineChart data={data} showArea={false} showGrid={false} showLabels={false} />)
    expect(document.querySelector('[data-slot="line-chart-area"]')).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="line-chart-grid-line"]')).not.toBeInTheDocument()
    expect(document.querySelector("text")).not.toBeInTheDocument()
  })

  it("formats values and supports negative domains", () => {
    render(
      <LineChart
        data={[
          { label: "A", value: -5 },
          { label: "B", value: 5 },
        ]}
        formatValue={(value) => `${value.toFixed(1)}°`}
      />
    )
    expect(screen.getAllByText("5.0°").length).toBeGreaterThan(0)
    expect(screen.getAllByText("-5.0°").length).toBeGreaterThan(0)
  })

  it("shows a single point without requiring interaction", () => {
    render(<LineChart data={[{ label: "现在", value: 12 }]} />)
    expect(document.querySelector('[data-slot="line-chart-single-point"]')).toBeInTheDocument()
  })

  it("keeps the selected index within a shorter data set", async () => {
    const { rerender } = render(<LineChart data={data} />)
    screen.getByRole("group").focus()
    await userEvent.keyboard("{End}")
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("周四")

    rerender(<LineChart data={data.slice(0, 2)} />)
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("周二")
  })

  it("draws a smooth curve and reads continuously between samples", () => {
    render(<LineChart data={data} smooth />)
    expect(document.querySelector('[data-slot="line-chart-line"]')).toHaveAttribute(
      "d",
      expect.stringContaining("C")
    )
    vi.spyOn(svg(), "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      right: 640,
      bottom: 200,
      width: 640,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect)
    fireEvent.pointerMove(svg(), { clientX: 140.7, clientY: 50 })
    expect(document.querySelector('[data-slot="line-chart-tooltip"]')).toHaveTextContent("15")
  })

  it("switches time windows with a shared moving pill", async () => {
    render(
      <LineChart
        data={data}
        windows={[
          { label: "1H", data: [{ label: "最近", value: 99 }] },
          { label: "1D", data },
        ]}
      />
    )
    await userEvent.click(screen.getByRole("button", { name: "1D" }))
    expect(screen.getByRole("cell", { name: "24" })).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "1H" }))
    expect(screen.getByRole("cell", { name: "99" })).toBeInTheDocument()
  })

  it("renders an empty state and ignores non-finite values", () => {
    render(<LineChart data={[{ label: "无效", value: Number.NaN }]} />)
    expect(document.querySelector('[data-slot="line-chart-empty"]')).toHaveTextContent("暂无数据")
    expect(document.querySelector('[data-slot="line-chart-line"]')).not.toBeInTheDocument()
  })
})
