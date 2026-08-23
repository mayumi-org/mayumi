import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

describe("Tooltip", () => {
  it("renders content when open", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>目标</TooltipTrigger>
          <TooltipContent>提示文本</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.getByText("提示文本")).toBeInTheDocument()
  })

  it("hides content when closed", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>目标</TooltipTrigger>
          <TooltipContent>提示文本</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
    expect(screen.queryByText("提示文本")).toBeNull()
  })
})
