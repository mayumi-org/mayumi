import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c")
  })
  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
  it("keeps the theme font size next to a text color", () => {
    expect(cn("text-ui text-fg")).toBe("text-ui text-fg")
  })
  it("treats theme font size and radius tokens as conflicting with the stock scale", () => {
    expect(cn("text-ui", "text-xs")).toBe("text-xs")
    expect(cn("rounded-control", "rounded-full")).toBe("rounded-full")
    expect(cn("rounded-full", "rounded-card")).toBe("rounded-card")
  })
})
