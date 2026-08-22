import { describe, expect, it } from "vitest"
import { springs } from "./motion"

describe("springs", () => {
  it("exposes the three canonical presets as spring transitions", () => {
    for (const name of ["snappy", "smooth", "gentle"] as const) {
      expect(springs[name].type).toBe("spring")
      expect(springs[name].stiffness).toBeGreaterThan(0)
      expect(springs[name].damping).toBeGreaterThan(0)
    }
  })
  it("orders presets from stiffest to softest", () => {
    expect(springs.snappy.stiffness!).toBeGreaterThan(springs.smooth.stiffness!)
    expect(springs.smooth.stiffness!).toBeGreaterThan(springs.gentle.stiffness!)
  })
})
