import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("merges conditional classes", () => {
    expect(cn("a", false && "b", "c")).toBe("a c")
  })
  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
})
